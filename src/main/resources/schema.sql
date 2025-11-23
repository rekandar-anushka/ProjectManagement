CREATE DATABASE project_management;
use project_management;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('EMPLOYEE', 'MANAGER') NOT NULL
);
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to INT,
    status ENUM('PENDING', 'ONGOING', 'COMPLETED') DEFAULT 'PENDING',
    priority ENUM('LOW','MEDIUM','HIGH') DEFAULT 'MEDIUM',
    deadline DATETIME,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);