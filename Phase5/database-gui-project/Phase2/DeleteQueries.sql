-- 1. Deleting venues that have no reviews
DELETE FROM Venue
WHERE VenId NOT IN (
    SELECT DISTINCT VenId
    FROM Reviews
);

-- 2. Deleting reviews with a very low rating (1 out of 5)
DELETE FROM Reviews
WHERE Rating = 1;

-- מחוק בעלי אולמות (Owners) שהאולם שלהם אין עליו בכלל ביקורות (Reviews) או אין עליו הזמנות
DELETE FROM Owners
WHERE VenId IN (
    SELECT v.VenId
    FROM Venue v
    LEFT JOIN Reviews r ON v.VenId = r.VenId
    WHERE r.RevId IS NULL
);
