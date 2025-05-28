# Avishag Timstit & Efrat Aharoni 

## Table of Contents  
- [Phase 1: Design and Build the Database](#phase-1-design-and-build-the-database)  
  - [Introduction](#introduction)  
  - [ERD (Entity-Relationship Diagram)](#erd-entity-relationship-diagram)  
  - [DSD (Data Structure Diagram)](#dsd-data-structure-diagram)  
  - [SQL Scripts](#sql-scripts)  
  - [Data](#data)  
- [Phase 2: Queries & Constraints](#phase-2-integration)  
  - [Introduction](#introduction)  
  - [SQL Queries](#SQL-Queries)  
  - [SELECT Queries](#SELECT-Queries)
  - [DELETE Queries](#DELETE-Queries)  
  - [UPDATE Queries](#UPDATE-Queries)  
  - [Constraints](#Constraints)
  - [Rollback and Commit](#Rollback_And_Commit)


---

## Phase 1: Design and Build the Database  

### Introduction  

The **Nursery School Database** is designed to efficiently manage information related to children, parents, nannies, and nursery groups. This system ensures smooth organization and tracking of essential details such as group assignments, caregiver experience, child-parent relationships, and contact information.  

---

### ERD (Entity-Relationship Diagram)  
![image](https://github.com/user-attachments/assets/d5b40409-fc1b-4980-ae7e-56ee42eb001b)

---

### DSD (Data Structure Diagram)  
![image](https://github.com/user-attachments/assets/3f486254-0a1d-45bc-b646-ed26e5d2ebed)



---

### SQL Scripts  

Provide the following SQL scripts:  

- **Create Tables Script** - The SQL script for creating the database tables is available in the repository:  
📜 **[View `CreateTables.sql`](https://github.com/EfratAharoni/DBProject5785/blob/main/Phase1/scripts/CreateTables.sql)**  

- **Insert Data Script** - The SQL script for insert data to the database tables is available in the repository:  
📜 **[View `InsertTable.sql`](https://github.com/EfratAharoni/DBProject5785/blob/main/Phase1/scripts/InsertTable.sql)**  

- **Drop Tables Script** - The SQL script for dropping all tables is available in the repository:  
📜 **[View `DropTable.sql`](https://github.com/EfratAharoni/DBProject5785/blob/main/Phase1/scripts/DropTable.sql)**  

- **Select All Data Script** - The SQL script for selecting all tables is available in the repository:  
📜 **[View `SelectTable.sql`](https://github.com/EfratAharoni/DBProject5785/blob/main/Phase1/scripts/SelectTable.sql)**  

---

### Data  

#### First tool: using [mockaroo](https://www.mockaroo.com/) to create CSV files  

##### Entering data to **Facilities** table  
- Facilities ID scope: 1-400  
📜 **[View `Facilities.csv`](https://github.com/EfratAharoni/DBProject5785/blob/main/Phase1/mockData/Facilities.csv)**  

##### Entering data to **Reviews** table  
- Reviews ID scope: 1-400  
📜 **[View `Reviews.csv`](https://github.com/EfratAharoni/DBProject5785/blob/main/Phase1/mockData/Reviews.csv)**  

##### Entering data to **Venue** table  
- Venue ID scope: 1-400  
📜 **[View `Venue.csv`](https://github.com/EfratAharoni/DBProject5785/blob/main/Phase1/mockData/Venue.csv)**  

##### Entering data to **Apotropus** table  
- Person ID scope: 401-800  
- Formula of Venue ID: `this + 1`  

![image](Images/04e7128d-3486-4f46-8bee-47a92711415e.jpg)

![image](Images/ca343bc7-3d08-4c86-b503-d5b1f49d8346.jpg)

![image](Images/7ce3888e-9f3d-45c3-9f42-ae5c49d6b148.jpg)

![image](Images/cc08d396-200f-4298-967e-3afac4862e7d.jpg)

---

#### Second tool: using [generatedata](https://generatedata.com/generator) to create CSV files  

##### Entering data to **Customers** table  
- Group Number scope: 1-400  

📜[Customers](https://github.com/EfratAharoni/DBProject5785/blob/main/Phase1/generateData/Customers.csv)

![image](Images/aeb1af71-f630-496f-a4db-9b3e7cadc999.jpg)

![image](Images/31b52dde-8384-4db4-bd75-9b483d33a277.jpg)

![image](Images/c6f3a9f6-e33e-4f4a-ac13-814db44a59db.jpg)

![image](Images/a7454879-58ff-4609-8b6f-77c3f05a37a3.jpg)


**Results for the command:**  
SELECT COUNT(*) FROM Customers;

![image](Images/3259126b-8969-44a0-8296-95df0905fe95.jpg)

**Third tool: using python to create csv file**

![image](https://github.com/user-attachments/assets/120066cb-701d-4610-a6f2-7aa5b1bb1cc8)

### Backup
**backups files are kept with the date and hour of the backup:**

![image](Images/6c8b73f4-eefd-49b8-9a9d-758adb0b7ba4.jpg)

![image](Images/d1ed3e19-7063-404b-a8e0-e0ff8fc7addd.jpg)

---
## Phase 2: Queries & Constraints

### Introduction  

In this phase, we focused on querying and manipulating the database in more advanced ways. The goal was to demonstrate complex SQL capabilities such as multi-table queries, conditional logic, transaction management, and data integrity through constraints.

---
### SQL Queries

#### SELECT Queries
1. **השאילתא מחזירה את הלקוחות שהשתתפו באירועים עם יותר מ־1000 מקומות פנויים**
![image](Images/98c85b58-0733-4f47-af7d-1c95fc4d8f15.jpg)

2. **השאילתא מחזירה בעלים של מקומות עם מחיר השכרה מעל 30,000**
![image](Images/1f0a840c-a55c-41a5-9ad2-58c9acd778db.jpg)

3. **מאחזר ביקורות על מקומות שבהם התרחשו אירועים במהלך ינואר 2025, כולל פרטי סקירה, תאריך האירוע ופרטי המקום**
![image](Images/f9fba059-e2eb-47e2-a8be-4f1dcb263bae.jpg)

4. **השאילתא מחזירה את שם המקום, השנה, החודש ומספר האירועים**
![image](Images/9662387c-4ce3-40ea-9753-dc010bd7e19a.jpg)

5. **ממוצע וכמות דירוגים לכל קיבולת אולם.**
![Screenshot 2025-04-28 170700](https://github.com/user-attachments/assets/b430a9ed-577a-4dd1-9e0a-79901ce2cf63)

6. **השאילתא מציגה את כל האירועים שהתקיימו בשנת 2025 באולמות שבהם מחיר השכירות גבוה מהממוצע, ממוין לפי מספר המקומות הפנויים (מהכי הרבה לפחות).**
![image](Images/cae5775e-1b9c-420d-a67c-8f4eeba7e378.jpg)

7. **מחזירה אולמות שלא קיבלו חוות דעת עם דירוג 4 ומעלה.**
![image](Images/cc1625f1-4036-4343-9855-9341a2c05e57.jpg)

8. **מקומות עם הדירוג הממוצע שלהם, זמינות המתקנים ומידע בסיסי על המקום**
![Screenshot 2025-04-28 170842](https://github.com/user-attachments/assets/f30c61c2-724b-4910-971b-c678c2be8ba1)


#### DELETE Queries

1. השאילתא מוחקת אולמות שאין להם דירוגים
- צילום בסיס הנתונים לפני העדכון
![image](Images/2434ee77-9a33-42fb-b433-9eeab37e2915.jpg)

- צילום הרצה
![image](Images/10246137-ece9-4f4b-902c-5d81f19e49c5.jpg)
  
- צילום בסיס הנתונים אחרי העדכון
![image](Images/ddf2c992-b37b-4e5e-b411-cfa2bc987de9.jpg)

2. שאילתא המוחקת ביקורות עם דירוג נמוך מאוד (1 מתוך 5)
- צילום בסיס הנתונים לפני העדכון
![image](Images/30b30a61-f5de-48fe-807f-3786ede3f728.jpg)

- צילום הרצה
![image](Images/5cdeb53b-036e-483b-b563-71ba7273b9f2.jpg)

- צילום בסיס הנתונים אחרי העדכון
![image](Images/0254b1e8-b280-454f-a709-65d96ed1b5c0.jpg)

3. שאילתא המוחקת בעלי אולמות (Owners) שהאולם שלהם אין עליו בכלל ביקורות (Reviews) או אין עליו הזמנות
- צילום בסיס הנתונים לפני העדכון
![image](Images/54b3e2a6-cd46-4193-8e84-bd24c1044c59.jpg)

- צילום הרצה
![image](Images/db64f513-d79b-4c78-9f44-bed512d785c2.jpg)

- צילום בסיס הנתונים אחרי העדכון
![image](Images/50bfb1f2-49a7-447f-bb50-b74a9588e8f0.jpg)

  
#### UPDATE Queries

1. שאילתא המעדכנת את מחיר השכירות עבור מקומות שקיבלו ביקורת של 5 כוכבים
- צילום בסיס הנתונים לפני העדכון
![image](Images/5a5dd74c-9376-4316-94f8-52289f096b23.jpg)

- צילום הרצה
![image](Images/6a86c66d-545a-4f32-bfed-7e2a05b71c28.jpg)

- צילום בסיס הנתונים אחרי העדכון
![image](Images/c97b0bb2-c58d-48f0-9529-b645d7e4d0ae.jpg)

  
1. שאילתא המעדכנת את התשלומים הנוספים (Additional_fees) ל-0 עבור אירועים שהתרחשו לפני מאי 2025
- צילום בסיס הנתונים לפני העדכון
![image](Images/bfe531f5-def4-48ce-b371-132d32d5a5ec.jpg)

- צילום הרצה
![image](Images/061c5057-9182-4557-9104-277352a5e951.jpg)

- צילום בסיס הנתונים אחרי העדכון
![image](Images/02daa60b-3adf-40f2-80e3-fe225df1baf0.jpg)

1. שאילתא המעדכנת את כתובת הדוא"ל של לקוח בהתבסס על ת.ז שלו
- צילום בסיס הנתונים לפני העדכון
![image](Images/970eb21d-6428-4e88-8b19-3f24890853b2.jpg)

- צילום הרצה
![image](Images/549bf0d6-2ea0-4991-ac35-44698210915e.jpg)

- צילום בסיס הנתונים אחרי העדכון
![image](Images/4e1f993f-3b7e-4adb-ab8a-6dc65606bc35.jpg)

#### Constraints

1. אילוץ CHECK המוודא שהדירוג הוא בין 1 ל-5
- צילום הרצה
![image](Images/50645b3d-1183-4804-812d-17d1cdd47862.jpg)

- נתונים אשר סותרים את האילוץ והודעת שגיאה
![image](Images/02302aa4-c0a4-44cd-89b3-c54412b16ec5.jpg)

2. אילוץ NOT NULL המוודא שסוג האירוע (EventType) תמיד יסופק
- צילום הרצה
![image](Images/d69122a8-8f9b-4d7a-bd65-18d1a853fb1f.jpg)

- נתונים אשר סותרים את האילוץ והודעת שגיאה
![image](Images/d0569605-0faf-445e-a08f-999bb3f94c64.jpg)

3. אילוץ CHECK כדי לוודא שתאריך האירוע אינו בעבר
- צילום הרצה
![image](Images/42dbdffe-b89a-4a08-9261-1f09d1ef44af.jpg)

- נתונים אשר סותרים את האילוץ והודעת שגיאה
![image](Images/c516a7f0-ffcd-4e59-8c15-fb474ecc445c.jpg)

4. אילוץ DEFAULT אם לא תציין את מספר המקומות הפנויים בעת הזנת אירוע חדש, הוא יוגדר אוטומטית ל-0.

- צילום הרצה
![image](Images/ee75a078-1870-4ff5-85c2-cf382ca2a6d3.jpg)

- נתונים אשר סותרים את האילוץ (לא הכנסנו ערך ל-Available_seats!) ותוצאה המראה שהשדה Available_seats הוא 0
![image](Images/badcfe6b-8241-4a26-b969-3037a8180dc9.jpg)
![image](Images/a42bd6a5-1dc8-4eb1-a9e0-24f43e0f6857.jpg)

#### Rollback and Commit


COMMIT
- צילום בסיס הנתונים לפני הcommit 
![image](Images/425219a8-87f6-4955-9134-c70a70109e7a.jpg)

- צילום הרצה
![image](Images/10649222-76e1-4ad4-a289-bfab653e5ade.jpg)
  
- צילום בסיס הנתונים אחרי הcommit 
![image](Images/d11ea2db-9814-4dbf-8094-5b80832e88d6.jpg)

- שמירת השינויים
![image](Images/8133d8a6-86a1-491c-bb24-23af90bda68d.jpg)

ROLLBACK
- צילום בסיס הנתונים לפני הrollback 
![image](Images/ea21c3d9-b192-4320-93b8-8fc37d9e8169.jpg)

- צילום הרצה
![image](Images/475a68fe-69ab-4acc-96de-6498b3759c50.jpg)
  
- צילום בסיס הנתונים אחרי הrollback 
![image](Images/76eb1518-8ad3-46ce-8cea-bb4d1ec8b344.jpg)

- ביטול השינוים
![image](Images/dd202062-3ada-4ce9-8c00-2d4e192d79ff.jpg)

---
## Phase 3: Integration & Views

### Introduction 

In this phase, we integrated our database with another team’s system. We performed reverse engineering to recreate the other team's ERD, then designed a unified ERD combining both systems. Using ALTER commands, we adapted our existing schema without recreating tables. Finally, we created two meaningful views—one for each original system—and wrote queries to demonstrate their use.

### ERD (Entity-Relationship Diagram)  
![ea200c23-5533-4a4a-971d-e7be67b7f419](https://github.com/user-attachments/assets/3aa75b1d-5442-4bf7-9992-f52bf5b1e77f)

---

### DSD (Data Structure Diagram)  
![fa762980-1df3-4120-a936-03230f17e7d4](https://github.com/user-attachments/assets/82141090-d6cd-4a54-a4c4-4dee62d3bb7d)

---

### Combined ERD (Entity-Relationship Diagram) 
![4dd37b64-c016-442d-a92d-9e6206366e62](https://github.com/user-attachments/assets/027ebe9b-c5aa-463f-b47b-f91020dae50f)
---

### DSD after integration (Data Structure Diagram)  
![5ffe05c9-e359-4b54-aaf1-fa2c4b7fa67d](https://github.com/user-attachments/assets/20ac0ee9-dc6a-4fc0-9bd7-1cf3a89c7c0d)
---

#### שלב האינטגרציה ברמת העיצוב:
הסבר כללי- אנחנו יצרנו בסיס נתונים שמנהל אולמות ארועים. האגף החדש ניהל בסיס נתונים שמנהל אולמות שמקיימים בהם הופעות. שינינו את היישויות כך שיתאימו ל2 האפשרויות.
* היישות Owner נשארה ללא שינוי כיוון שזו יישות שהייתה קיימת רק אצלינו.
* היישות Facilities נשארה ללא שינוי כיוון שזו יישות שהייתה קיימת רק אצלינו.
* הReview ללא שינוי כיון שהיו לנו אותם תכונות ביישות.
* הOwner ללא שינוי כיוון שזו יישות שהייתה קיימת רק אצלינו.
* ביישות Venue הוספנו שדה חדש של parking כי זו תכונה שלא הייתה קיימת אצלינו ונכון היה כן להוסיף אותה.
* בCustomers חיברנו אותו לTicket (יישות חדשה שהוספנו) בקשר של יחיד לרבים. אצלינו היישות Customers היא הUser באגף השני.
* הPerformer היא יישות חדשה שהוספנו עם השדות:  PerformerId , PerformerName, PerfContactInfo(מפתח) והיא מחוברת לEvent בקשר של רבים לרבים. זו יישות שלא הייתה קיימת אצלינו ולשם תמיכה בהופעות הוספנו אותה.
*הקשר event_performer- טבלת קשר בין אירועים לאומנים (רבים לרבים).
* ה Sponsor היא יישות חדשה שהוספנו עם השדות: SponsorId(מפתח) ,SponsorName, Payment ומחוברת ללEvent בקשר של רבים לרבים. זו יישות שלא הייתה קיימת אצלינו ולשם תמיכה בהופעות הוספנו אותה.
* הקשר event_sponsor- טבלת קשר רבים לרבים בין נותני חסות לאירועים.
* הTicket היא יישות חדשה שהוספנו עם השדות: TicketId(מפתח) , Price , saleDate ומחוברת לEvent בקשר של יחיד לרבים וגם לCustomers בקשר של יחיד לרבים. זו יישות שלא הייתה קיימת אצלינו ולשם תמיכה בהופעות הוספנו אותה.

---
#### שימוש בפקודות SQL:
* פקודת ALTER TABLE: לשינוי טבלאות קיימות (הוספת עמודה).
* פקודת CREATE TABLE: להגדרת טבלאות חדשות.
* פקודת FOREIGN KEY: ליצירת קשרים בין הטבלאות.
* פקודת ON DELETE CASCADE: לדאוג למחיקה אוטומטית של רשומות בתלויות.

---
#### צילום מסך ותאור הפקודות שנעשו:
* הוספת השדה החדש parking
![3b52ee36-a349-400e-a161-c834e543cff9](https://github.com/user-attachments/assets/9e328d47-e62b-4ee3-b908-9a7376960b7e)
![36b032de-3369-4366-b2c7-f371e83ee98b](https://github.com/user-attachments/assets/16f9bb2e-b6f0-4005-a11d-d9fee5d2e6a4)

* הוספת טבלת Performer יישות חדשה עם השדות: PerformerId , PerformerName, PerfContactInfo(מפתח)
![b43046cb-ca83-42b2-a83e-194f7102f540](https://github.com/user-attachments/assets/c9f2eaaa-69ca-4567-8bb0-985127f33a36)
![1f7a5203-7d39-4b7e-9c1b-4cae78019065](https://github.com/user-attachments/assets/18cad83e-5421-41ec-ae17-1c3e44f6100b)

* הוספת טבלת Sponsor יישות חדשה עם השדות: SponsorId(מפתח) ,SponsorName, Payment 
![654aba41-f3eb-483f-814f-14b2adff10c9](https://github.com/user-attachments/assets/507ccd8a-fc1f-4575-89a0-b57484e22797)
![a0c0c308-155c-4d2c-895c-2a971cb714ed](https://github.com/user-attachments/assets/916711b9-5a0b-4ca1-b2b6-d759f5793199)

* הוספת טבלת Ticket יישות חדשה עם השדות: TicketId(מפתח) , Price , saleDate
![aba876d7-1719-4d46-a804-5c455fdb6870](https://github.com/user-attachments/assets/7a6187a3-ced9-4f89-9e89-57b247df3d8f)
![6180c24f-4861-4030-b35e-4ba49ed436d2](https://github.com/user-attachments/assets/125d0da7-fe46-48ea-be70-7f3532723b5e)

* הקשר event_performer- טבלת קשר בין אירועים לאומנים (רבים לרבים).
![c7f0c127-2aa2-48ab-a9cf-aea3af669b76](https://github.com/user-attachments/assets/3f1e083d-dfda-4572-a250-55460534b583)
![0849d435-028e-446a-9935-1652e404c0df](https://github.com/user-attachments/assets/9a18b7b5-7efd-4cb8-ae07-43a5175dc8b3)

* הקשר event_sponsor- טבלת קשר רבים לרבים בין נותני חסות לאירועים.
![75fcae21-1514-4ee2-817e-807c4e9fbccb](https://github.com/user-attachments/assets/1afb205e-b5bf-4599-99bc-ea53bc356e1b)
![b06ab9d6-d60c-4691-a2f2-470f1dbab488](https://github.com/user-attachments/assets/e8d6c554-f79c-4001-ba11-cab30ea8d963)

---
### Views:
* מבט המציג מידע על כל כרטיס שנרכש – כולל מחיר, תאריך רכישה, שם הלקוח, וסוג האירוע.
![5356b4fc-b1a5-40b5-b315-23cacfd129c4](https://github.com/user-attachments/assets/79d281b4-6343-4d8a-8fd7-03e7f02779ce)
![95f65ce8-5734-472c-b2e0-5dec8eed652a](https://github.com/user-attachments/assets/9255f319-e5d7-45a7-83c8-396bc8d4bc58)

* מבט המציג רשימה של כל האירועים עם שמות האומנים המשתתפים בהם.
![e15ac049-b9fb-4022-b7d8-9484d8ec0a42](https://github.com/user-attachments/assets/37cdc204-b997-49d0-9c49-8c86cacfc49a)
![5a04687b-7258-4264-a20d-602e57d7cde2](https://github.com/user-attachments/assets/27d0c0a1-cd69-4968-a0c2-66dbe9867e55)




