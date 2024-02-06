-- MySQL Script generated by MySQL Workbench
-- Wed Jan 31 21:25:43 2024
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema capstone_scheduling_project
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema capstone_scheduling_project
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `capstone_scheduling_project` ;
USE `capstone_scheduling_project` ;

-- -----------------------------------------------------
-- Table `capstone_scheduling_project`.`professor`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `capstone_scheduling_project`.`professor` ;

CREATE TABLE IF NOT EXISTS `capstone_scheduling_project`.`professor` (
  `id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `capstone_scheduling_project`.`time_block`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `capstone_scheduling_project`.`time_block` ;

CREATE TABLE IF NOT EXISTS `capstone_scheduling_project`.`time_block` (
  `id` INT NOT NULL,
  `identifier` VARCHAR(45) NOT NULL,
  `is_double` TINYINT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `capstone_scheduling_project`.`class`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `capstone_scheduling_project`.`class` ;

CREATE TABLE IF NOT EXISTS `capstone_scheduling_project`.`class` (
  `id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `identifier` VARCHAR(45) NOT NULL,
  `needs_lab` TINYINT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `capstone_scheduling_project`.`classroom`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `capstone_scheduling_project`.`classroom` ;

CREATE TABLE IF NOT EXISTS `capstone_scheduling_project`.`classroom` (
  `id` INT NOT NULL,
  `room` VARCHAR(45) NOT NULL,
  `is_lab` TINYINT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `capstone_scheduling_project`.`availabilty`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `capstone_scheduling_project`.`availabilty` ;

CREATE TABLE IF NOT EXISTS `capstone_scheduling_project`.`availabilty` (
  `professor_id` INT NOT NULL,
  `time_block_id` INT NOT NULL,
  PRIMARY KEY (`professor_id`, `time_block_id`),
  INDEX `fk_professor_has_time_block_time_block1_idx` (`time_block_id` ASC) VISIBLE,
  INDEX `fk_professor_has_time_block_professor_idx` (`professor_id` ASC) VISIBLE,
  CONSTRAINT `fk_professor_has_time_block_professor`
    FOREIGN KEY (`professor_id`)
    REFERENCES `capstone_scheduling_project`.`professor` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_professor_has_time_block_time_block1`
    FOREIGN KEY (`time_block_id`)
    REFERENCES `capstone_scheduling_project`.`time_block` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `capstone_scheduling_project`.`preference`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `capstone_scheduling_project`.`preference` ;

CREATE TABLE IF NOT EXISTS `capstone_scheduling_project`.`preference` (
  `professor_id` INT NOT NULL,
  `class_id` INT NOT NULL,
  `priority` INT NOT NULL,
  PRIMARY KEY (`professor_id`, `class_id`),
  INDEX `fk_professor_has_class_class1_idx` (`class_id` ASC) VISIBLE,
  INDEX `fk_professor_has_class_professor1_idx` (`professor_id` ASC) VISIBLE,
  CONSTRAINT `fk_professor_has_class_professor1`
    FOREIGN KEY (`professor_id`)
    REFERENCES `capstone_scheduling_project`.`professor` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_professor_has_class_class1`
    FOREIGN KEY (`class_id`)
    REFERENCES `capstone_scheduling_project`.`class` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `capstone_scheduling_project`.`assignment`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `capstone_scheduling_project`.`assignment` ;

CREATE TABLE IF NOT EXISTS `capstone_scheduling_project`.`assignment` (
  `professor_id` INT NOT NULL,
  `time_block_id` INT NOT NULL,
  `class_id` INT NOT NULL,
  `classroom_id` INT NOT NULL,
  PRIMARY KEY (`professor_id`, `time_block_id`),
  INDEX `fk_professor_has_time_block1_time_block1_idx` (`time_block_id` ASC) VISIBLE,
  INDEX `fk_professor_has_time_block1_professor1_idx` (`professor_id` ASC) VISIBLE,
  INDEX `fk_professor_has_time_block1_class1_idx` (`class_id` ASC) VISIBLE,
  INDEX `fk_professor_has_time_block1_classroom1_idx` (`classroom_id` ASC) VISIBLE,
  CONSTRAINT `fk_professor_has_time_block1_professor1`
    FOREIGN KEY (`professor_id`)
    REFERENCES `capstone_scheduling_project`.`professor` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_professor_has_time_block1_time_block1`
    FOREIGN KEY (`time_block_id`)
    REFERENCES `capstone_scheduling_project`.`time_block` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_professor_has_time_block1_class1`
    FOREIGN KEY (`class_id`)
    REFERENCES `capstone_scheduling_project`.`class` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_professor_has_time_block1_classroom1`
    FOREIGN KEY (`classroom_id`)
    REFERENCES `capstone_scheduling_project`.`classroom` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;