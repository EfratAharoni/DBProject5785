CREATE TABLE if not exists Venue (
    VenId INT PRIMARY KEY,
    VenName VARCHAR(255) NOT NULL,
    Location VARCHAR(255),
    Capacity INT,
    VenuDescription TEXT,
    Rental_price DECIMAL(10,2)
);

CREATE TABLE if not exists Facilities (
    id INT PRIMARY KEY,
    FacilityId INT,
    FacilityName VARCHAR(255) NOT NULL,
    FacilityDescription TEXT,
    FOREIGN KEY (FacilityId) REFERENCES Venue(VenId)
);

CREATE TABLE if not exists Events (
    EventId INT PRIMARY KEY,
    EventType VARCHAR(255) NOT NULL,
    EventDate DATE NOT NULL,
    Available_seats INT,
    Additional_fees DECIMAL(10,2)
);

CREATE TABLE if not exists Customers (
    CusId INT PRIMARY KEY,
    CusName VARCHAR(255) NOT NULL,
    CusContactInfo VARCHAR(255),
    CusEmail VARCHAR(255) UNIQUE
);

CREATE TABLE if not exists Reviews (
    RevId INT PRIMARY KEY,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    RevDescription TEXT,
    RevDate DATE,
    VenId INT,
    FOREIGN KEY (VenId) REFERENCES Venue(VenId)
);

CREATE TABLE if not exists Owners (
    OwnerId INT PRIMARY KEY,
    OwnerName VARCHAR(255) NOT NULL,
    OwnerContactInfo VARCHAR(255),
    OwnerEmail VARCHAR(255) UNIQUE,
    VenId INT,
    FOREIGN KEY (VenId) REFERENCES Venue(VenId)
);
