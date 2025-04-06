-- Insert into Venue
INSERT INTO Venue (VenId, VenName, Location, Capacity, VenuDescription, Rental_price) VALUES
(1, 'Ruecker-Corkery', '62004 Farwell Hill', 445, 'Includes outdoor garden for ceremonies and open-air events', 36000),
(2, 'Ankunding and Sons', '009 Moulton Alley', 1116, 'Complete event package with bar and DJ', 15000),
(3, 'Reichel Ltd', '34852 Briar Crest', 280, 'Modern space ideal for conferences and private parties', 18000),
(4, 'Golden Events', '12 HaShalom St, Tel Aviv', 600, 'Luxury venue with rooftop terrace', 45000),
(5, 'Blue Horizon', '45 Derech HaYam, Haifa', 800, 'Beachfront venue with stunning sea views', 50000),
(6, 'Silver Hall', '78 Ben Gurion Blvd, Jerusalem', 350, 'Elegant hall for intimate events', 20000),
(7, 'Crystal Palace', '19 Herzl St, Netanya', 1200, 'Grand venue for large-scale events', 60000),
(8, 'Green Oasis', '33 Rishon LeZion Rd, Rishon LeZion', 500, 'Garden venue with indoor backup', 30000),
(9, 'Sunset Venue', '56 Eilat Promenade, Eilat', 400, 'Perfect for sunset weddings', 40000),
(10, 'Urban Loft', '22 Allenby St, Tel Aviv', 250, 'Modern loft for corporate events', 25000),
(11, 'Royal Gardens', '88 King George St, Jerusalem', 700, 'Historic venue with lush gardens', 55000),
(12, 'Starlight Hall', '14 Haifa Rd, Haifa', 900, 'Venue with starry ceiling effects', 48000),
(13, 'Emerald Events', '27 Ashdod Marina, Ashdod', 300, 'Cozy venue near the marina', 22000),
(14, 'Diamond Space', '41 Modi’in Center, Modi’in', 650, 'Modern space with advanced tech', 38000),
(15, 'Paradise Venue', '9 Beer Sheva St, Beer Sheva', 450, 'Desert-inspired venue with unique decor', 32000);

-- Insert into Customers
INSERT INTO Customers (CusId, CusName, CusContactInfo, CusEmail) VALUES
(075912628, 'Ulberto Duiguid', '618-796-7581', 'uduiguid0@aboutads.info'),
(082901839, 'Stanislaus Durdle', '971-767-6287', 'sdurdle1@storify.com'),
(091283746, 'Branwen Wyldbore', '934-555-1234', 'bwyldbore2@wix.com'),
(092345678, 'Liora Cohen', '052-123-4567', 'liora.cohen@gmail.com'),
(093456789, 'Eitan Levi', '053-234-5678', 'eitan.levi@yahoo.com'),
(094567890, 'Maya Peretz', '054-345-6789', 'maya.peretz@outlook.com'),
(095678901, 'Noam Mizrahi', '055-456-7890', 'noam.mizrahi@hotmail.com'),
(096789012, 'Shira Amar', '057-567-8901', 'shira.amar@gmail.com'),
(097890123, 'Yossi Ben David', '058-678-9012', 'yossi.bendavid@icloud.com'),
(098901234, 'Rachel Gabay', '059-789-0123', 'rachel.gabay@gmail.com'),
(099012345, 'Avi Shwartz', '050-890-1234', 'avi.shwartz@yahoo.com'),
(100123456, 'Tamar Yitzhak', '052-901-2345', 'tamar.yitzhak@outlook.com'),
(101234567, 'Nadav Katz', '053-012-3456', 'nadav.katz@gmail.com'),
(102345678, 'Dana Elbaz', '054-123-4567', 'dana.elbaz@hotmail.com'),
(103456789, 'Amir Davidson', '055-234-5678', 'amir.davidson@icloud.com'),
(104567890, 'Lea Shani', '057-345-6789', 'lea.shani@gmail.com'),
(105678901, 'Omer Segal', '058-456-7890', 'omer.segal@yahoo.com'),
(106789012, 'Gal Doron', '059-567-8901', 'gal.doron@outlook.com'),
(107890123, 'Eli Naftali', '050-678-9012', 'eli.naftali@gmail.com'),
(108901234, 'Yonatan Goldberg', '052-789-0123', 'yonatan.goldberg@hotmail.com');

