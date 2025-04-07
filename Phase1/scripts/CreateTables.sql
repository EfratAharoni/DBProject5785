CREATE TABLE if not exists Venue (
    VenId INT PRIMARY KEY,
    VenName VARCHAR(256) NOT NULL,
    Location VARCHAR(256),
    Capacity INT,
    VenuDescription TEXT,
    Rental_price DECIMAL(10,2)
);

CREATE TABLE if not exists Facilities (
    FacilityId INT,
    FacilityName VARCHAR(256) NOT NULL,
    FacilityDescription TEXT,
    VenId INT NOT NULL,
    PRIMARY KEY (FacilityId),
    FOREIGN KEY (FacilityId) REFERENCES Venue(VenId)
);

CREATE TABLE if not exists Events (
    EventId INT PRIMARY KEY,
    EventType VARCHAR(256) NOT NULL,
    EventDate DATE NOT NULL,
    Available_seats INT,
    Additional_fees VARCHAR(256)
);

CREATE TABLE if not exists Customers (
    CusId INT PRIMARY KEY,
    CusName VARCHAR(256) NOT NULL,
    CusContactInfo VARCHAR(256),
    CusEmail VARCHAR(256) 
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
    OwnerName VARCHAR(256) NOT NULL,
    OwnerContactInfo VARCHAR(256),
    OwnerEmail VARCHAR(256),
    VenId INT,
    FOREIGN KEY (VenId) REFERENCES Venue(VenId)
);
