-- MySQL Script generated by MySQL Workbench
-- Thu Apr  8 16:09:47 2021
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mymedi
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mymedi
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mymedi` DEFAULT CHARACTER SET utf8 ;
USE `mymedi` ;

-- -----------------------------------------------------
-- Table `mymedi`.`user_info`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mymedi`.`user_info` ;

CREATE TABLE IF NOT EXISTS `mymedi`.`user_info` (
  `sub` VARCHAR(128) NOT NULL,
  `username` VARCHAR(16) NULL,
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `birthday` DATE NULL,
  `gender` VARCHAR(45) NULL,
  PRIMARY KEY (`sub`));


-- -----------------------------------------------------
-- Table `mymedi`.`family_info`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mymedi`.`family_info` ;

CREATE TABLE IF NOT EXISTS `mymedi`.`family_info` (
  `id` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  `user_sub` VARCHAR(128) NOT NULL,
  `birthday` DATE NULL,
  `relationship_with_user` VARCHAR(45) NULL,
  `gender` VARCHAR(45) NULL,
  PRIMARY KEY (`id`, `user_sub`),
  INDEX `fk_family_info_user1_idx` (`user_sub` ASC) VISIBLE,
  CONSTRAINT `fk_family_info_user1`
    FOREIGN KEY (`user_sub`)
    REFERENCES `mymedi`.`user_info` (`sub`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mymedi`.`hospital`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mymedi`.`hospital` ;

CREATE TABLE IF NOT EXISTS `mymedi`.`hospital` (
  `id` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  `address` VARCHAR(45) NULL,
  `phone` VARCHAR(45) NULL,
  `rating_mean` VARCHAR(45) NULL,
  `vaccine_list` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mymedi`.`comment`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mymedi`.`comment` ;

CREATE TABLE IF NOT EXISTS `mymedi`.`comment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `content` MEDIUMTEXT NULL,
  `rating` INT NULL,
  `creating_date` DATETIME NULL,
  `user_sub` VARCHAR(128) NOT NULL,
  `hospital_id` INT NOT NULL,
  PRIMARY KEY (`id`, `user_sub`, `hospital_id`),
  INDEX `fk_comment_user1_idx` (`user_sub` ASC) VISIBLE,
  INDEX `fk_comment_hospital1_idx` (`hospital_id` ASC) VISIBLE,
  CONSTRAINT `fk_comment_user1`
    FOREIGN KEY (`user_sub`)
    REFERENCES `mymedi`.`user_info` (`sub`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_comment_hospital1`
    FOREIGN KEY (`hospital_id`)
    REFERENCES `mymedi`.`hospital` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mymedi`.`vaccine`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mymedi`.`vaccine` ;

CREATE TABLE IF NOT EXISTS `mymedi`.`vaccine` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mymedi`.`get_vaccine`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mymedi`.`get_vaccine` ;

CREATE TABLE IF NOT EXISTS `mymedi`.`get_vaccine` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `get_vaccine` TINYINT NULL,
  `user_sub1` VARCHAR(128) NOT NULL,
  `family_info_id` INT NOT NULL,
  `vaccine_id` INT NOT NULL,
  PRIMARY KEY (`id`, `user_sub1`, `family_info_id`, `vaccine_id`),
  INDEX `fk_vaccine_user1_idx` (`user_sub1` ASC) VISIBLE,
  INDEX `fk_vaccine_family_info1_idx` (`family_info_id` ASC) VISIBLE,
  INDEX `fk_get_vaccine_vaccine1_idx` (`vaccine_id` ASC) VISIBLE,
  CONSTRAINT `fk_vaccine_user10`
    FOREIGN KEY (`user_sub1`)
    REFERENCES `mymedi`.`user_info` (`sub`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_vaccine_family_info10`
    FOREIGN KEY (`family_info_id`)
    REFERENCES `mymedi`.`family_info` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_get_vaccine_vaccine1`
    FOREIGN KEY (`vaccine_id`)
    REFERENCES `mymedi`.`vaccine` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mymedi`.`vaccine_list`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mymedi`.`vaccine_list` ;

CREATE TABLE IF NOT EXISTS `mymedi`.`vaccine_list` (
  `id` INT NOT NULL,
  `hospital_id` INT NOT NULL,
  `vaccine_id` INT NOT NULL,
  PRIMARY KEY (`id`, `hospital_id`, `vaccine_id`),
  INDEX `fk_vaccine_list_hospital1_idx` (`hospital_id` ASC) VISIBLE,
  INDEX `fk_vaccine_list_vaccine1_idx` (`vaccine_id` ASC) VISIBLE,
  CONSTRAINT `fk_vaccine_list_hospital1`
    FOREIGN KEY (`hospital_id`)
    REFERENCES `mymedi`.`hospital` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_vaccine_list_vaccine1`
    FOREIGN KEY (`vaccine_id`)
    REFERENCES `mymedi`.`vaccine` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
