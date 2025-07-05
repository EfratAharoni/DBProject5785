# Avishag Timstit & Efrat Aharoni 

## Table of Contents  
- [Phase 1: Design and Build the Database](#phase-1-design-and-build-the-database)  
  - [Introduction](#introduction)  
  - [ERD (Entity-Relationship Diagram)](#erd-entity-relationship-diagram)  
  - [DSD (Data Structure Diagram)](#dsd-data-structure-diagram)  
  - [SQL Scripts](#sql-scripts)  
  - [Data](#data)  

- [Phase 2: Queries & Constraints](#phase-2-queries--constraints)  
  - [Introduction](#introduction-1)  
  - [SQL Queries](#sql-queries)  
  - [SELECT Queries](#select-queries)  
  - [DELETE Queries](#delete-queries)  
  - [UPDATE Queries](#update-queries)  
  - [Constraints](#constraints)  
  - [Rollback and Commit](#rollback-and-commit)  

- [Phase 3: Integration & Views](#phase-3-integration--views)  
  - [Introduction](#introduction-2)  
  - [ERD (Entity-Relationship Diagram)](#erd-entity-relationship-diagram-1)  
  - [DSD (Data Structure Diagram)](#dsd-data-structure-diagram-1)  
  - [Combined ERD (Entity-Relationship Diagram)](#combined-erd-entity-relationship-diagram)  
  - [DSD after integration (Data Structure Diagram)](#dsd-after-integration-data-structure-diagram)  
  - [The integration phase at the design level](#the-integration-phase-at-the-design-level)  
  - [Use of SQL commands](#use-of-sql-commands)  
  - [Screenshot and description of the executed commands](#screenshot-and-description-of-the-executed-commands)  
  - [Views](#views)  

- [Phase 4: Programming](#phase-4-programming)  
  - [Introduction](#introduction-3)  
  - [FUNCTION 1](#function-1)  
  - [FUNCTION 2](#function-2)  
  - [PROCEDURE 1](#procedure-1)  
  - [PROCEDURE 2](#procedure-2)  
  - [TRIGGER 1](#trigger-1)  
  - [TRIGGER 2](#trigger-2)  
  - [Main Program 1](#main-program-1)  
  - [Main Program 2](#main-program-2)  

- [Phase 5 – Creating a Graphical User Interface (GUI) for Working with the Database](#phase-5--creating-a-graphical-user-interface-gui-for-working-with-the-database)  
  - [Introduction](#introduction-4)  
  - [Project Execution Guide](#project-execution-guide)




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

#### The integration phase at the design level
שלב האינטגרציה ברמת העיצוב:
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
#### Use of SQL commands
שימוש בפקודות SQL:
* פקודת ALTER TABLE: לשינוי טבלאות קיימות (הוספת עמודה).
* פקודת CREATE TABLE: להגדרת טבלאות חדשות.
* פקודת FOREIGN KEY: ליצירת קשרים בין הטבלאות.
* פקודת ON DELETE CASCADE: לדאוג למחיקה אוטומטית של רשומות בתלויות.

---
#### Screenshot and description of the executed commands 
צילום מסך ותאור הפקודות שנעשו:
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

---
## Phase 4: Programming

### Introduction 

In this phase, we implemented non-trivial PL/pgSQL programs based on our existing database schema. The goal was to enhance the functionality of the system through advanced database logic. Specifically, we developed two functions and two procedures that perform meaningful operations involving multiple tables. In addition, we implemented two triggers to automate behaviors in response to specific data changes. Finally, we wrote two main programs that demonstrate the practical use of the functions and procedures. These programs are designed to showcase our ability to write modular, efficient, and maintainable PL/pgSQL code.

### FUNCTION 1
פונקציה 1 ניהול אירועים וכרטיסיות
#### תיאור מילולי של הפונקציה:
הפונקציה אחראית על תהליך רכישת כרטיסים לאירוע מסוים. היא מקבלת מזהה אירוע, מזהה לקוח, מספר כרטיסים ומחיר מקסימלי מותר לכרטיס. הפונקציה מחשבת את המחיר בהתאם לסוג האירוע וגודל האולם, מיישמת הנחות לפי כמות הכרטיסים, יוצרת כרטיסים חדשים בטבלה, ומחזירה מידע על המכירה.

#### צילום הרצה:
![7557bea4-1b3b-4e67-8566-867ee0e0d02b](https://github.com/user-attachments/assets/d99eeef8-bb03-4b53-b469-af2ad41f608f)


### FUNCTION 2
פונקציה 2: יצירת דוח מפורט על אירועים עם החזרת Ref Cursor
#### תיאור מילולי של הפונקציה:
פונקציה זו יוצרת דוח מפורט על אירועים בטווח תאריכים נתון, תוך סינון לפי דירוג מינימלי. הפלט מוחזר כ־Ref Cursor, המאפשר שליפת תוצאות מרובות בצורה גמישה.

#### צילום הרצה:
![ac2c6feb-4742-4622-8009-7a74cf44c69a](https://github.com/user-attachments/assets/5148537a-23cf-414b-a808-9d684fd1cd9a)

### PROCEDURE 1
פרוצדורה 1: עדכון מחירי כרטיסים וניהול מבצעים
#### תיאור מילולי של הפרוצדורה:
פרוצדורה זו מבצעת עדכון דינמי של מחירי כרטיסים בהתאם לפרמטרים כגון סוג האירוע, מספר הימים שנותרו עד לתאריך האירוע, והביקוש (תפוסה). הפרוצדורה מתאימה מבצעי הנחה או העלאת מחיר, ומעדכנת את ההיסטוריה בטבלה ייעודית.

#### צילום הרצה:
![90439bbd-4f7c-4473-8f85-76e57134e92a](https://github.com/user-attachments/assets/c6d621d8-0438-49c4-a4e5-6539ded65c31)

### PROCEDURE 2
פרוצדורה 2: תחזוקה וניקוי נתונים במערכת
#### תיאור מילולי של הפרוצדורה:
ביצוע תחזוקה שוטפת לבסיס הנתונים באמצעות ניקוי חכם של נתונים ישנים, יתומים או לא רלוונטיים. הפרוצדורה מבצעת ניקוי מותאם לפי מצב ('SAFE' או 'AGGRESSIVE') וכוללת:
מחיקת אירועים ישנים ללא פעילות.
מחיקת כרטיסים יתומים.
מחיקת ביקורות לא איכותיות.
סימון לקוחות לא פעילים.
עדכון סטטיסטיקת אולמות.

#### צילום הרצה:
![7c08864c-91ab-42ae-bdbd-864453e6c579](https://github.com/user-attachments/assets/08f2e502-6c32-4942-8db4-7aeee92c8297)

### TRIGGER 1
טריגר 1: עדכון אוטומטי של מקומות זמינים באירועים
#### תיאור מילולי של התוכנית:
ניטור בזמן אמת של שינויים בטבלת הכרטיסים (ticket) ועדכון אוטומטי של מספר המקומות הפנויים באירוע הרלוונטי בטבלת events. בנוסף, הטריגר מפעיל התראות, לוגים, וניהול חריגות.

#### צילום הרצה:
![c6471534-a066-46ca-b464-18550e5ddbb5](https://github.com/user-attachments/assets/8a2cb661-5ea7-4e6c-80bf-2711b8dd9b66)


### TRIGGER 2
טריגר 2: בדיקות תקינות וביקורת לביקורות ואירועים
#### תיאור מילולי של התוכנית:
טריגר שמטרתו לוודא שביקורות (reviews) הן תקינות, אמינות ומבוססות על השתתפות באירוע, ולשמור יומן שינויים (audit trail) מלא לכל פעולה – יצירה, עדכון ומחיקה.
#### צילום הרצה:
![dbe21409-48a8-4767-8202-391e1d051b89](https://github.com/user-attachments/assets/149c3bc2-69a5-4261-a4bb-fdbe004f33d0)


### Main Program 1
תוכנית ראשית 1: מכירת כרטיסים ועדכון מחירים

#### תיאור מילולי של התוכנית:
תוכנית זו מנהלת תהליך מכירת כרטיסים לאירועים ועדכון מחירי הכרטיסים בהתאם לסוג האירוע ומועדו. בתחילה היא מנסה למכור כרטיסים במחיר מרבי שהוגדר, לאחר מכן מעדכנת מחירים עם הנחות ומגבלות על העלאת מחיר, ומבצעת מכירה נוספת כדי לבדוק את השפעת העדכונים. בסיום, התוכנית מפיקה דוחות סיכום וסטטיסטיקות על אירועים ומכירות נוכחיות, ומטפלת בשגיאות במהלך התהליך.

#### הקוד שלה:
-- MAIN PROGRAM 1: ticket sales + pricing update
DO $$
DECLARE
    ----------------------------------------------------------------
    -- פרמטרים ראשוניים למכירת כרטיסים
    ----------------------------------------------------------------
    v_event_id      INTEGER := 1;
    v_customer_id   INTEGER := 1;
    v_ticket_count  INTEGER := 3;
    v_max_price     NUMERIC := 200.00;

    ----------------------------------------------------------------
    -- פרמטרים לעדכון מחירים
    ----------------------------------------------------------------
    v_event_type          VARCHAR := 'Concert';
    v_discount_percentage NUMERIC := 15.0;
    v_min_days_before     INTEGER := 10;

    ----------------------------------------------------------------
    -- משתנים לסיכום
    ----------------------------------------------------------------
    v_ticket_record   RECORD;
    v_total_tickets   INTEGER := 0;
    v_total_revenue   NUMERIC := 0;
    v_success_cnt     INTEGER := 0;
    v_error_cnt       INTEGER := 0;
    v_summary_record  RECORD;
BEGIN
    RAISE NOTICE '=== MAIN PROGRAM 1: TICKET SALES AND PRICING MANAGEMENT ===';
    RAISE NOTICE 'Started at: %', CURRENT_TIMESTAMP;

    /* ------------------------------------------------------------
       PHASE 1 – ניסיון מכירת כרטיסים
    ------------------------------------------------------------ */
    RAISE NOTICE 'PHASE 1: SELLING TICKETS';
    RAISE NOTICE 'Attempting to sell % tickets for event % to customer %',
                 v_ticket_count, v_event_id, v_customer_id;

    BEGIN
        FOR v_ticket_record IN
            SELECT * FROM manage_ticket_sales(
                v_event_id,
                v_customer_id,
                v_ticket_count,
                v_max_price)
        LOOP
            IF v_ticket_record.sale_status = 'SOLD' THEN
                v_success_cnt   := v_success_cnt + 1;
                v_total_revenue := v_total_revenue + v_ticket_record.final_price;

                RAISE NOTICE
                      'SUCCESS: Ticket ID % sold for $%  (seats remaining: %)',
                      v_ticket_record.ticket_id,
                      v_ticket_record.final_price,
                      v_ticket_record.seats_remaining;
            ELSE
                v_error_cnt := v_error_cnt + 1;
                RAISE NOTICE 'FAILED: %', v_ticket_record.sale_status;
            END IF;
        END LOOP;

        v_total_tickets := v_success_cnt;

    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'ERROR in ticket sales: %', SQLERRM;
            v_error_cnt := v_error_cnt + 1;
    END;

    RAISE NOTICE '';
    RAISE NOTICE 'PHASE 1 RESULTS – sold:%  failed:%  revenue:$%',
                 v_success_cnt,
                 v_error_cnt,
                 ROUND(v_total_revenue,2);

    /* ------------------------------------------------------------
       PHASE 2 – עדכון מחירים
    ------------------------------------------------------------ */
    RAISE NOTICE '';
    RAISE NOTICE 'PHASE 2: UPDATING TICKET PRICING';
    RAISE NOTICE 'Event type: %  |  Discount: % %%  |  Min‑days: %',
                 v_event_type,
                 v_discount_percentage,
                 v_min_days_before;

    BEGIN
        CALL update_ticket_pricing_and_promotions(
            v_event_type,
            v_discount_percentage,
            v_min_days_before,
            50.00   -- max price increase
        );
        RAISE NOTICE 'Pricing update completed successfully';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'ERROR in pricing update: %', SQLERRM;
    END;

    /* ------------------------------------------------------------
       PHASE 3 – מכירה נוספת אחרי שינוי מחירים
    ------------------------------------------------------------ */
    RAISE NOTICE '';
    RAISE NOTICE 'PHASE 3: SELLING ADDITIONAL TICKETS AFTER PRICING UPDATE';

    v_event_id     := 2;
    v_customer_id  := 2;
    v_ticket_count := 2;
    v_success_cnt  := 0;
    v_error_cnt    := 0;

    BEGIN
        FOR v_ticket_record IN
            SELECT * FROM manage_ticket_sales(
                v_event_id,
                v_customer_id,
                v_ticket_count,
                v_max_price)
        LOOP
            IF v_ticket_record.sale_status = 'SOLD' THEN
                v_success_cnt   := v_success_cnt + 1;
                v_total_revenue := v_total_revenue + v_ticket_record.final_price;

                RAISE NOTICE
                      'SUCCESS: Ticket ID % sold for $%',
                      v_ticket_record.ticket_id,
                      v_ticket_record.final_price;
            ELSE
                v_error_cnt := v_error_cnt + 1;
                RAISE NOTICE 'FAILED: %', v_ticket_record.sale_status;
            END IF;
        END LOOP;

        v_total_tickets := v_total_tickets + v_success_cnt;

    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'ERROR in additional ticket sales: %', SQLERRM;
    END;

    /* ------------------------------------------------------------
       PHASE 4 – דוח סיכום
    ------------------------------------------------------------ */
    RAISE NOTICE '';
    RAISE NOTICE 'PHASE 4: SUMMARY REPORT';

    -- סטטיסטיקה על אירועים עתידיים
    FOR v_summary_record IN
        SELECT COUNT(*)  AS total_events,
               SUM(CASE WHEN available_seats = 0 THEN 1 ELSE 0 END) AS sold_out,
               AVG(available_seats) AS avg_avail
        FROM   events
        WHERE  eventdate >= CURRENT_DATE
    LOOP
        RAISE NOTICE 'Upcoming events: % | Sold‑out: % | Avg seats left: %',
                     v_summary_record.total_events,
                     v_summary_record.sold_out,
                     COALESCE(ROUND(v_summary_record.avg_avail),0);
    END LOOP;

    -- סטטיסטיקה של מכירות היום
    FOR v_summary_record IN
        SELECT COUNT(*) AS tickets_today,
               SUM(price) AS revenue_today,
               AVG(price) AS avg_price_today
        FROM   ticket
        WHERE  saledate = CURRENT_DATE
    LOOP
        RAISE NOTICE 'Today – tickets:%  revenue:$%  avg price:$%',
                     v_summary_record.tickets_today,
                     COALESCE(ROUND(v_summary_record.revenue_today,2),0),
                     COALESCE(ROUND(v_summary_record.avg_price_today,2),0);
    END LOOP;

    /* ------------------------------------------------------------
       סיכום כולל
    ------------------------------------------------------------ */
    RAISE NOTICE '';
    RAISE NOTICE '=== PROGRAM EXECUTION SUMMARY ===';
    RAISE NOTICE 'Total tickets sold: %', v_total_tickets;
    RAISE NOTICE 'Total revenue:      $%', ROUND(v_total_revenue,2);
    RAISE NOTICE 'Completed at: %',    CURRENT_TIMESTAMP;

    COMMIT;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'CRITICAL ERROR in main program: %', SQLERRM;
        ROLLBACK;
END;
$$;

#### הוכחה שהתוכנית אכן עובדת:
![8b0fdbe3-b89e-4c21-91d2-ecc8f5d90261](https://github.com/user-attachments/assets/dd15fa70-e92d-47a2-82d2-209501151e05)
![613d1112-42d1-4e29-ac6a-1cfdb36c43f2](https://github.com/user-attachments/assets/41806604-5da0-4dfd-aa41-c8f3ae2c7beb)



### Main Program 2
תוכנית ראשית 2: עדכון כמות מקומות ופרס לספונסרים
#### תיאור מילולי של התוכנית:
התוכנית מפיקה דוח מפורט על האירועים, מבצעת עדכוני מחירים חכמים לפי מצב התפוסה, מבצעת תחזוקה וניקוי של אירועים ישנים במידת הצורך, ומסכמת את כל התהליך עם דוחות, המלצות ומעקב שגיאות.

#### הקוד שלה:
-- תוכנית ראשית - מערכת ניהול אירועים משולבת (גרסה מתוקנת)
-- משלבת דוח אירועים + עדכון מחירים + ניקוי מערכת

DO $$
DECLARE
    -- משתנים עיקריים
    v_report_cursor REFCURSOR;
    v_event_record RECORD;
    v_processed_events INTEGER := 0;
    v_high_revenue_events INTEGER := 0;
    v_low_occupancy_events INTEGER := 0;
    
    -- פרמטרים לדוח
    v_start_date DATE := CURRENT_DATE - INTERVAL '60 days';
    v_end_date DATE := CURRENT_DATE + INTERVAL '30 days';
    v_min_rating INTEGER := 3;
    
    -- פרמטרים לעדכון מחירים
    v_concert_discount NUMERIC := 15.0;
    v_theater_discount NUMERIC := 10.0;
    v_days_threshold INTEGER := 14;
    
    -- משתנים סטטיסטיים
    v_total_revenue NUMERIC := 0;
    v_avg_occupancy NUMERIC := 0;
    v_events_needing_promotion INTEGER := 0;
    
    -- Exception handling
    v_error_count INTEGER := 0;
    v_current_operation VARCHAR(100);
    
BEGIN
    RAISE NOTICE '=== התחלת תוכנית ניהול אירועים משולבת ===';
    RAISE NOTICE 'תאריך התחלה: %', v_start_date;
    RAISE NOTICE 'תאריך סיום: %', v_end_date;
    RAISE NOTICE 'דירוג מינימלי: %', v_min_rating;
    
    -- שלב 1: יצירת דוח מפורט על אירועים
    BEGIN
        v_current_operation := 'Creating events report';
        RAISE NOTICE '';
        RAISE NOTICE '--- שלב 1: יצירת דוח אירועים ---';
        
        -- קריאה לפונקציה get_events_report
        SELECT get_events_report(v_start_date, v_end_date, v_min_rating) 
        INTO v_report_cursor;
        
        -- עיבוד תוצאות הדוח
        LOOP
            FETCH v_report_cursor INTO v_event_record;
            EXIT WHEN NOT FOUND;
            
            v_processed_events := v_processed_events + 1;
            v_total_revenue := v_total_revenue + COALESCE(v_event_record.event_revenue, 0);
            
            -- זיהוי אירועים בעלי הכנסות גבוהות
            IF v_event_record.event_revenue > 5000 THEN
                v_high_revenue_events := v_high_revenue_events + 1;
                RAISE NOTICE 'אירוע רווחי: % - סוג: % - הכנסות: $%', 
                           v_event_record.eventid, 
                           v_event_record.eventtype,
                           v_event_record.event_revenue;
            END IF;
            
            -- זיהוי אירועים עם תפוסה נמוכה הזקוקים לקידום
            IF v_event_record.occupancy_rate < 50 
               AND v_event_record.eventdate > CURRENT_DATE THEN
                v_low_occupancy_events := v_low_occupancy_events + 1;
                v_events_needing_promotion := v_events_needing_promotion + 1;
                
                RAISE NOTICE 'אירוע זקוק לקידום: % - תפוסה: %', 
                           v_event_record.eventid,
                           ROUND(v_event_record.occupancy_rate, 1);
                RAISE NOTICE '  מקומות זמינים: %', v_event_record.available_seats;
            END IF;
            
            -- חישוב ממוצע תפוסה
            v_avg_occupancy := v_avg_occupancy + COALESCE(v_event_record.occupancy_rate, 0);
            
            -- הדפסת פרטי אירוע מעניינים (רק לאירועים הראשונים)
            IF v_processed_events <= 3 THEN
                RAISE NOTICE 'אירוע %: % ב-%', 
                           v_event_record.eventid,
                           v_event_record.eventtype,
                           v_event_record.venname;
                RAISE NOTICE '  תאריך: % - תפוסה: %', 
                           v_event_record.eventdate,
                           ROUND(v_event_record.occupancy_rate, 1);
                RAISE NOTICE '  ביקורות: % - דירוג ממוצע: %', 
                           v_event_record.total_reviews,
                           ROUND(v_event_record.average_rating, 2);
            END IF;
        END LOOP;
        
        CLOSE v_report_cursor;
        
        -- חישוב סטטיסטיקות
        IF v_processed_events > 0 THEN
            v_avg_occupancy := v_avg_occupancy / v_processed_events;
        END IF;
        
        RAISE NOTICE 'סיכום דוח: % אירועים נמצאו', v_processed_events;
        RAISE NOTICE 'סה"כ הכנסות: $%', ROUND(v_total_revenue, 2);
        RAISE NOTICE 'ממוצע תפוסה: %', ROUND(v_avg_occupancy, 2);
                     
    EXCEPTION
        WHEN OTHERS THEN
            v_error_count := v_error_count + 1;
            RAISE NOTICE 'שגיאה בשלב %: %', v_current_operation, SQLERRM;
    END;
    
    -- שלב 2: עדכון מחירי כרטיסים לאירועים זקוקים לקידום
    BEGIN
        v_current_operation := 'Updating ticket pricing';
        RAISE NOTICE '';
        RAISE NOTICE '--- שלב 2: עדכון מחירי כרטיסים ---';
        
        IF v_events_needing_promotion > 0 THEN
            RAISE NOTICE 'מעדכן מחירים עבור אירועי קונצרטים';
            RAISE NOTICE 'הנחה: %', v_concert_discount;
            
            -- עדכון מחירים לקונצרטים
            CALL update_ticket_pricing_and_promotions(
                p_event_type := 'Concert',
                p_discount_percentage := v_concert_discount,
                p_min_days_before_event := v_days_threshold,
                p_max_price_increase := 30.0
            );
            
            RAISE NOTICE 'מעדכן מחירים עבור אירועי תיאטרון';
            RAISE NOTICE 'הנחה: %', v_theater_discount;
            
            -- עדכון מחירים לתיאטרון
            CALL update_ticket_pricing_and_promotions(
                p_event_type := 'Theater',
                p_discount_percentage := v_theater_discount,
                p_min_days_before_event := v_days_threshold,
                p_max_price_increase := 25.0
            );
        ELSE
            RAISE NOTICE 'לא נמצאו אירועים הזקוקים לעדכון מחירים';
        END IF;
        
    EXCEPTION
        WHEN OTHERS THEN
            v_error_count := v_error_count + 1;
            RAISE NOTICE 'שגיאה בשלב %: %', v_current_operation, SQLERRM;
    END;
    
    -- שלב 3: ניקוי מערכת אם יש הרבה אירועים ישנים
    BEGIN
        v_current_operation := 'System maintenance cleanup';
        RAISE NOTICE '';
        RAISE NOTICE '--- שלב 3: בדיקת צורך בניקוי מערכת ---';
        
        DECLARE
            v_old_events_count INTEGER;
        BEGIN
            -- בדיקת כמות אירועים ישנים
            SELECT COUNT(*)
            INTO v_old_events_count
            FROM events
            WHERE eventdate < CURRENT_DATE - INTERVAL '180 days';
            
            RAISE NOTICE 'נמצאו % אירועים ישנים (מעל 180 יום)', v_old_events_count;
            
            IF v_old_events_count > 100 THEN
                RAISE NOTICE 'מפעיל ניקוי מערכת במצב AGGRESSIVE';
                
                CALL system_maintenance_cleanup(
                    p_days_old := 365,
                    p_cleanup_mode := 'AGGRESSIVE'
                );
            ELSIF v_old_events_count > 50 THEN
                RAISE NOTICE 'מפעיל ניקוי מערכת במצב SAFE';
                
                CALL system_maintenance_cleanup(
                    p_days_old := 180,
                    p_cleanup_mode := 'SAFE'
                );
            ELSE
                RAISE NOTICE 'לא נדרש ניקוי מערכת כרגע';
            END IF;
        END;
        
    EXCEPTION
        WHEN OTHERS THEN
            v_error_count := v_error_count + 1;
            RAISE NOTICE 'שגיאה בשלב %: %', v_current_operation, SQLERRM;
    END;
    
    -- שלב 4: סיכום ודיווח
    BEGIN
        v_current_operation := 'Final summary';
        RAISE NOTICE '';
        RAISE NOTICE '=== סיכום תוכנית ניהול אירועים ===';
        RAISE NOTICE 'אירועים שעובדו: %', v_processed_events;
        RAISE NOTICE 'אירועים רווחיים: %', v_high_revenue_events;
        RAISE NOTICE 'אירועים עם תפוסה נמוכה: %', v_low_occupancy_events;
        RAISE NOTICE 'סה"כ הכנסות: $%', ROUND(v_total_revenue, 2);
        RAISE NOTICE 'ממוצע תפוסה: %', ROUND(v_avg_occupancy, 2);
        RAISE NOTICE 'שגיאות שאירעו: %', v_error_count;
        
        -- המלצות בהתבסס על הנתונים
        RAISE NOTICE '';
        RAISE NOTICE '--- המלצות ---';
        
        IF v_avg_occupancy < 60 THEN
            RAISE NOTICE '• ממוצע התפוסה נמוך - מומלץ לשפר אסטרטגיות שיווק';
        END IF;
        
        IF v_low_occupancy_events > (v_processed_events * 0.3) THEN
            RAISE NOTICE '• יותר מ-30 אחוז מהאירועים עם תפוסה נמוכה';
            RAISE NOTICE '  מומלץ לבחון מחירים והיצע';
        END IF;
        
        IF v_high_revenue_events > 0 THEN
            RAISE NOTICE '• יש % אירועים רווחיים', v_high_revenue_events;
            RAISE NOTICE '  מומלץ לנתח מה הופך אותם למוצלחים';
        END IF;
        
        IF v_error_count = 0 THEN
            RAISE NOTICE '✓ התוכנית הושלמה בהצלחה ללא שגיאות!';
        ELSE
            RAISE NOTICE '⚠ התוכנית הושלמה עם % שגיאות', v_error_count;
            RAISE NOTICE '  יש לבדוק הלוגים';
        END IF;
        
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'שגיאה חמורה בסיכום: %', SQLERRM;
    END;
    
    RAISE NOTICE '=== סיום תוכנית ניהול אירועים ===';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'שגיאה כללית בתוכנית: %', SQLERRM;
        RAISE;
END;
$$;

#### הוכחה שהתוכנית אכן עובדת:
![image](https://github.com/user-attachments/assets/93e58e7a-ba02-46ea-ab46-a1dcc6db3cf3)
![image](https://github.com/user-attachments/assets/db079fab-fec2-400f-97cb-bd6807c18797)


---

## Phase 5 – Creating a Graphical User Interface (GUI) for Working with the Database

### Introduction  
Event and Venue Management System with Ticketing and Response Handling

Full-stack development using React.js with TypeScript (Frontend) and Node.js with Express (Backend)

Database managed via PostgreSQL on pgAdmin in Docker

Custom UI components, including dynamic tables for data presentation

Integrated RESTful APIs for seamless communication between frontend and database

Key skills: database design and management, interactive UI development, state management in React, TypeScript for improved code quality, responsive design

Features include event and venue management, customer management system, modular admin dashboard with category filters, and dynamic data analytics


מערכת לניהול אולמות ואירועים עם כרטיסים וטיפול בתגובות

פיתוח מלא (Full-stack) עם React.js ו-TypeScript בצד הלקוח ו־Node.js עם Express בצד השרת

מסד נתונים PostgreSQL מנוהל באמצעות pgAdmin בתוך Docker

שימוש ברכיבי UI מותאמים אישית, כולל טבלאות דינמיות להצגת נתונים

אינטגרציה עם RESTful APIs לתקשורת יעילה בין ה-Frontend ל-Database

כישורים מרכזיים: עיצוב וניהול מסדי נתונים, פיתוח ממשקי משתמש אינטראקטיביים, ניהול State בריאקט, שימוש ב-TypeScript לשיפור איכות הקוד, ועיצוב רספונסיבי

פונקציות מרכזיות: ניהול אירועים ואולמות, מערכת ניהול לקוחות, דשבורד מודולרי עם סינון לפי קטגוריות, וניתוח דינמי של נתונים.


### Project Execution Guide
Steps to run the project:
1. Restore the attached backup.
2. Install the packages:
npm install next react react-dom
npm install
You might need to install additional packages as well.
5. Run the project:
npm run dev

שלבים להרצה:
1. לעשות RESTORE לBACKUP המצורף
2. להתקין את החבילות
npm install next react react-dom
npm install
יתכן ותצטרכו להתקין חבילות נוספות.
4. להריץ npm run dev





