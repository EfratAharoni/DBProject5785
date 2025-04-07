
## Table of Contents  
- [Phase 1: Design and Build the Database](#phase-1-design-and-build-the-database)  
  - [Introduction](#introduction)  
  - [ERD (Entity-Relationship Diagram)](#erd-entity-relationship-diagram)  
  - [DSD (Data Structure Diagram)](#dsd-data-structure-diagram)  
  - [SQL Scripts](#sql-scripts)  
  - [Data](#data)  
- [Phase 2: Integration](#phase-2-integration)  

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


## Phase 2: Integration 
