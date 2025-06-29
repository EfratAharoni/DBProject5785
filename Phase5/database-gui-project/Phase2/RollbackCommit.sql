-- מתחילים טרנזקציה חדשה
BEGIN;

-- עדכון המייל של הלקוח עם CusId 123
UPDATE Customers
SET CusEmail = 'BuckminsterFlores@example.com'
WHERE CusId = 123;

-- הצגת המידע על הלקוח לאחר העדכון, כדי לוודא שהשינוי התבצע
SELECT CusId, CusName, CusEmail
FROM Customers
WHERE CusId = 123;

-- אם אתה רוצה לשמור את השינויים
COMMIT;

-- מתחילים טרנזקציה חדשה
BEGIN;

-- עדכון המייל של הלקוח עם CusId 137
UPDATE Customers
SET CusEmail = 'MayaWheeler@example.com'
WHERE CusId = 137;

-- הצגת המידע על הלקוח לאחר העדכון, כדי לוודא שהשינוי התבצע
SELECT CusId, CusName, CusEmail
FROM Customers
WHERE CusId = 137;

-- ביטול עדכון
ROLLBACK;



