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


---

## Phase 1: Design and Build the Database  

### Introduction  

The **Nursery School Database** is designed to efficiently manage information related to children, parents, nannies, and nursery groups. This system ensures smooth organization and tracking of essential details such as group assignments, caregiver experience, child-parent relationships, and contact information.  

---

### ERD (Entity-Relationship Diagram)  
![image](https://github.com/user-attachments/assets/d5b40409-fc1b-4980-ae7e-56ee42eb001b)

---

### DSD (Data Structure Diagram)  
![image](https://github.com/user-attachments/assets/9e3fdab6-c707-408e-982b-08ae5caff077)

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

5. **השאילתא מחזירה ממוצע דירוג לכל אולם**
![image](Images/24ac3952-73e6-4624-9823-1fda673f5b58.jpg)

6. **השאילתא מציגה את כל האירועים שהתקיימו בשנת 2025 באולמות שבהם מחיר השכירות גבוה מהממוצע, ממוין לפי מספר המקומות הפנויים (מהכי הרבה לפחות).**
![image](Images/cae5775e-1b9c-420d-a67c-8f4eeba7e378.jpg)

7. **מחזירה אולמות שלא קיבלו חוות דעת עם דירוג 4 ומעלה.**
![image](Images/cc1625f1-4036-4343-9855-9341a2c05e57.jpg)

8. **השאילתא מחזירה אולמות שאין להם מתקנים משויכים**
![image](Images/6d731f3b-cdeb-48c8-a0d2-fe39148173a2.jpg)


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
![image]()

- צילום הרצה
![image]()

- צילום בסיס הנתונים אחרי העדכון
![image](Images/02daa60b-3adf-40f2-80e3-fe225df1baf0.jpg)

1. שאילתא המעדכנת את כתובת הדוא"ל של לקוח בהתבסס על ת.ז שלו
- צילום בסיס הנתונים לפני העדכון
![image](Images/970eb21d-6428-4e88-8b19-3f24890853b2.jpg)

- צילום הרצה
![image](Images/549bf0d6-2ea0-4991-ac35-44698210915e.jpg)

- צילום בסיס הנתונים אחרי העדכון
![image](Images/4e1f993f-3b7e-4adb-ab8a-6dc65606bc35.jpg)



