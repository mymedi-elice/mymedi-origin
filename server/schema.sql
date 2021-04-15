CREATE DATABASE  IF NOT EXISTS `mymedi` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_bin */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `mymedi`;
-- MySQL dump 10.13  Distrib 5.7.28, for Win64 (x86_64)
--
-- Host: localhost    Database: mymedi
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` mediumtext COLLATE utf8_bin,
  `rating` int DEFAULT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_info_id` int NOT NULL,
  `hospital_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_comment_user_info1_idx` (`user_info_id`),
  KEY `fk_comment_hospital1_idx` (`hospital_id`),
  CONSTRAINT `fk_comment_hospital1` FOREIGN KEY (`hospital_id`) REFERENCES `hospital` (`id`),
  CONSTRAINT `fk_comment_user_info1` FOREIGN KEY (`user_info_id`) REFERENCES `user_info` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `family_info`
--

DROP TABLE IF EXISTS `family_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `family_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `relationship_with_user` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `gender` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `user_info_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_family_info_user_info1_idx` (`user_info_id`),
  CONSTRAINT `fk_family_info_user_info1` FOREIGN KEY (`user_info_id`) REFERENCES `user_info` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `family_info`
--

LOCK TABLES `family_info` WRITE;
/*!40000 ALTER TABLE `family_info` DISABLE KEYS */;
INSERT INTO `family_info` VALUES (1,'a','2000-05-07','daughter','female',1),(2,'b','2012-05-08','daughter','female',1),(3,'c','1999-08-25','son','male',4),(8,'d','2012-03-26','son','male',14),(13,'qq','2000-05-06','son','male',17),(14,'pp','2000-05-07','daughter','female',17);
/*!40000 ALTER TABLE `family_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `get_vaccine`
--

DROP TABLE IF EXISTS `get_vaccine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `get_vaccine` (
  `id` int NOT NULL AUTO_INCREMENT,
  `get_vaccine` tinyint DEFAULT '1',
  `get_date` datetime DEFAULT NULL,
  `family_info_id` int DEFAULT NULL,
  `user_info_id` int DEFAULT NULL,
  `vaccine_id` int NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_comment_user_info1_idx` (`user_info_id` ASC) VISIBLE,
  INDEX `fk_comment_hospital1_idx` (`hospital_id` ASC) VISIBLE,
  CONSTRAINT `fk_comment_user_info1`
    FOREIGN KEY (`user_info_id`)
    REFERENCES `mymedi`.`user_info` (`id`)
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
DROP TABLE IF EXISTS `vaccine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vaccine` (
  `id` int NOT NULL AUTO_INCREMENT,
  `korean` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `vietnam` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `english` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `name` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `vaccine` WRITE;
/*!40000 ALTER TABLE `vaccine` DISABLE KEYS */;
INSERT INTO `vaccine` VALUES (1,'결핵','bệnh lao','tuberculosis','BCG'),(2,'B형간염','viêm gan B','Hepatitis B','HepB'),(3,'디프테리아/파상풍/백일해','bạch hầu / uốn ván /  ho gà.','Tetanus/ Diphtheria/ Pertussis','DTaP/Tdap/Td'),(4,'폴리오','Bại Liệt','Polio','IPV'),(5,'b형 헤모필루스인플루엔자','Haemophilus Influenzae Tuýp b\n','Haemophilus influenzae type B','Hib'),(6,'폐렴구균','phế cầu Viêm phổi','pneumococcus','PCV/ PPSV'),(7,'홍역/유행성이하선염/풍진','bệnh sởi/ quai bị/bệnh ban đào','Measles/ Mumps / Rubella','MMR'),(8,'수두',' thủy đậu ','varicella','VAR'),(9,'A형 간염','viêm gan A','Hepatitis A','HepA'),(10,'일본뇌염','Viêm não Nhật Bản','Japanese encephalitis','IJEV/ LJEV'),(11,'사람유두종바이러스 감염증','Virus gây u nhú ở người','Human papilloma virus infection','HPV'),(12,'인플루엔자','Bệnh Cúm','influenza','IIV'),(13,'로타바이러스 감염증','lây truyền rota virus','rota virus infection','RV1/ RV5');
/*!40000 ALTER TABLE `vaccine` ENABLE KEYS */;
UNLOCK TABLES;