-- Insert into Events
INSERT INTO Events (EventId, EventType, EventDate, Available_seats, Additional_fees) VALUES
(1, 'Wedding', TO_DATE('10/23/2025', 'MM/DD/YYYY'), 1282, NULL),
(2, 'Engagement', TO_DATE('9/12/2025', 'MM/DD/YYYY'), 123, NULL),
(3, 'Corporate Party', TO_DATE('8/5/2025', 'MM/DD/YYYY'), 500, NULL),
(4, 'Birthday Party', TO_DATE('7/15/2025', 'MM/DD/YYYY'), 200, 500.00),
(5, 'Conference', TO_DATE('6/20/2025', 'MM/DD/YYYY'), 300, 1000.00),
(6, 'Bar Mitzvah', TO_DATE('5/10/2025', 'MM/DD/YYYY'), 150, NULL),
(7, 'Wedding', TO_DATE('4/25/2025', 'MM/DD/YYYY'), 600, 2000.00),
(8, 'Corporate Party', TO_DATE('3/18/2025', 'MM/DD/YYYY'), 400, 1500.00),
(9, 'Engagement', TO_DATE('2/14/2025', 'MM/DD/YYYY'), 100, NULL),
(10, 'Anniversary', TO_DATE('1/30/2025', 'MM/DD/YYYY'), 80, 300.00),
(11, 'Seminar', TO_DATE('11/5/2025', 'MM/DD/YYYY'), 250, 800.00),
(12, 'Wedding', TO_DATE('12/12/2025', 'MM/DD/YYYY'), 700, 2500.00),
(13, 'Birthday Party', TO_DATE('10/1/2025', 'MM/DD/YYYY'), 120, NULL),
(14, 'Corporate Party', TO_DATE('9/25/2025', 'MM/DD/YYYY'), 350, 1200.00),
(15, 'Engagement', TO_DATE('8/30/2025', 'MM/DD/YYYY'), 90, NULL);

-- Insert into Facilities
INSERT INTO Facilities (id, FacilityId, FacilityName, FacilityDescription) VALUES
(1, 1, 'DJ Booth', 'Professional DJ booth with mixer and audio controls.'),
(2, 2, 'Catering Area', 'Designated space for food service and buffet setup.'),
(3, 1, 'Lighting Rig', 'Adjustable lighting system with presets for mood effects.'),
(4, 3, 'Stage', 'Elevated stage for performances and speeches.'),
(5, 4, 'Dance Floor', 'Spacious dance floor with LED lighting.'),
(6, 5, 'Outdoor Seating', 'Comfortable outdoor seating area for guests.'),
(7, 2, 'Bar Area', 'Fully stocked bar with professional bartenders.');

-- Insert into Owners
INSERT INTO Owners (OwnerId, OwnerName, OwnerContactInfo, OwnerEmail, VenId) VALUES
(072405662, 'Evelina Shadbolt', '981-618-4110', 'eshadbolt0@deviantart.com', 1),
(073906005, 'Jaymie Cerith', '236-159-5850', 'jcerith1@sciencedaily.com', 2),
(074512390, 'Corrinne Leathley', '322-469-8822', 'cleathley2@opensource.org', 3),
(075123456, 'Daniel Cohen', '052-987-6543', 'daniel.cohen@gmail.com', 4),
(076234567, 'Liora Mizrahi', '053-876-5432', 'liora.mizrahi@yahoo.com', 5);

-- Insert into Reviews
INSERT INTO Reviews (RevId, Rating, RevDescription, RevDate, VenId) VALUES
(61119888, 1, 'Would not recommend. The event was disorganized.', TO_DATE('9/21/2024', 'MM/DD/YYYY'), 1),
(122043518, 1, 'Terrible experience. The venue was dirty and poorly maintained.', TO_DATE('11/24/2024', 'MM/DD/YYYY'), 2),
(134551293, 3, 'Average service, decent ambiance but overpriced.', TO_DATE('10/15/2024', 'MM/DD/YYYY'), 3),
(145678901, 5, 'Amazing venue! Everything was perfect.', TO_DATE('12/1/2024', 'MM/DD/YYYY'), 4),
(156789012, 4, 'Great location, staff was very helpful.', TO_DATE('11/10/2024', 'MM/DD/YYYY'), 5),
(167890123, 2, 'Disappointing. The sound system kept failing.', TO_DATE('10/20/2024', 'MM/DD/YYYY'), 1),
(178901234, 4, 'Lovely venue, but parking was an issue.', TO_DATE('9/30/2024', 'MM/DD/YYYY'), 2);
