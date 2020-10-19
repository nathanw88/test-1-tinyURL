CREATE DATABASE IF NOT EXISTS tiny_url;
USE tiny_url;

CREATE TABLE photos ( 
  id INT(11) AUTO_INCREMENT,
  title VARCHAR(255),
  caption VARCHAR(255),
  imageUrl VARCHAR(255),
  PRIMARY KEY (id)
);