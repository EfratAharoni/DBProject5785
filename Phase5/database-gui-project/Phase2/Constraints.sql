-- 1. CHECK constraint to ensure rating is between 1 and 5
ALTER TABLE Reviews
ADD CONSTRAINT chk_rating CHECK (Rating BETWEEN 1 AND 5);

-- 2. NOT NULL constraint to ensure EventType is always provided
ALTER TABLE Events
ALTER COLUMN EventType SET NOT NULL;

-- 3. CHECK constraint to ensure event date is not in the past
ALTER TABLE Events
ADD CONSTRAINT chk_event_future CHECK (EventDate >= CURRENT_DATE);

--4.If you do not specify the number of available spaces when entering a new event, it will automatically be set to 0.
ALTER TABLE Events
ALTER COLUMN Available_seats SET DEFAULT 0;
