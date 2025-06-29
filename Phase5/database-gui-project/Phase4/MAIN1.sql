-- MAIN PROGRAM 1: ticket sales + pricing update
DO $$
DECLARE
    ----------------------------------------------------------------
    -- פרמטרים ראשוניים למכירת כרטיסים
    ----------------------------------------------------------------
    v_event_id      INTEGER := 1;
    v_customer_id   INTEGER := 1;
    v_ticket_count  INTEGER := 3;
    v_max_price     NUMERIC := 200.00;

    ----------------------------------------------------------------
    -- פרמטרים לעדכון מחירים
    ----------------------------------------------------------------
    v_event_type          VARCHAR := 'Concert';
    v_discount_percentage NUMERIC := 15.0;
    v_min_days_before     INTEGER := 10;

    ----------------------------------------------------------------
    -- משתנים לסיכום
    ----------------------------------------------------------------
    v_ticket_record   RECORD;
    v_total_tickets   INTEGER := 0;
    v_total_revenue   NUMERIC := 0;
    v_success_cnt     INTEGER := 0;
    v_error_cnt       INTEGER := 0;
    v_summary_record  RECORD;
BEGIN
    RAISE NOTICE '=== MAIN PROGRAM 1: TICKET SALES AND PRICING MANAGEMENT ===';
    RAISE NOTICE 'Started at: %', CURRENT_TIMESTAMP;

    /* ------------------------------------------------------------
       PHASE 1 – ניסיון מכירת כרטיסים
    ------------------------------------------------------------ */
    RAISE NOTICE 'PHASE 1: SELLING TICKETS';
    RAISE NOTICE 'Attempting to sell % tickets for event % to customer %',
                 v_ticket_count, v_event_id, v_customer_id;

    BEGIN
        FOR v_ticket_record IN
            SELECT * FROM manage_ticket_sales(
                v_event_id,
                v_customer_id,
                v_ticket_count,
                v_max_price)
        LOOP
            IF v_ticket_record.sale_status = 'SOLD' THEN
                v_success_cnt   := v_success_cnt + 1;
                v_total_revenue := v_total_revenue + v_ticket_record.final_price;

                RAISE NOTICE
                      'SUCCESS: Ticket ID % sold for $%  (seats remaining: %)',
                      v_ticket_record.ticket_id,
                      v_ticket_record.final_price,
                      v_ticket_record.seats_remaining;
            ELSE
                v_error_cnt := v_error_cnt + 1;
                RAISE NOTICE 'FAILED: %', v_ticket_record.sale_status;
            END IF;
        END LOOP;

        v_total_tickets := v_success_cnt;

    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'ERROR in ticket sales: %', SQLERRM;
            v_error_cnt := v_error_cnt + 1;
    END;

    RAISE NOTICE '';
    RAISE NOTICE 'PHASE 1 RESULTS – sold:%  failed:%  revenue:$%',
                 v_success_cnt,
                 v_error_cnt,
                 ROUND(v_total_revenue,2);

    /* ------------------------------------------------------------
       PHASE 2 – עדכון מחירים
    ------------------------------------------------------------ */
    RAISE NOTICE '';
    RAISE NOTICE 'PHASE 2: UPDATING TICKET PRICING';
    RAISE NOTICE 'Event type: %  |  Discount: % %%  |  Min‑days: %',
                 v_event_type,
                 v_discount_percentage,
                 v_min_days_before;

    BEGIN
        CALL update_ticket_pricing_and_promotions(
            v_event_type,
            v_discount_percentage,
            v_min_days_before,
            50.00   -- max price increase
        );
        RAISE NOTICE 'Pricing update completed successfully';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'ERROR in pricing update: %', SQLERRM;
    END;

    /* ------------------------------------------------------------
       PHASE 3 – מכירה נוספת אחרי שינוי מחירים
    ------------------------------------------------------------ */
    RAISE NOTICE '';
    RAISE NOTICE 'PHASE 3: SELLING ADDITIONAL TICKETS AFTER PRICING UPDATE';

    v_event_id     := 2;
    v_customer_id  := 2;
    v_ticket_count := 2;
    v_success_cnt  := 0;
    v_error_cnt    := 0;

    BEGIN
        FOR v_ticket_record IN
            SELECT * FROM manage_ticket_sales(
                v_event_id,
                v_customer_id,
                v_ticket_count,
                v_max_price)
        LOOP
            IF v_ticket_record.sale_status = 'SOLD' THEN
                v_success_cnt   := v_success_cnt + 1;
                v_total_revenue := v_total_revenue + v_ticket_record.final_price;

                RAISE NOTICE
                      'SUCCESS: Ticket ID % sold for $%',
                      v_ticket_record.ticket_id,
                      v_ticket_record.final_price;
            ELSE
                v_error_cnt := v_error_cnt + 1;
                RAISE NOTICE 'FAILED: %', v_ticket_record.sale_status;
            END IF;
        END LOOP;

        v_total_tickets := v_total_tickets + v_success_cnt;

    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'ERROR in additional ticket sales: %', SQLERRM;
    END;

    /* ------------------------------------------------------------
       PHASE 4 – דוח סיכום
    ------------------------------------------------------------ */
    RAISE NOTICE '';
    RAISE NOTICE 'PHASE 4: SUMMARY REPORT';

    -- סטטיסטיקה על אירועים עתידיים
    FOR v_summary_record IN
        SELECT COUNT(*)  AS total_events,
               SUM(CASE WHEN available_seats = 0 THEN 1 ELSE 0 END) AS sold_out,
               AVG(available_seats) AS avg_avail
        FROM   events
        WHERE  eventdate >= CURRENT_DATE
    LOOP
        RAISE NOTICE 'Upcoming events: % | Sold‑out: % | Avg seats left: %',
                     v_summary_record.total_events,
                     v_summary_record.sold_out,
                     COALESCE(ROUND(v_summary_record.avg_avail),0);
    END LOOP;

    -- סטטיסטיקה של מכירות היום
    FOR v_summary_record IN
        SELECT COUNT(*) AS tickets_today,
               SUM(price) AS revenue_today,
               AVG(price) AS avg_price_today
        FROM   ticket
        WHERE  saledate = CURRENT_DATE
    LOOP
        RAISE NOTICE 'Today – tickets:%  revenue:$%  avg price:$%',
                     v_summary_record.tickets_today,
                     COALESCE(ROUND(v_summary_record.revenue_today,2),0),
                     COALESCE(ROUND(v_summary_record.avg_price_today,2),0);
    END LOOP;

    /* ------------------------------------------------------------
       סיכום כולל
    ------------------------------------------------------------ */
    RAISE NOTICE '';
    RAISE NOTICE '=== PROGRAM EXECUTION SUMMARY ===';
    RAISE NOTICE 'Total tickets sold: %', v_total_tickets;
    RAISE NOTICE 'Total revenue:      $%', ROUND(v_total_revenue,2);
    RAISE NOTICE 'Completed at: %',    CURRENT_TIMESTAMP;

    COMMIT;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'CRITICAL ERROR in main program: %', SQLERRM;
        ROLLBACK;
END;
$$;
