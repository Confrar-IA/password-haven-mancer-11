
-- Password Vault Database Schema
-- Database: password_vault (Default name, configurable in settings)

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  fullName VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  password VARCHAR(255),
  active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Permission Groups Table
CREATE TABLE IF NOT EXISTS permission_groups (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

-- User Group Relationship (Many-to-Many)
CREATE TABLE IF NOT EXISTS user_groups (
  user_id VARCHAR(50) NOT NULL,
  group_id VARCHAR(50) NOT NULL,
  PRIMARY KEY (user_id, group_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (group_id) REFERENCES permission_groups(id) ON DELETE CASCADE
);

-- Password Categories Table
CREATE TABLE IF NOT EXISTS password_categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

-- Passwords Table
CREATE TABLE IF NOT EXISTS passwords (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255),
  url TEXT,
  category_id VARCHAR(50),
  group_id VARCHAR(50) NOT NULL,
  FOREIGN KEY (category_id) REFERENCES password_categories(id) ON DELETE SET NULL,
  FOREIGN KEY (group_id) REFERENCES permission_groups(id) ON DELETE CASCADE
);

-- Activity Logs Table
CREATE TABLE IF NOT EXISTS logs (
  id VARCHAR(50) PRIMARY KEY,
  timestamp BIGINT NOT NULL,
  action ENUM('login', 'logout', 'create', 'update', 'delete') NOT NULL,
  entity_type ENUM('password', 'user', 'category', 'group') NOT NULL,
  entity_id VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  user_id VARCHAR(50) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_passwords_group ON passwords(group_id);
CREATE INDEX idx_passwords_category ON passwords(category_id);
CREATE INDEX idx_logs_timestamp ON logs(timestamp);
CREATE INDEX idx_logs_action ON logs(action);
CREATE INDEX idx_logs_entity_type ON logs(entity_type);
