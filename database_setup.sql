CREATE DATABASE IF NOT EXISTS node_mysql_login;
USE node_mysql_login;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL
);
