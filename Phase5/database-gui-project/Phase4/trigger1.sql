-- טריגר 1: עדכון אוטומטי של מקומות זמינים באירועים
-- כולל: trigger function עם DML, conditional logic, exception handling

-- יצירת הפונקציה לטריגר
CREATE OR REPLACE FUNCTION update_available_seats_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_venue_capacity INTEGER;
    v_current_sold INTEGER;
    v_new_available INTEGER;
    v_event_date DATE;
    v_event_type VARCHAR;
    v_price_diff NUMERIC;
BEGIN
    -- Get event details
    SELECT e.eventdate, e.eventtype, v.capacity
    INTO v_event_date, v_event_type, v_venue_capacity
    FROM events e
    JOIN venue v ON e.venid = v.venid
    WHERE e.eventid = COALESCE(NEW.eventid, OLD.eventid);
    
    -- Calculate current sold tickets
    SELECT COUNT(*)
    INTO v_current_sold
    FROM ticket
    WHERE eventid = COALESCE(NEW.eventid, OLD.eventid);
    
    -- Calculate new available seats
    v_new_available := v_venue_capacity - v_current_sold;
    
    -- Handle different trigger operations
    IF TG_OP = 'INSERT' THEN
        -- New ticket sold
        RAISE NOTICE 'New ticket sold for event %. Updating available seats.', NEW.eventid;
        
        -- Check if event is sold out
        IF v_new_available <= 0 THEN
            INSERT INTO event_notifications (eventid, notification_type, message, created_date)
            VALUES (NEW.eventid, 'SOLD_OUT', 
                   'Event is now SOLD OUT! All ' || v_venue_capacity || ' seats have been sold.',
                   CURRENT_TIMESTAMP);
                   
            RAISE NOTICE 'Event % is now SOLD OUT!', NEW.eventid;
        ELSIF v_new_available <= (v_venue_capacity * 0.1) THEN
            -- Less than 10% seats remaining
            INSERT INTO event_notifications (eventid, notification_type, message, created_date)
            VALUES (NEW.eventid, 'LOW_AVAILABILITY', 
                   'Only ' || v_new_available || ' seats remaining out of ' || v_venue_capacity,
                   CURRENT_TIMESTAMP);
                   
            RAISE NOTICE 'Low availability warning for event %: % seats remaining', 
                         NEW.eventid, v_new_available;
        END IF;
        
        -- Log ticket sale
        INSERT INTO ticket_sales_log (eventid, action, ticket_count, available_seats, log_date)
        VALUES (NEW.eventid, 'TICKET_SOLD', 1, v_new_available, CURRENT_TIMESTAMP);
        
        RETURN NEW;
        
    ELSIF TG_OP = 'DELETE' THEN
        -- Ticket refunded/cancelled
        RAISE NOTICE 'Ticket cancelled for event %. Updating available seats.', OLD.eventid;
        
        -- Check if this creates new availability for a previously sold-out event
        IF v_new_available = 1 THEN
            INSERT INTO event_notifications (eventid, notification_type, message, created_date)
            VALUES (OLD.eventid, 'SEATS_AVAILABLE', 
                   'Seats are now available again! ' || v_new_available || ' seats open.',
                   CURRENT_TIMESTAMP);
        END IF;
        
        -- Log ticket cancellation
        INSERT INTO ticket_sales_log (eventid, action, ticket_count, available_seats, log_date)
        VALUES (OLD.eventid, 'TICKET_CANCELLED', -1, v_new_available, CURRENT_TIMESTAMP);
        
        RETURN OLD;
        
    ELSIF TG_OP = 'UPDATE' THEN
        -- Ticket modified (e.g., price change)
        v_price_diff := NEW.price - OLD.price;
        
        IF v_price_diff != 0 THEN
            RAISE NOTICE 'Ticket price updated for event %. Price change: $%', 
                         NEW.eventid, v_price_diff;
            
            -- Log price change
            INSERT INTO ticket_sales_log (eventid, action, ticket_count, available_seats, log_date, notes)
            VALUES (NEW.eventid, 'PRICE_UPDATED', 0, v_new_available, CURRENT_TIMESTAMP,
                   'Price changed by $' || v_price_diff);
        END IF;
        
        RETURN NEW;
    END IF;
    
    -- Update the events table with new available seats count
    UPDATE events 
    SET available_seats = v_new_available
    WHERE eventid = COALESCE(NEW.eventid, OLD.eventid);
    
    RETURN COALESCE(NEW, OLD);
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error in seats update trigger: %', SQLERRM;
        -- Don't prevent the original operation, just log the error
        INSERT INTO system_error_log (error_message, error_date, context)
        VALUES ('Seats update trigger error: ' || SQLERRM, CURRENT_TIMESTAMP, 
               'Event ID: ' || COALESCE(NEW.eventid, OLD.eventid));
        
        RETURN COALESCE(NEW, OLD);
END;
$$;

-- יצירת הטריגר
CREATE TRIGGER ticket_seats_update_trigger
    AFTER INSERT OR UPDATE OR DELETE ON ticket
    FOR EACH ROW
    EXECUTE FUNCTION update_available_seats_trigger();

-- יצירת טבלאות עזר לטריגר
CREATE TABLE IF NOT EXISTS event_notifications (
    notification_id SERIAL PRIMARY KEY,
    eventid INTEGER REFERENCES events(eventid) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL,
    message TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS ticket_sales_log (
    log_id SERIAL PRIMARY KEY,
    eventid INTEGER REFERENCES events(eventid) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    ticket_count INTEGER DEFAULT 0,
    available_seats INTEGER,
    log_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS system_error_log (
    error_id SERIAL PRIMARY KEY,
    error_message TEXT,
    error_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    context TEXT
);