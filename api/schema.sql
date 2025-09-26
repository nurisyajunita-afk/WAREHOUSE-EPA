-- api/schema.sql - Database schema for NURISYA

CREATE DATABASE IF NOT EXISTS `nurisya` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `nurisya`;

-- Items table
CREATE TABLE IF NOT EXISTS `items` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `classification` VARCHAR(100) NOT NULL,
  `movement` VARCHAR(50) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `min_stock` INT NOT NULL DEFAULT 0,
  `status` VARCHAR(50) NOT NULL,
  `description` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_items_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Requests table
CREATE TABLE IF NOT EXISTS `requests` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `request_number` VARCHAR(50) NOT NULL,
  `date` DATE NOT NULL,
  `requester` VARCHAR(255) NOT NULL,
  `division` VARCHAR(100) NOT NULL,
  `item` VARCHAR(255) NOT NULL,
  `quantity` INT NOT NULL,
  `reason` TEXT,
  `status` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_requests_number` (`request_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
