-- טריגר 2: בדיקות תקינות וביקורת לביקורות ואירועים
-- כולל: complex validation, audit trail, conditional logic

-- יצירת הפונקציה לטריגר ביקורות
CREATE OR REPLACE FUNCTION review_validation_and_audit_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_event_date DATE;
    v_customer_name VARCHAR(256);
    v_event_type VARCHAR(256);
    v_venue_name VARCHAR(256);
    v_ticket_exists BOOLEAN := FALSE;
    v_duplicate_review BOOLEAN := FALSE;
    v_old_rating INTEGER;
    v_rating_change INTEGER;
BEGIN
    -- Get event and customer information
    SELECT e.eventdate, e.eventtype, c.cusname, v.venname
    INTO v_event_date, v_event_type, v_customer_name, v_venue_name
    FROM events e
    JOIN customers c ON c.cusid = COALESCE(NEW.cusid, OLD.cusid)
    JOIN venue v ON e.venid = v.venid
    WHERE e.eventid = COALESCE(NEW.eventid, OLD.eventid);
    
    IF TG_OP = 'INSERT' THEN
        -- Validation for new reviews
        RAISE NOTICE 'Validating new review from % for event on %', v_customer_name, v_event_date;
        
        -- Check if customer actually bought a ticket for this event
        SELECT EXISTS(
            SELECT 1 FROM ticket 
            WHERE eventid = NEW.eventid AND cusid = NEW.cusid
        ) INTO v_ticket_exists;
        
        IF NOT v_ticket_exists THEN
            RAISE EXCEPTION 'Customer % cannot review event % - no ticket purchase found', 
                           v_customer_name, NEW.eventid;
        END IF;
        
        -- Check if event has already occurred
        IF v_event_date > CURRENT_DATE THEN
            RAISE EXCEPTION 'Cannot review event % - event has not occurred yet (scheduled for %)', 
                           NEW.eventid, v_event_date;
        END IF;
        
        -- Check for duplicate reviews
        SELECT EXISTS(
            SELECT 1 FROM reviews 
            WHERE eventid = NEW.eventid AND cusid = NEW.cusid AND revid != NEW.revid
        ) INTO v_duplicate_review;
        
        IF v_duplicate_review THEN
            RAISE EXCEPTION 'Customer % has already reviewed event %', v_customer_name, NEW.eventid;
        END IF;
        
        -- Validate review date
        IF NEW.revdate IS NULL THEN
            NEW.revdate := CURRENT_DATE;
        ELSIF NEW.revdate > CURRENT_DATE THEN
            RAISE EXCEPTION 'Review date cannot be in the future';
        ELSIF NEW.revdate < v_event_date THEN
            RAISE EXCEPTION 'Review date cannot be before the event date';
        END IF;
        
        -- Validate rating
        IF NEW.rating IS NULL OR NEW.rating < 1 OR NEW.rating > 5 THEN
            RAISE EXCEPTION 'Rating must be between 1 and 5';
        END IF;
        
        -- Validate review description length
        IF NEW.revdescription IS NOT NULL AND LENGTH(TRIM(NEW.revdescription)) < 5 THEN
            RAISE EXCEPTION 'Review description must be at least 5 characters long';
        END IF;
        
        -- Log successful review creation
        INSERT INTO review_audit_log (
            revid, eventid, cusid, action, old_rating, new_rating, 
            change_date, performed_by, notes
        ) VALUES (
            NEW.revid, NEW.eventid, NEW.cusid, 'CREATED', NULL, NEW.rating,
            CURRENT_TIMESTAMP, v_customer_name,
            'New review for ' || v_event_type || ' at ' || v_venue_name
        );
        
        RAISE NOTICE 'Review created successfully: Customer %, Event %, Rating %', 
                     v_customer_name, NEW.eventid, NEW.rating;
        
        RETURN NEW;
        
    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle review updates
        v_old_rating := OLD.rating;
        v_rating_change := NEW.rating - OLD.rating;
        
        RAISE NOTICE 'Updating review % - Rating change: %', NEW.revid, v_rating_change;
        
        -- Validate new rating
        IF NEW.rating IS NULL OR NEW.rating < 1 OR NEW.rating > 5 THEN
            RAISE EXCEPTION 'Rating must be between 1 and 5';
        END IF;
        
        -- Check if customer is trying to change the event or customer ID
        IF NEW.eventid != OLD.eventid THEN
            RAISE EXCEPTION 'Cannot change event ID in review update';
        END IF;
        
        IF NEW.cusid != OLD.cusid THEN
            RAISE EXCEPTION 'Cannot change customer ID in review update';
        END IF;
        
        -- Validate review description length if changed
        IF NEW.revdescription IS NOT NULL AND LENGTH(TRIM(NEW.revdescription)) < 5 THEN
            RAISE EXCEPTION 'Review description must be at least 5 characters long';
        END IF;
        
        -- Log the update
        INSERT INTO review_audit_log (
            revid, eventid, cusid, action, old_rating, new_rating, 
            change_date, performed_by, notes
        ) VALUES (
            NEW.revid, NEW.eventid, NEW.cusid, 'UPDATED', v_old_rating, NEW.rating,
            CURRENT_TIMESTAMP, v_customer_name,
            CASE 
                WHEN v_rating_change > 0 THEN 'Rating increased by ' || v_rating_change
                WHEN v_rating_change < 0 THEN 'Rating decreased by ' || ABS(v_rating_change)
                ELSE 'Description updated, rating unchanged'
            END
        );
        
        -- Check for suspicious rating patterns
        DECLARE
            v_review_count INTEGER;
            v_avg_rating NUMERIC;
        BEGIN
            SELECT COUNT(*), AVG(rating)
            INTO v_review_count, v_avg_rating
            FROM reviews
            WHERE cusid = NEW.cusid
            AND revdate >= CURRENT_DATE - INTERVAL '30 days';
            
            -- Flag if customer is giving unusually high/low ratings
            IF v_review_count >= 3 THEN
                IF v_avg_rating >= 4.8 THEN
                    INSERT INTO suspicious_activity_log (
                        cusid, activity_type, description, log_date
                    ) VALUES (
                        NEW.cusid, 'HIGH_RATINGS', 
                        'Customer consistently giving very high ratings (avg: ' || ROUND(v_avg_rating, 2) || ')',
                        CURRENT_TIMESTAMP
                    );
                ELSIF v_avg_rating <= 1.5 THEN
                    INSERT INTO suspicious_activity_log (
                        cusid, activity_type, description, log_date
                    ) VALUES (
                        NEW.cusid, 'LOW_RATINGS',
                        'Customer consistently giving very low ratings (avg: ' || ROUND(v_avg_rating, 2) || ')',
                        CURRENT_TIMESTAMP
                    );
                END IF;
            END IF;
        END;
        
        RETURN NEW;
        
    ELSIF TG_OP = 'DELETE' THEN
        -- Handle review deletion
        RAISE NOTICE 'Deleting review % from customer %', OLD.revid, v_customer_name;
        
        -- Log the deletion
        INSERT INTO review_audit_log (
            revid, eventid, cusid, action, old_rating, new_rating, 
            change_date, performed_by, notes
        ) VALUES (
            OLD.revid, OLD.eventid, OLD.cusid, 'DELETED', OLD.rating, NULL,
            CURRENT_TIMESTAMP, v_customer_name,
            'Review deleted - Rating was ' || OLD.rating
        );
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Log error and re-raise
        INSERT INTO system_error_log (error_message, error_date, context)
        VALUES ('Review validation trigger error: ' || SQLERRM, CURRENT_TIMESTAMP,
               'Review ID: ' || COALESCE(NEW.revid, OLD.revid) || 
               ', Event ID: ' || COALESCE(NEW.eventid, OLD.eventid));
        
        RAISE;
END;
$$;

-- יצירת הטריגר
CREATE TRIGGER review_validation_trigger
    BEFORE INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION review_validation_and_audit_trigger();

-- יצירת טבלאות עזר לטריגר
CREATE TABLE IF NOT EXISTS review_audit_log (
    audit_id SERIAL PRIMARY KEY,
    revid INTEGER,
    eventid INTEGER,
    cusid INTEGER,
    action VARCHAR(20) NOT NULL,
    old_rating INTEGER,
    new_rating INTEGER,
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    performed_by VARCHAR(256),
    notes TEXT
);

CREATE TABLE IF NOT EXISTS suspicious_activity_log (
    activity_id SERIAL PRIMARY KEY,
    cusid INTEGER REFERENCES customers(cusid),
    activity_type VARCHAR(50),
    description TEXT,
    log_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_resolved BOOLEAN DEFAULT FALSE
);