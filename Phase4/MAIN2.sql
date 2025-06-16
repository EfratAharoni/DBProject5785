-- תוכנית ראשית - מערכת ניהול אירועים משולבת (גרסה מתוקנת)
-- משלבת דוח אירועים + עדכון מחירים + ניקוי מערכת

DO $$
DECLARE
    -- משתנים עיקריים
    v_report_cursor REFCURSOR;
    v_event_record RECORD;
    v_processed_events INTEGER := 0;
    v_high_revenue_events INTEGER := 0;
    v_low_occupancy_events INTEGER := 0;
    
    -- פרמטרים לדוח
    v_start_date DATE := CURRENT_DATE - INTERVAL '60 days';
    v_end_date DATE := CURRENT_DATE + INTERVAL '30 days';
    v_min_rating INTEGER := 3;
    
    -- פרמטרים לעדכון מחירים
    v_concert_discount NUMERIC := 15.0;
    v_theater_discount NUMERIC := 10.0;
    v_days_threshold INTEGER := 14;
    
    -- משתנים סטטיסטיים
    v_total_revenue NUMERIC := 0;
    v_avg_occupancy NUMERIC := 0;
    v_events_needing_promotion INTEGER := 0;
    
    -- Exception handling
    v_error_count INTEGER := 0;
    v_current_operation VARCHAR(100);
    
