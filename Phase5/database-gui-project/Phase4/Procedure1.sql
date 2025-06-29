CREATE OR REPLACE PROCEDURE update_ticket_pricing_and_promotions(
    p_event_type VARCHAR DEFAULT NULL,
    p_discount_percentage NUMERIC DEFAULT 10.0,
    p_min_days_before_event INTEGER DEFAULT 7,
    p_max_price_increase NUMERIC DEFAULT 50.0
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_ticket_record RECORD;
    v_price_adjustment NUMERIC;
    v_new_price NUMERIC;
    v_tickets_updated INTEGER := 0;
    v_events_processed INTEGER := 0;
    v_total_discount_applied NUMERIC := 0;
    v_days_until_event INTEGER;

    -- Cursor for tickets
    ticket_cursor CURSOR FOR
        SELECT 
            t.ticketid,
            t.price,
            t.eventid,
            e.eventtype,
            e.eventdate,
            e.available_seats,
            v.capacity,
            v.venname,
            (e.eventdate - CURRENT_DATE) as days_until_event
        FROM ticket t
        JOIN events e ON t.eventid = e.eventid
        JOIN venue v ON e.venid = v.venid
        WHERE (p_event_type IS NULL OR e.eventtype = p_event_type)
          AND e.eventdate > CURRENT_DATE
          AND t.saledate >= CURRENT_DATE - INTERVAL '30 days'
        ORDER BY e.eventdate, t.ticketid;
BEGIN
    -- Validate parameters
    IF p_discount_percentage < 0 OR p_discount_percentage > 100 THEN
        RAISE EXCEPTION 'Invalid discount percentage: must be between 0 and 100';
    END IF;

    RAISE NOTICE 'Starting ticket pricing update process...';

    RAISE NOTICE 'Event Type: %', COALESCE(p_event_type, 'ALL');
    RAISE NOTICE 'Discount Percentage: %', p_discount_percentage;
    RAISE NOTICE 'Minimum Days Before Event: %', p_min_days_before_event;
    RAISE NOTICE 'Max Price Increase: %', p_max_price_increase;

    FOR v_ticket_record IN ticket_cursor LOOP
        v_events_processed := v_events_processed + 1;
        v_days_until_event := v_ticket_record.days_until_event;
        v_price_adjustment := 0;

        -- Early bird
        IF v_days_until_event > p_min_days_before_event * 2 THEN
            v_price_adjustment := -(v_ticket_record.price * p_discount_percentage / 100);
            RAISE NOTICE 'Early bird discount for ticket %', v_ticket_record.ticketid;

        -- High demand
        ELSIF v_days_until_event <= p_min_days_before_event THEN
            DECLARE
                v_occupancy NUMERIC;
            BEGIN
                v_occupancy := (v_ticket_record.capacity - v_ticket_record.available_seats)::NUMERIC / NULLIF(v_ticket_record.capacity, 0);
                IF v_occupancy > 0.8 THEN
                    v_price_adjustment := LEAST(v_ticket_record.price * 0.25, p_max_price_increase);
                    RAISE NOTICE 'High demand: ticket %, occupancy %', v_ticket_record.ticketid, ROUND(v_occupancy * 100, 2);
                ELSIF v_occupancy > 0.5 THEN
                    v_price_adjustment := LEAST(v_ticket_record.price * 0.15, p_max_price_increase);
                END IF;
            END;

        -- Last minute
        ELSIF v_days_until_event <= 3 AND 
              (v_ticket_record.available_seats::NUMERIC / v_ticket_record.capacity) > 0.5 THEN
            v_price_adjustment := -(v_ticket_record.price * (p_discount_percentage + 5) / 100);
            RAISE NOTICE 'Last minute discount for ticket %', v_ticket_record.ticketid;
        END IF;

        -- Apply change
        v_new_price := v_ticket_record.price + v_price_adjustment;
        IF v_new_price < 10 THEN
            v_new_price := 10;
            v_price_adjustment := v_new_price - v_ticket_record.price;
        END IF;

        IF v_price_adjustment != 0 THEN
            UPDATE ticket
            SET price = v_new_price
            WHERE ticketid = v_ticket_record.ticketid;

            INSERT INTO ticket_price_history(ticketid, old_price, new_price, reason)
            VALUES (
                v_ticket_record.ticketid,
                v_ticket_record.price,
                v_new_price,
                CASE
                    WHEN v_days_until_event > p_min_days_before_event * 2 THEN 'Early Bird Discount'
                    WHEN v_days_until_event <= p_min_days_before_event THEN 'Demand-Based Pricing'
                    ELSE 'Last-Minute Discount'
                END
            );

            v_tickets_updated := v_tickets_updated + 1;
            IF v_price_adjustment < 0 THEN
                v_total_discount_applied := v_total_discount_applied + ABS(v_price_adjustment);
            END IF;
        END IF;

        IF v_events_processed % 100 = 0 THEN
            RAISE NOTICE 'Processed % tickets...', v_events_processed;
            COMMIT;
        END IF;
    END LOOP;

    IF v_events_processed = 0 THEN
        RAISE NOTICE 'No tickets matched the criteria.';
    END IF;

    RAISE NOTICE 'Done. % tickets processed, % updated. Total discounts: %',
                 v_events_processed, v_tickets_updated, ROUND(v_total_discount_applied, 2);

    UPDATE events
    SET additional_fees = 'Pricing updated on ' || CURRENT_DATE
    WHERE eventid IN (
        SELECT DISTINCT eventid
        FROM ticket
        WHERE ticketid IN (
            SELECT ticketid
            FROM ticket_price_history
            WHERE change_date::DATE = CURRENT_DATE
        )
    );
END;
$$;

CREATE TABLE IF NOT EXISTS ticket_price_history (
    history_id SERIAL PRIMARY KEY,
    ticketid INTEGER REFERENCES ticket(ticketid) ON DELETE CASCADE,
    old_price NUMERIC(10,2),
    new_price NUMERIC(10,2),
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason VARCHAR(255)
);
