-- פונקציה 2: יצירת דוח מפורט על אירועים עם החזרת Ref Cursor
-- כוללת: ref cursor, implicit cursor, records, conditional logic

CREATE OR REPLACE FUNCTION get_events_report(
    p_start_date DATE DEFAULT CURRENT_DATE,
    p_end_date DATE DEFAULT CURRENT_DATE + INTERVAL '30 days',
    p_min_rating INTEGER DEFAULT 1
)
RETURNS REFCURSOR
LANGUAGE plpgsql
AS $$
DECLARE
    events_cursor REFCURSOR := 'events_report_cursor';
    v_event_record RECORD;
    v_total_events INTEGER := 0;
    v_total_revenue NUMERIC := 0;
    v_avg_rating NUMERIC;
    v_performer_list TEXT;
    v_sponsor_list TEXT;
BEGIN
    -- Count total events in date range
    SELECT COUNT(*) INTO v_total_events
    FROM events 
    WHERE eventdate BETWEEN p_start_date AND p_end_date;
    
    RAISE NOTICE 'Generating report for % events between % and %', 
                 v_total_events, p_start_date, p_end_date;
    
    -- Open cursor with complex query
    OPEN events_cursor FOR
        WITH event_stats AS (
            SELECT 
                e.eventid,
                e.eventtype,
                e.eventdate,
                e.available_seats,
                v.venname,
                v.location,
                v.capacity,
                COALESCE(ticket_stats.total_sold, 0) as tickets_sold,
                COALESCE(ticket_stats.revenue, 0) as event_revenue,
                COALESCE(review_stats.avg_rating, 0) as average_rating,
                COALESCE(review_stats.review_count, 0) as total_reviews,
                c.cusname as organizer_name
            FROM events e
            JOIN venue v ON e.venid = v.venid
            LEFT JOIN customers c ON e.cusid = c.cusid
            LEFT JOIN (
                SELECT 
                    eventid,
                    COUNT(*) as total_sold,
                    SUM(price) as revenue
                FROM ticket
                GROUP BY eventid
            ) ticket_stats ON e.eventid = ticket_stats.eventid
            LEFT JOIN (
                SELECT 
                    eventid,
                    AVG(rating::NUMERIC) as avg_rating,
                    COUNT(*) as review_count
                FROM reviews
                WHERE rating >= p_min_rating
                GROUP BY eventid
            ) review_stats ON e.eventid = review_stats.eventid
            WHERE e.eventdate BETWEEN p_start_date AND p_end_date
        ),
        performer_info AS (
            SELECT 
                ep.eventid,
                STRING_AGG(p.performername, ', ' ORDER BY p.performername) as performers
            FROM event_performer ep
            JOIN performer p ON ep.performerid = p.performerid
            GROUP BY ep.eventid
        ),
        sponsor_info AS (
            SELECT 
                es.eventid,
                STRING_AGG(s.sponsorname || ' ($' || COALESCE(s.payment, 0) || ')', ', ' 
                          ORDER BY s.payment DESC NULLS LAST) as sponsors
            FROM event_sponsor es
            JOIN sponsor s ON es.sponsorid = s.sponsorid
            GROUP BY es.eventid
        )
        SELECT 
            es.eventid,
            es.eventtype,
            es.eventdate,
            es.available_seats,
            es.venname,
            es.location,
            es.capacity,
            es.tickets_sold,
            es.event_revenue,
            es.average_rating,
            es.total_reviews,
            es.organizer_name,
            COALESCE(pi.performers, 'No performers') as performer_list,
            COALESCE(si.sponsors, 'No sponsors') as sponsor_list,
            CASE 
                WHEN es.tickets_sold = 0 THEN 'No Sales'
                WHEN es.tickets_sold < (es.capacity * 0.3) THEN 'Low Sales'
                WHEN es.tickets_sold < (es.capacity * 0.7) THEN 'Good Sales'
                ELSE 'Excellent Sales'
            END as sales_status,
            ROUND((es.tickets_sold::NUMERIC / NULLIF(es.capacity, 0)) * 100, 2) as occupancy_rate
        FROM event_stats es
        LEFT JOIN performer_info pi ON es.eventid = pi.eventid
        LEFT JOIN sponsor_info si ON es.eventid = si.eventid
        ORDER BY es.eventdate, es.event_revenue DESC;
    
    -- Calculate and log summary statistics using implicit cursor
    FOR v_event_record IN (
        SELECT 
            COUNT(*) as event_count,
            SUM(COALESCE(ticket_stats.revenue, 0)) as total_revenue,
            AVG(COALESCE(review_stats.avg_rating, 0)) as overall_avg_rating
        FROM events e
        LEFT JOIN (
            SELECT eventid, SUM(price) as revenue
            FROM ticket
            GROUP BY eventid
        ) ticket_stats ON e.eventid = ticket_stats.eventid
        LEFT JOIN (
            SELECT eventid, AVG(rating::NUMERIC) as avg_rating
            FROM reviews
            WHERE rating >= p_min_rating
            GROUP BY eventid
        ) review_stats ON e.eventid = review_stats.eventid
        WHERE e.eventdate BETWEEN p_start_date AND p_end_date
    ) LOOP
        RAISE NOTICE 'Report Summary - Events: %, Total Revenue: $%, Average Rating: %',
                     v_event_record.event_count, 
                     COALESCE(v_event_record.total_revenue, 0),
                     ROUND(COALESCE(v_event_record.overall_avg_rating, 0), 2);
    END LOOP;
    
    RETURN events_cursor;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error generating events report: %', SQLERRM;
        RETURN events_cursor;
END;
$$;