-- Create the database
CREATE DATABASE IF NOT EXISTS mydb;
USE mydb;

-- Table for user accounts
CREATE TABLE IF NOT EXISTS login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Table for matches
CREATE TABLE IF NOT EXISTS `match` (
    matchid INT AUTO_INCREMENT PRIMARY KEY,
    teama VARCHAR(255) NOT NULL,
    teamb VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL
);

-- Table for stadiums
CREATE TABLE IF NOT EXISTS stadium (
    stadium_name VARCHAR(255) PRIMARY KEY,
    city VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    capacity INT NOT NULL
);

-- Table for ticket fare mapping (stadium and match relation)
CREATE TABLE IF NOT EXISTS `in` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matchid INT NOT NULL,
    stadium_name VARCHAR(255) NOT NULL,
    ticket_fare DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (matchid) REFERENCES `match`(matchid) ON DELETE CASCADE,
    FOREIGN KEY (stadium_name) REFERENCES stadium(stadium_name) ON DELETE CASCADE
);

-- Table for orders
CREATE TABLE IF NOT EXISTS `order` (
    orderid VARCHAR(36) PRIMARY KEY, -- UUID for unique order identification
    name VARCHAR(255) NOT NULL,
    phonenum VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    matchid INT NOT NULL,
    num_of_seats INT NOT NULL,
    FOREIGN KEY (email) REFERENCES login(email) ON DELETE CASCADE,
    FOREIGN KEY (matchid) REFERENCES `match`(matchid) ON DELETE CASCADE
);

-- select * from `in` ;
-- select * from `match` ;
-- select * from `stadium` ;

-- INSERT INTO `match` (teama, teamb, date, time)
-- VALUES ('IND', 'AUS', '2024-12-02', '09:30:00');
-- INSERT INTO stadium (stadium_name, city, country, capacity)
-- VALUES ('Adelaide Oval', 'Adelaide', 'Australia', 53583);
-- INSERT INTO `in` (matchid,stadium_name ,ticket_fare)
-- VALUES (1,'Adelaide Oval', 200);




