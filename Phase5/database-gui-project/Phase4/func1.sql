CREATE OR REPLACE FUNCTION manage_ticket_sales(
    p_event_id INTEGER,
    p_customer_id INTEGER,
    p_ticket_count INTEGER,
    p_max_price NUMERIC DEFAULT 1000.00
) 
RETURNS TABLE(
    ticket_id INTEGER,
    final_price NUMERIC,
    sale_status TEXT,
    seats_remaining INTEGER
) 
LANGUAGE plpgsql
AS $$
DECLARE
    v_event_record RECORD;
    v_ticket_price NUMERIC;
    v_total_cost NUMERIC;
    v_discount_rate NUMERIC := 0;
    v_counter INTEGER := 0;
    v_current_ticket_id INTEGER;
    
    -- Explicit cursor
    event_cursor CURSOR FOR 
        SELECT e.eventid, e.eventtype, e.eventdate, e.available_seats, v.capacity, v.venname
        FROM events e
        JOIN venue v ON e.venid = v.venid
        WHERE e.eventid = p_event_id;
BEGIN
    -- אתחול ערך החזרה
    sale_status := 'PENDING';

    -- פתיחת cursor ואחזור האירוע
    OPEN event_cursor;
    FETCH event_cursor INTO v_event_record;
    
    IF NOT FOUND THEN
        CLOSE event_cursor;
        RAISE EXCEPTION 'Invalid event ID: %', p_event_id;
    END IF;
    
    CLOSE event_cursor;

    -- בדיקת זמינות מושבים
    IF v_event_record.available_seats < p_ticket_count THEN
        RAISE EXCEPTION 'Not enough seats. Requested: %, Available: %', 
            p_ticket_count, v_event_record.available_seats;
    END IF;

    -- קביעת מחיר בסיס לפי קיבולת המקום
    v_ticket_price := CASE 
        WHEN v_event_record.capacity > 10000 THEN 150.00
        WHEN v_event_record.capacity > 5000 THEN 100.00
        WHEN v_event_record.capacity > 1000 THEN 75.00
        ELSE 50.00
    END;

    -- הכפלה לפי סוג האירוע
    v_ticket_price := CASE v_event_record.eventtype
        WHEN 'Concert' THEN v_ticket_price * 1.5
        WHEN 'Sports' THEN v_ticket_price * 1.3
        WHEN 'Theater' THEN v_ticket_price * 1.2
        ELSE v_ticket_price
    END;

    -- בדיקת חריגת מחיר
    IF v_ticket_price > p_max_price THEN
        RAISE EXCEPTION 'Ticket price %.2f exceeds max allowed %.2f', 
            v_ticket_price, p_max_price;
    END IF;

    -- הנחת כמות
    IF p_ticket_count >= 5 THEN
        v_discount_rate := 0.15;
    ELSIF p_ticket_count >= 3 THEN
        v_discount_rate := 0.10;
    END IF;

    v_ticket_price := v_ticket_price * (1 - v_discount_rate);
    v_total_cost := v_ticket_price * p_ticket_count;

    -- לולאת יצירת כרטיסים
    FOR v_counter IN 1..p_ticket_count LOOP
        INSERT INTO ticket (price, saledate, eventid, cusid)
        VALUES (v_ticket_price, CURRENT_DATE, p_event_id, p_customer_id)
        RETURNING ticketid INTO v_current_ticket_id;
        
        -- שורה לפלט
        ticket_id := v_current_ticket_id;
        final_price := v_ticket_price;
        sale_status := 'SOLD';
        
        RETURN NEXT;
    END LOOP;

    -- עדכון כמות מושבים זמינים
    UPDATE events 
    SET available_seats = available_seats - p_ticket_count
    WHERE eventid = p_event_id;

    -- השגת מצב עדכני של מושבים
    SELECT available_seats INTO seats_remaining
    FROM events 
    WHERE eventid = p_event_id;

    RETURN;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error: %', SQLERRM;
        sale_status := 'FAILED';
        RETURN;
END;
$$;
