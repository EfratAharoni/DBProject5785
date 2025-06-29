--1. Customers who attended events with more than 1000 available seats
SELECT c.CusId, c.CusName, e.EventId, e.Available_seats
FROM Customers c
JOIN Events e ON e.Available_seats > 1000;

--2. Owners of venues with rental price above 30,000
SELECT o.OwnerId, o.OwnerName, v.VenName, v.Rental_price
FROM Owners o
JOIN Venue v ON o.VenId = v.VenId
WHERE v.Rental_price > 30000;

--3.Retrieves reviews for venues where events took place during January 2025, including review details, event date, and venue info.
SELECT r.RevId, r.Rating, r.RevDescription, r.RevDate,
       e.EventDate, v.VenName, v.Location
FROM Reviews r
JOIN Venue v ON r.VenId = v.VenId
JOIN Events e ON e.EventDate BETWEEN '2025-01-01' AND '2025-01-31'
             AND v.VenId = r.VenId
ORDER BY e.EventDate;

--4.This query returns the venue name, event year, event month, and the number of events, joining the Venue, Reviews, and Events tables, and grouping by venue and event date.
SELECT v.VenName, 
       EXTRACT(YEAR FROM e.EventDate) AS EventYear, 
       EXTRACT(MONTH FROM e.EventDate) AS EventMonth, 
       COUNT(e.EventId) AS NumberOfEvents
FROM Venue v
LEFT JOIN Reviews r ON v.VenId = r.VenId
LEFT JOIN Events e ON v.VenId = r.VenId
GROUP BY v.VenName, EXTRACT(YEAR FROM e.EventDate), EXTRACT(MONTH FROM e.EventDate)
ORDER BY EventYear DESC, EventMonth DESC, NumberOfEvents DESC;

--5. Average rating per venue
SELECT v.Capacity, AVG(r.Rating) AS AvgRating, COUNT(r.Rating)
FROM Venue v
LEFT JOIN Reviews r ON r.VenId = v.VenId
GROUP BY v.Capacity;

--6. The query displays all events held in 2025 in venues where the rental price is higher than the average, sorted by the number of available seats from highest to lowest
SELECT e.EventId, e.EventType, e.EventDate, v.VenName, v.Rental_price, e.Available_seats
FROM Events e
JOIN Venue v ON e.EventId = v.VenId  -- אם יש שדה אחר לחיבור בין האירועים לאולמות, יש לשנות זאת
WHERE v.Rental_price > (
    SELECT AVG(Rental_price)
    FROM Venue
)
AND e.EventDate BETWEEN '2025-01-01' AND '2025-12-31'  -- כל האירועים בשנת 2025
ORDER BY e.Available_seats DESC;

--7. Returns venues that didn't receive reviews with rating 4 or higher.
SELECT v.VenId, v.VenName, v.Rental_price
FROM Venue v
WHERE v.VenId NOT IN (
    SELECT DISTINCT r.VenId
    FROM Reviews r
    WHERE r.Rating >= 4
);

--8. Venues with their average rating, facility availability, and venue basic info
SELECT v.VenId,
       v.VenName,
       v.Location,
       (SELECT COUNT(*) 
        FROM Facilities f 
        WHERE f.FacilityId = v.VenId) AS TotalFacilities,
       (SELECT ROUND(AVG(r.Rating), 2)
        FROM Reviews r
        WHERE r.VenId = v.VenId) AS AverageRating
FROM Venue v
ORDER BY AverageRating DESC NULLS LAST, TotalFacilities DESC;
