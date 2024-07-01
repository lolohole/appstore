CREATE USER 'new_user'@'%' IDENTIFIED BY 'YourPassword';

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, ALTER, INDEX ON user_db.* TO 'new_user'@'%';

FLUSH PRIVILEGES;

USE user_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
