-- מחיקת טבלאות תלויות (כי יש בהן מפתחות זרים)
DROP TABLE IF EXISTS Reviews;
DROP TABLE IF EXISTS Owners;
DROP TABLE IF EXISTS Facilities;

-- מחיקת ישויות תלויות (אם נניח ש-Events ו-Customers תלויים במשהו בעתיד)
DROP TABLE IF EXISTS Events;
DROP TABLE IF EXISTS Customers;

-- מחיקת ישויות ראשיות
DROP TABLE IF EXISTS Venue;
