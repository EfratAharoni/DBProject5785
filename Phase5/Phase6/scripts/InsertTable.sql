-- Customers
INSERT INTO Customers (CusId, CusName, CusContactInfo, CusEmail) VALUES
(075912628, 'Ulberto Duiguid', '618-796-7581', 'uduiguid0@aboutads.info'),
(082901839, 'Stanislaus Durdle', '971-767-6287', 'sdurdle1@storify.com'),
(091283746, 'Branwen Wyldbore', '934-555-1234', 'bwyldbore2@wix.com');

-- Events
INSERT INTO Events (EventId, EventType, EventDate, Available_seats, Additional_fees) VALUES
(1, 'Wedding', STR_TO_DATE('10/23/2025', '%m/%d/%Y'), 1282, NULL),
(2, 'Engagement', STR_TO_DATE('9/12/2025', '%m/%d/%Y'), 123, NULL),
(3, 'Corporate Party', STR_TO_DATE('8/5/2025', '%m/%d/%Y'), 500, NULL);

-- Facilities
INSERT INTO Facilities (FacilityId, FacilityName, FacilityDescription, VenId) VALUES
(104000058, 'DJ Booth', 'Professional DJ booth with mixer and audio controls.', 1),
(71108106, 'Catering Area', 'Designated space for food service and buffet setup.', 2),
(301245789, 'Lighting Rig', 'Adjustable lighting system with presets for mood effects.', 1);

-- Owners
INSERT INTO Owners (OwnerId, OwnerName, OwnerContactInfo, OwnerEmail, VenId) VALUES
(072405662, 'Evelina Shadbolt', '981-618-4110', 'eshadbolt0@deviantart.com', 1),
(073906005, 'Jaymie Cerith', '236-159-5850', 'jcerith1@sciencedaily.com', 2),
(074512390, 'Corrinne Leathley', '322-469-8822', 'cleathley2@opensource.org', 2);

-- Reviews
INSERT INTO Reviews (RevId, Rating, RevDescription, RevDate, VenId) VALUES
(61119888, 1, 'Would not recommend. The event was disorganized.', STR_TO_DATE('9/21/2024', '%m/%d/%Y'), 1),
(122043518, 1, 'Terrible experience. The venue was dirty and poorly maintained.', STR_TO_DATE('11/24/2024', '%m/%d/%Y'), 2),
(134551293, 3, 'Average service, decent ambiance but overpriced.', STR_TO_DATE('10/15/2024', '%m/%d/%Y'), 2);

-- Venue
INSERT INTO Venue (VenId, VenName, Location, Capacity, VenuDescription, Rental_price) VALUES
(1, 'Ruecker-Corkery', '62004 Farwell Hill', 445, 'Includes outdoor garden for ceremonies and open-air events', 36000),
(2, 'Ankunding and Sons', '009 Moulton Alley', 1116, 'Complete event package with bar and DJ', 15000),
(3, 'Reichel Ltd', '34852 Briar Crest', 280, 'Modern space ideal for conferences and private parties', 18000);
