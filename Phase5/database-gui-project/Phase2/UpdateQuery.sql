-- 1. Update rental price for venues that have received a 5-star review
UPDATE Venue v
SET Rental_price = Rental_price * 1.1
WHERE v.VenId IN (
    SELECT r.VenId
    FROM Reviews r
    WHERE r.Rating = 5
);

-- 2. Update Additional_fees to 0 for events that happened before 2025
UPDATE Events
SET Additional_fees = 0
WHERE EventDate < '2025-05-01';

-- 3. Update email of a customer based on their ID (for example, CusId = 123)
UPDATE Customers
SET CusEmail = 'newemail@example.com'
WHERE CusId = 75912628;
