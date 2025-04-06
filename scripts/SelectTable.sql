-- שליפת כל הנתונים מכל הטבלאות
SELECT * FROM Venue;
SELECT * FROM Facilities;
SELECT * FROM Events;
SELECT * FROM Customers;
SELECT * FROM Reviews;
SELECT * FROM Owners;

-- ספירת כמות הרשומות בכל טבלה
SELECT 'Venue' AS table_name, COUNT(*) AS total_records FROM Venue;
SELECT 'Facilities' AS table_name, COUNT(*) AS total_records FROM Facilities;
SELECT 'Events' AS table_name, COUNT(*) AS total_records FROM Events;
SELECT 'Customers' AS table_name, COUNT(*) AS total_records FROM Customers;
SELECT 'Reviews' AS table_name, COUNT(*) AS total_records FROM Reviews;
SELECT 'Owners' AS table_name, COUNT(*) AS total_records FROM Owners;
