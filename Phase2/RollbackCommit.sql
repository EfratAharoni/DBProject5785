-- מתחילים טרנזקציה חדשה
BEGIN;

-- עדכון המייל של הלקוח עם CusId 123
UPDATE Customers
SET CusEmail = 'newemail@example.com'
WHERE CusId = 123;

-- הצגת המידע על הלקוח לאחר העדכון, כדי לוודא שהשינוי התבצע
SELECT CusId, CusName, CusEmail
FROM Customers
WHERE CusId = 123;

-- אם אתה רוצה לשמור את השינויים
COMMIT;

-- מתחילים טרנזקציה חדשה
BEGIN;

-- עדכון המייל של הלקוח עם CusId 123
UPDATE Customers
SET CusEmail = 'newemail@example.com'
WHERE CusId = 123;

-- הצגת המידע על הלקוח לאחר העדכון, כדי לוודא שהשינוי התבצע
SELECT CusId, CusName, CusEmail
FROM Customers
WHERE CusId = 123;

-- ביטול עדכון
ROLLBACK;



