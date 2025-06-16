CREATE OR REPLACE PROCEDURE system_maintenance_cleanup(
    p_days_old        INTEGER DEFAULT 365,
    p_cleanup_mode    VARCHAR DEFAULT 'SAFE'  -- 'SAFE' | 'AGGRESSIVE'
)
LANGUAGE plpgsql
AS $$
DECLARE
    ----------------------------------------------------------------
    -- משתנים כלליים
    ----------------------------------------------------------------
    v_cutoff_date          DATE;
    v_old_events_scanned   INTEGER := 0;
    v_events_deleted       INTEGER := 0;
    v_orphan_tickets_del   INTEGER := 0;
    v_low_reviews_del      INTEGER := 0;
    v_inactive_customers   INTEGER := 0;
    v_venues_updated       INTEGER := 0;
    v_min_rating           INTEGER := 2; -- חוקק מינימום רייטינג ברירת מחדל

    v_event                RECORD;
    v_venue                RECORD;

    v_has_reviews          BOOLEAN;
    v_has_recent_activity  BOOLEAN;
BEGIN
    ----------------------------------------------------------------
    -- 1. ולידציית פרמטרים
    ----------------------------------------------------------------
    v_cutoff_date := CURRENT_DATE - p_days_old;

    IF p_cleanup_mode NOT IN ('SAFE','AGGRESSIVE') THEN
        RAISE EXCEPTION 'Invalid cleanup mode: %', p_cleanup_mode;
    END IF;

    RAISE NOTICE '--- CLEANUP STARTED --- mode=% cutoff=% days_old=%',
                 p_cleanup_mode, v_cutoff_date, p_days_old;

    ----------------------------------------------------------------
    -- 2. מחיקת אירועים ישנים (Phase 1)
    ----------------------------------------------------------------
    FOR v_event IN
        SELECT e.eventid,
               e.eventtype,
               e.eventdate
        FROM   events e
        WHERE  e.eventdate < v_cutoff_date
          AND  NOT EXISTS (
                 SELECT 1
                 FROM   ticket t
                 WHERE  t.eventid = e.eventid
                   AND  t.saledate > v_cutoff_date - 30
               )
        ORDER  BY e.eventdate
    LOOP
        v_old_events_scanned := v_old_events_scanned + 1;

        ----------------------------------------------------------------
        -- 2.1 בדיקה במצב SAFE – לא מוחקים אם יש ביקורות/פעילות
        ----------------------------------------------------------------
        IF p_cleanup_mode = 'SAFE' THEN
            SELECT EXISTS (SELECT 1 FROM reviews r WHERE r.eventid = v_event.eventid)
              INTO v_has_reviews;

            SELECT EXISTS (SELECT 1 FROM ticket t
                           WHERE t.eventid = v_event.eventid
                             AND t.saledate > v_cutoff_date)
              INTO v_has_recent_activity;

            IF v_has_reviews OR v_has_recent_activity THEN
                RAISE NOTICE 'SKIP event % ‑ has reviews/recent activity', v_event.eventid;
                CONTINUE;
            END IF;
        END IF;

        ----------------------------------------------------------------
        -- 2.2 מחיקה מושלמת של האירוע וכל מה שתלוי בו
        ----------------------------------------------------------------
        DELETE FROM event_performer WHERE eventid = v_event.eventid;
        DELETE FROM event_sponsor   WHERE eventid = v_event.eventid;
        DELETE FROM reviews         WHERE eventid = v_event.eventid;
        DELETE FROM ticket          WHERE eventid = v_event.eventid;
        DELETE FROM events          WHERE eventid = v_event.eventid;

        v_events_deleted := v_events_deleted + 1;

        RAISE NOTICE 'Deleted old event % (% from %)', v_event.eventid,
                     v_event.eventtype, v_event.eventdate;

        -- קוממיט קטן כל 50 כדי לא לנעול יותר מדי
        IF v_old_events_scanned % 50 = 0 THEN
            COMMIT;
            RAISE NOTICE '...% events scanned so far', v_old_events_scanned;
        END IF;
    END LOOP;

    ----------------------------------------------------------------
    -- 3. מחיקת כרטיסים יתומים (Phase 2)
    ----------------------------------------------------------------
    WITH del AS (
        DELETE FROM ticket t
        WHERE NOT EXISTS (SELECT 1 FROM events e WHERE e.eventid = t.eventid)
        RETURNING 1
    )
    SELECT COUNT(*) INTO v_orphan_tickets_del FROM del;

    RAISE NOTICE 'Deleted % orphaned tickets', v_orphan_tickets_del;

    ----------------------------------------------------------------
    -- 4. ביקורות בדירוג נמוך (Phase 3 – רק AGGRESSIVE)
    ----------------------------------------------------------------
    IF p_cleanup_mode = 'AGGRESSIVE' THEN
        DELETE FROM reviews
        WHERE rating < v_min_rating
          AND (revdescription IS NULL OR LENGTH(TRIM(revdescription)) < 10)
          AND revdate < v_cutoff_date;

        GET DIAGNOSTICS v_low_reviews_del = ROW_COUNT;
        RAISE NOTICE 'Deleted % low‑rated reviews (below rating %)', v_low_reviews_del, v_min_rating;
    ELSE
        SELECT COUNT(*) INTO v_low_reviews_del
        FROM reviews
        WHERE rating < v_min_rating
          AND (revdescription IS NULL OR LENGTH(TRIM(revdescription)) < 10)
          AND revdate < v_cutoff_date;
        RAISE NOTICE 'Found % low‑rated reviews (SAFE mode ‑ no deletion)', v_low_reviews_del;
    END IF;

    ----------------------------------------------------------------
    -- 5. לקוחות לא פעילים (Phase 4)
    ----------------------------------------------------------------
    IF p_cleanup_mode = 'AGGRESSIVE' THEN
        UPDATE customers
        SET    cuscontactinfo = COALESCE(cuscontactinfo, '') || ' [INACTIVE]'
        WHERE  cusid NOT IN (
                 SELECT DISTINCT cusid
                 FROM   ticket
                 WHERE  saledate > v_cutoff_date
               )
          AND  COALESCE(cuscontactinfo, '') NOT LIKE '%[INACTIVE]%';

        GET DIAGNOSTICS v_inactive_customers = ROW_COUNT;
        RAISE NOTICE 'Marked % customers as INACTIVE', v_inactive_customers;
    ELSE
        SELECT COUNT(*)
          INTO v_inactive_customers
        FROM customers c
        WHERE NOT EXISTS (
                SELECT 1 FROM ticket t
                WHERE  t.cusid = c.cusid
                  AND  t.saledate > v_cutoff_date
              );

        RAISE NOTICE 'Found % inactive customers (SAFE mode ‑ no changes made)',
                     v_inactive_customers;
    END IF;

    ----------------------------------------------------------------
    -- 6. עדכון סטטיסטיקת אולמות (Phase 5)
    ----------------------------------------------------------------
    FOR v_venue IN
        SELECT v.venid,
               COUNT(e.eventid)                                     AS recent_events,
               COALESCE(SUM(v.capacity - COALESCE(e.available_seats, v.capacity)),0) AS total_attendance
        FROM   venue v
        LEFT JOIN events e
               ON  e.venid = v.venid
               AND e.eventdate >= v_cutoff_date
        GROUP BY v.venid, v.capacity
        HAVING COUNT(e.eventid) > 0
    LOOP
        UPDATE venue
        SET venudescription = COALESCE(venudescription,'') ||
                              format(
                                ' [Updated %s | Events=%s | Attendance=%s]',
                                CURRENT_DATE,
                                v_venue.recent_events,
                                v_venue.total_attendance
                              )
        WHERE venid = v_venue.venid
          AND (venudescription IS NULL OR venudescription NOT LIKE '%Updated ' || CURRENT_DATE || '%');

        v_venues_updated := v_venues_updated + 1;
    END LOOP;

    RAISE NOTICE 'Updated statistics for % venues', v_venues_updated;

    ----------------------------------------------------------------
    -- 7. סיכום סופי
    ----------------------------------------------------------------
    RAISE NOTICE '';
    RAISE NOTICE '=== CLEANUP SUMMARY ===';
    RAISE NOTICE 'Mode: %', p_cleanup_mode;
    RAISE NOTICE 'Cutoff date: % (% days old)', v_cutoff_date, p_days_old;
    RAISE NOTICE 'Events scanned:     %', v_old_events_scanned;
    RAISE NOTICE 'Events deleted:     %', v_events_deleted;
    RAISE NOTICE 'Orphan tickets del: %', v_orphan_tickets_del;
    RAISE NOTICE 'Low reviews del:    %', v_low_reviews_del;
    RAISE NOTICE 'Inactive customers: %', v_inactive_customers;
    RAISE NOTICE 'Venues updated:     %', v_venues_updated;
    RAISE NOTICE '=== CLEANUP COMPLETED ===';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'ERROR in system maintenance cleanup: %', SQLERRM;
        RAISE;
END;
$$;