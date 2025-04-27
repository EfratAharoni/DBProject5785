-- 1. CHECK constraint to ensure rating is between 1 and 5
ALTER TABLE Reviews
ADD CONSTRAINT chk_rating CHECK (Rating BETWEEN 1 AND 5);

-- 2. DEFAULT constraint for rental price if not provided
ALTER TABLE Venue
ALTER COLUMN Rental_price SET DEFAULT 10000;

-- 3. NOT NULL constraint to ensure EventType is always provided
ALTER TABLE Events
ALTER COLUMN EventType SET NOT NULL;

-- 4. UNIQUE constraint to ensure no two venues have the same name
ALTER TABLE Venue
ADD CONSTRAINT unique_venname UNIQUE (VenName);

-- 5. CHECK constraint to ensure event date is not in the past
ALTER TABLE Events
ADD CONSTRAINT chk_event_future CHECK (EventDate >= CURRENT_DATE);