-- -----------------------------------------------------
-- Table `mymedi`.`get_vaccine`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mymedi`.`get_vaccine` ;

CREATE TABLE IF NOT EXISTS `mymedi`.`get_vaccine` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `get_vaccine` TINYINT NULL DEFAULT 1,
  `get_date` DATETIME NULL,
  `family_info_id` INT NULL,
  `user_info_id` INT NULL,
  `vaccine_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sub_UNIQUE` (`sub`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_info`
--

LOCK TABLES `user_info` WRITE;
/*!40000 ALTER TABLE `user_info` DISABLE KEYS */;
INSERT INTO `user_info` VALUES (1,'1','kim','2021-04-09 06:47:15','1985-05-06','female'),(3,'3','abc','2021-04-09 06:47:15','2009-08-25','male'),(4,'4','sha','2021-04-09 07:32:05','1998-09-12','male'),(14,'2','park','2021-04-10 07:38:46','1988-04-25','female'),(17,'5','elice','2021-04-12 18:05:34','1987-02-10','female'),(18,'6','hihi','2021-04-13 07:49:27','1987-02-10','female');
/*!40000 ALTER TABLE `user_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vaccine`
--

DROP TABLE IF EXISTS `vaccine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vaccine` (
  `id` int NOT NULL AUTO_INCREMENT,
  `korean` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `vietnam` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `english` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `name` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vaccine`
--

LOCK TABLES `vaccine` WRITE;
/*!40000 ALTER TABLE `vaccine` DISABLE KEYS */;
INSERT INTO `vaccine` VALUES (1,'결핵','bệnh lao','tuberculosis','BCG'),(2,'B형간염','viêm gan B','Hepatitis B','HepB'),(3,'디프테리아/파상풍/백일해','bạch hầu / uốn ván /  ho gà.','Tetanus/ Diphtheria/ Pertussis','DTaP/Tdap/Td'),(4,'폴리오','Bại Liệt','Polio','IPV'),(5,'b형 헤모필루스인플루엔자','Haemophilus Influenzae Tuýp b\n','Haemophilus influenzae type B','Hib'),(6,'폐렴구균','phế cầu Viêm phổi','pneumococcus','PCV/ PPSV'),(7,'홍역/유행성이하선염/풍진','bệnh sởi/ quai bị/bệnh ban đào','Measles/ Mumps / Rubella','MMR'),(8,'수두',' thủy đậu ','varicella','VAR'),(9,'A형 간염','viêm gan A','Hepatitis A','HepA'),(10,'일본뇌염','Viêm não Nhật Bản','Japanese encephalitis','IJEV/ LJEV'),(11,'사람유두종바이러스 감염증','Virus gây u nhú ở người','Human papilloma virus infection','HPV'),(12,'인플루엔자','Bệnh Cúm','influenza','IIV'),(13,'로타바이러스 감염증','lây truyền rota virus','rota virus infection','RV1/ RV5');
/*!40000 ALTER TABLE `vaccine` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vaccine_list`
--

DROP TABLE IF EXISTS `vaccine_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vaccine_list` (
  `id` int NOT NULL,
  `hospital_id` int NOT NULL,
  `vaccine_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_vaccine_list_hospital1_idx` (`hospital_id`),
  CONSTRAINT `fk_vaccine_list_hospital1` FOREIGN KEY (`hospital_id`) REFERENCES `hospital` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vaccine_list`
--

LOCK TABLES `vaccine_list` WRITE;
/*!40000 ALTER TABLE `vaccine_list` DISABLE KEYS */;
/*!40000 ALTER TABLE `vaccine_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'mymedi'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-13 20:27:59
