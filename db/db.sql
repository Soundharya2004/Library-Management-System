create database Library;
use Library;

CREATE TABLE User_details (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    RegisterNumber VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL -- Assuming a VARCHAR(255) field for password storage
);
CREATE TABLE studentdetails (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    RegisterNumber VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL -- Assuming a VARCHAR(255) field for password storage
);
CREATE TABLE UserProfile ( 
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    RegisterNumber VARCHAR(20) UNIQUE NOT NULL,
    Name VARCHAR(255) NOT NULL,
    Dept VARCHAR(50) NOT NULL,
    Year VARCHAR(50) NOT NULL,
    Section VARCHAR(10) NOT NULL,
    Email VARCHAR(255) NOT NULL
);
INSERT INTO User_details (Name, RegisterNumber, Password) VALUES
('Admin', '1001', '1234');
INSERT INTO studentdetails (Name, RegisterNumber, Password) VALUES
('John Doe', '1001', '1234'),
('Jane Smith', '1002', '1234'),
('Alice Johnson', '1003', '1234'),
('Bob Brown', '1004', '1234'),
('Emily Davis', '1005', '1234'),
('Michael Wilson', '1006', '1234'),
('Sophia Miller', '1007', '1234'),
('William Garcia', '1008', '1234'),
('Olivia Rodriguez', '1009', '1234'),
('James Martinez', '1010', '1234');

CREATE TABLE BorrowList (
    BorrowID INT AUTO_INCREMENT PRIMARY KEY,
    RegisterNumber VARCHAR(255) NOT NULL,
    FromDate DATE NOT NULL,
    ToDate DATE NOT NULL,
    BookName VARCHAR(255) NOT NULL,
	extend int(10) default 0 
);
select * from USer_details;
-- Create the Books table
CREATE TABLE Books (
    BookID VARCHAR(10) PRIMARY KEY,
    BookName VARCHAR(255) NOT NULL,
    BookAuthor VARCHAR(255) NOT NULL,
    PublishedDate DATE NOT NULL,
    BookDescription TEXT NOT NULL,
    Department VARCHAR(50) NOT NULL,
    ShelfNumber VARCHAR(20) NOT NULL,
    Count INT NOT NULL
);

-- Create a trigger to auto-generate BookID with 'B' as prefix and a sequential number
DELIMITER //
CREATE TRIGGER auto_increment_bookid
BEFORE INSERT ON Books
FOR EACH ROW
BEGIN
    DECLARE new_id INT;
    SET new_id = (SELECT COALESCE(MAX(CAST(SUBSTRING(BookID, 2) AS UNSIGNED)) + 1, 1) FROM Books);
    SET NEW.BookID = CONCAT('B', new_id);
END;
//
DELIMITER ;

-- Insert sample data
INSERT INTO Books (BookName, BookAuthor, PublishedDate, BookDescription, Department, ShelfNumber, Count)
VALUES
    ('Book 1', 'Author 1', '2023-01-01', 'Description of Book 1', 'Department 1', 'Shelf A', 10),
    ('Book 2', 'Author 2', '2022-12-15', 'Description of Book 2', 'Department 2', 'Shelf B', 5),
    ('Book 3', 'Author 3', '2022-11-30', 'Description of Book 3', 'Department 3', 'Shelf C', 8),
    ('Book 4', 'Author 4', '2022-10-25', 'Description of Book 4', 'Department 1', 'Shelf A', 12),
    ('Book 5', 'Author 5', '2022-09-20', 'Description of Book 5', 'Department 2', 'Shelf B', 7);

CREATE TABLE sessionData (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registerNumber VARCHAR(50) NOT NULL
);
select * from sessionData;