BEGIN
    RAISE NOTICE '=== התחלת תוכנית ניהול אירועים משולבת ===';
    RAISE NOTICE 'תאריך התחלה: %', v_start_date;
    RAISE NOTICE 'תאריך סיום: %', v_end_date;
    RAISE NOTICE 'דירוג מינימלי: %', v_min_rating;
    
    -- שלב 1: יצירת דוח מפורט על אירועים
    BEGIN
        v_current_operation := 'Creating events report';
        RAISE NOTICE '';
        RAISE NOTICE '--- שלב 1: יצירת דוח אירועים ---';
        
        -- קריאה לפונקציה get_events_report
        SELECT get_events_report(v_start_date, v_end_date, v_min_rating) 
        INTO v_report_cursor;
        
        -- עיבוד תוצאות הדוח
        LOOP
            FETCH v_report_cursor INTO v_event_record;
            EXIT WHEN NOT FOUND;
            
            v_processed_events := v_processed_events + 1;
            v_total_revenue := v_total_revenue + COALESCE(v_event_record.event_revenue, 0);
            
            -- זיהוי אירועים בעלי הכנסות גבוהות
            IF v_event_record.event_revenue > 5000 THEN
                v_high_revenue_events := v_high_revenue_events + 1;
                RAISE NOTICE 'אירוע רווחי: % - סוג: % - הכנסות: $%', 
                           v_event_record.eventid, 
                           v_event_record.eventtype,
                           v_event_record.event_revenue;
            END IF;
            
            -- זיהוי אירועים עם תפוסה נמוכה הזקוקים לקידום
            IF v_event_record.occupancy_rate < 50 
               AND v_event_record.eventdate > CURRENT_DATE THEN
                v_low_occupancy_events := v_low_occupancy_events + 1;
                v_events_needing_promotion := v_events_needing_promotion + 1;
                
                RAISE NOTICE 'אירוע זקוק לקידום: % - תפוסה: %', 
                           v_event_record.eventid,
                           ROUND(v_event_record.occupancy_rate, 1);
                RAISE NOTICE '  מקומות זמינים: %', v_event_record.available_seats;
            END IF;
            
            -- חישוב ממוצע תפוסה
            v_avg_occupancy := v_avg_occupancy + COALESCE(v_event_record.occupancy_rate, 0);
            
            -- הדפסת פרטי אירוע מעניינים (רק לאירועים הראשונים)
            IF v_processed_events <= 3 THEN
                RAISE NOTICE 'אירוע %: % ב-%', 
                           v_event_record.eventid,
                           v_event_record.eventtype,
                           v_event_record.venname;
                RAISE NOTICE '  תאריך: % - תפוסה: %', 
                           v_event_record.eventdate,
                           ROUND(v_event_record.occupancy_rate, 1);
                RAISE NOTICE '  ביקורות: % - דירוג ממוצע: %', 
                           v_event_record.total_reviews,
                           ROUND(v_event_record.average_rating, 2);
            END IF;
        END LOOP;
        
        CLOSE v_report_cursor;
        
        -- חישוב סטטיסטיקות
        IF v_processed_events > 0 THEN
            v_avg_occupancy := v_avg_occupancy / v_processed_events;
        END IF;
        
        RAISE NOTICE 'סיכום דוח: % אירועים נמצאו', v_processed_events;
        RAISE NOTICE 'סה"כ הכנסות: $%', ROUND(v_total_revenue, 2);
        RAISE NOTICE 'ממוצע תפוסה: %', ROUND(v_avg_occupancy, 2);
                     
    EXCEPTION
        WHEN OTHERS THEN
            v_error_count := v_error_count + 1;
            RAISE NOTICE 'שגיאה בשלב %: %', v_current_operation, SQLERRM;
    END;
    
    -- שלב 2: עדכון מחירי כרטיסים לאירועים זקוקים לקידום
    BEGIN
        v_current_operation := 'Updating ticket pricing';
        RAISE NOTICE '';
        RAISE NOTICE '--- שלב 2: עדכון מחירי כרטיסים ---';
        
        IF v_events_needing_promotion > 0 THEN
            RAISE NOTICE 'מעדכן מחירים עבור אירועי קונצרטים';
            RAISE NOTICE 'הנחה: %', v_concert_discount;
            
            -- עדכון מחירים לקונצרטים
            CALL update_ticket_pricing_and_promotions(
                p_event_type := 'Concert',
                p_discount_percentage := v_concert_discount,
                p_min_days_before_event := v_days_threshold,
                p_max_price_increase := 30.0
            );
            
            RAISE NOTICE 'מעדכן מחירים עבור אירועי תיאטרון';
            RAISE NOTICE 'הנחה: %', v_theater_discount;
            
            -- עדכון מחירים לתיאטרון
            CALL update_ticket_pricing_and_promotions(
                p_event_type := 'Theater',
                p_discount_percentage := v_theater_discount,
                p_min_days_before_event := v_days_threshold,
                p_max_price_increase := 25.0
            );
        ELSE
            RAISE NOTICE 'לא נמצאו אירועים הזקוקים לעדכון מחירים';
        END IF;
        
    EXCEPTION
        WHEN OTHERS THEN
            v_error_count := v_error_count + 1;
            RAISE NOTICE 'שגיאה בשלב %: %', v_current_operation, SQLERRM;
    END;
    
    -- שלב 3: ניקוי מערכת אם יש הרבה אירועים ישנים
    BEGIN
        v_current_operation := 'System maintenance cleanup';
        RAISE NOTICE '';
        RAISE NOTICE '--- שלב 3: בדיקת צורך בניקוי מערכת ---';
        
        DECLARE
            v_old_events_count INTEGER;
        BEGIN
            -- בדיקת כמות אירועים ישנים
            SELECT COUNT(*)
            INTO v_old_events_count
            FROM events
            WHERE eventdate < CURRENT_DATE - INTERVAL '180 days';
            
            RAISE NOTICE 'נמצאו % אירועים ישנים (מעל 180 יום)', v_old_events_count;
            
            IF v_old_events_count > 100 THEN
                RAISE NOTICE 'מפעיל ניקוי מערכת במצב AGGRESSIVE';
                
                CALL system_maintenance_cleanup(
                    p_days_old := 365,
                    p_cleanup_mode := 'AGGRESSIVE'
                );
            ELSIF v_old_events_count > 50 THEN
                RAISE NOTICE 'מפעיל ניקוי מערכת במצב SAFE';
                
                CALL system_maintenance_cleanup(
                    p_days_old := 180,
                    p_cleanup_mode := 'SAFE'
                );
            ELSE
                RAISE NOTICE 'לא נדרש ניקוי מערכת כרגע';
            END IF;
        END;
        
    EXCEPTION
        WHEN OTHERS THEN
            v_error_count := v_error_count + 1;
            RAISE NOTICE 'שגיאה בשלב %: %', v_current_operation, SQLERRM;
    END;
    
    -- שלב 4: סיכום ודיווח
    BEGIN
        v_current_operation := 'Final summary';
        RAISE NOTICE '';
        RAISE NOTICE '=== סיכום תוכנית ניהול אירועים ===';
        RAISE NOTICE 'אירועים שעובדו: %', v_processed_events;
        RAISE NOTICE 'אירועים רווחיים: %', v_high_revenue_events;
        RAISE NOTICE 'אירועים עם תפוסה נמוכה: %', v_low_occupancy_events;
        RAISE NOTICE 'סה"כ הכנסות: $%', ROUND(v_total_revenue, 2);
        RAISE NOTICE 'ממוצע תפוסה: %', ROUND(v_avg_occupancy, 2);
        RAISE NOTICE 'שגיאות שאירעו: %', v_error_count;
        
        -- המלצות בהתבסס על הנתונים
        RAISE NOTICE '';
        RAISE NOTICE '--- המלצות ---';
        
        IF v_avg_occupancy < 60 THEN
            RAISE NOTICE '• ממוצע התפוסה נמוך - מומלץ לשפר אסטרטגיות שיווק';
        END IF;
        
        IF v_low_occupancy_events > (v_processed_events * 0.3) THEN
            RAISE NOTICE '• יותר מ-30 אחוז מהאירועים עם תפוסה נמוכה';
            RAISE NOTICE '  מומלץ לבחון מחירים והיצע';
        END IF;
        
        IF v_high_revenue_events > 0 THEN
            RAISE NOTICE '• יש % אירועים רווחיים', v_high_revenue_events;
            RAISE NOTICE '  מומלץ לנתח מה הופך אותם למוצלחים';
        END IF;
        
        IF v_error_count = 0 THEN
            RAISE NOTICE '✓ התוכנית הושלמה בהצלחה ללא שגיאות!';
        ELSE
            RAISE NOTICE '⚠ התוכנית הושלמה עם % שגיאות', v_error_count;
            RAISE NOTICE '  יש לבדוק הלוגים';
        END IF;
        
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'שגיאה חמורה בסיכום: %', SQLERRM;
    END;
    
    RAISE NOTICE '=== סיום תוכנית ניהול אירועים ===';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'שגיאה כללית בתוכנית: %', SQLERRM;
        RAISE;
END;
$$;