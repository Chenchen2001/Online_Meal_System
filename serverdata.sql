CREATE DATABASE  IF NOT EXISTS `sky_take_out` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sky_take_out`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: sky_take_out
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `type` int DEFAULT NULL COMMENT '类型   1 菜品分类 2 套餐分类',
  `name` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '分类名称',
  `sort` int NOT NULL DEFAULT '0' COMMENT '顺序',
  `status` int DEFAULT NULL COMMENT '分类状态 0:禁用，1:启用',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `create_user` bigint DEFAULT NULL COMMENT '创建人',
  `update_user` bigint DEFAULT NULL COMMENT '修改人',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_category_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin COMMENT='菜品及套餐分类';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (11,1,'酒水饮料',10,1,'2022-06-09 22:09:18','2022-06-09 22:09:18',1,1),(12,1,'传统主食',9,1,'2022-06-09 22:09:32','2022-06-09 22:18:53',1,1),(13,2,'人气套餐',1,0,'2022-06-09 22:11:38','2022-06-10 11:04:40',1,1),(15,2,'商务套餐',2,0,'2022-06-09 22:14:10','2022-06-10 11:04:48',1,1),(16,1,'蜀味烤鱼',4,1,'2022-06-09 22:15:37','2022-08-31 14:27:25',1,1),(17,1,'蜀味牛蛙',5,1,'2022-06-09 22:16:14','2022-08-31 14:39:44',1,1),(18,1,'特色蒸菜',3,1,'2022-06-09 22:17:42','2022-06-09 22:17:42',1,1),(19,1,'新鲜时蔬',7,1,'2022-06-09 22:18:12','2022-06-09 22:18:28',1,1),(20,1,'水煮鱼',6,1,'2022-06-09 22:22:29','2022-06-09 22:23:45',1,1),(21,1,'汤类',11,1,'2022-06-10 10:51:47','2022-06-10 10:51:47',1,1),(23,NULL,'异域风味',8,1,NULL,NULL,NULL,NULL),(24,NULL,'特价促销',0,0,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dish`
--

DROP TABLE IF EXISTS `dish`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dish` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin NOT NULL COMMENT '菜品名称',
  `category_id` bigint NOT NULL COMMENT '菜品分类id',
  `price` decimal(10,2) DEFAULT NULL COMMENT '菜品价格',
  `image` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL COMMENT '图片',
  `description` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL COMMENT '描述信息',
  `status` int DEFAULT '1' COMMENT '0 停售 1 起售',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `create_user` bigint DEFAULT NULL COMMENT '创建人',
  `update_user` bigint DEFAULT NULL COMMENT '修改人',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_dish_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin COMMENT='菜品';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dish`
--

LOCK TABLES `dish` WRITE;
/*!40000 ALTER TABLE `dish` DISABLE KEYS */;
INSERT INTO `dish` VALUES (46,'王老吉',11,8.00,'https://p1.ssl.qhimg.com/t015a1c45d5665f5639.png','经典凉茶饮料',1,'2022-06-09 22:40:47','2022-06-09 22:40:47',1,1),(47,'北冰洋',11,6.00,'https://th.bing.com/th/id/OIP.LUAorJeYUNyfCZ0BxZyibQD6D6?cb=iwp2&rs=1&pid=ImgDetMain','还是小时候的味道',1,'2022-06-10 09:18:49','2022-06-10 09:18:49',1,1),(51,'老坛酸菜鱼',20,56.00,'https://th.bing.com/th/id/OIP.8vqgdlQilx9BZVsZ3NATSAHaFj?cb=iwp2&rs=1&pid=ImgDetMain','原料：汤，草鱼，酸菜',1,'2022-06-10 09:40:51','2022-06-10 09:40:51',1,1),(52,'经典酸菜鮰鱼',20,66.00,'https://th.bing.com/th/id/OIP.4yJjxzBRo4AcIZf7Lul-dAHaE8?o=7&cb=iwp2rm=3&rs=1&pid=ImgDetMain','原料：酸菜，江团，鮰鱼',1,'2022-06-10 09:46:02','2022-06-10 09:46:02',1,1),(53,'蜀味水煮草鱼',20,38.00,'https://pica.zhimg.com/v2-7462e01d4486e75a784eb00be9329676_1440w.jpg?source=172ae18b','原料：草鱼，汤',1,'2022-06-10 09:48:37','2022-06-10 09:48:37',1,1),(54,'清炒小油菜',19,18.00,'https://th.bing.com/th/id/OIP.YH2eX-cPga14FhdZkvP8wwHaE8?w=292&h=195&c=7&r=0&o=7&cb=iwp2&dpr=1.5&pid=1.7&rm=3','原料：小油菜',1,'2022-06-10 09:51:46','2022-06-10 09:51:46',1,1),(55,'蒜蓉娃娃菜',19,18.00,'https://th.bing.com/th/id/OIP.47UCFusk8r6GUkJkAghWmgHaE7?w=257&h=180&c=7&r=0&o=7&cb=iwp2&dpr=1.5&pid=1.7&rm=3','原料：蒜，娃娃菜',1,'2022-06-10 09:53:37','2022-06-10 09:53:37',1,1),(56,'清炒西兰花',19,18.00,'','原料：西兰花',1,'2022-06-10 09:55:44','2022-06-10 09:55:44',1,1),(57,'炝炒圆白菜',19,18.00,'','原料：圆白菜',1,'2022-06-10 09:58:35','2022-06-10 09:58:35',1,1),(59,'东坡肘子',18,138.00,'https://th.bing.com/th/id/OIP.2qCKie-gQvP2P2U5UqnMCAHaE7?w=249&h=180&c=7&r=0&o=7&cb=iwp2&dpr=1.5&pid=1.7&rm=3','原料：猪肘棒',1,'2022-06-10 10:24:03','2022-06-10 10:24:03',1,1),(60,'梅菜扣肉',18,58.00,'','原料：猪肉，梅菜',1,'2022-06-10 10:26:03','2022-06-10 10:26:03',1,1),(61,'剁椒鱼头',18,66.00,'https://th.bing.com/th/id/OIP.rDbgKHnklVS2oAf8h_qJWQHaFW?w=278&h=200&c=7&r=0&o=7&cb=iwp2&dpr=1.5&pid=1.7&rm=3','原料：鲢鱼，剁椒',1,'2022-06-10 10:28:54','2022-06-10 10:28:54',1,1),(62,'金汤酸菜牛蛙',17,88.00,'','原料：鲜活牛蛙，酸菜',1,'2022-06-10 10:33:05','2022-06-10 10:33:05',1,1),(63,'香锅牛蛙',17,88.00,'','配料：鲜活牛蛙，莲藕，青笋',1,'2022-06-10 10:35:40','2022-06-10 10:35:40',1,1),(64,'馋嘴牛蛙',17,88.00,'','配料：鲜活牛蛙，丝瓜，黄豆芽',1,'2022-06-10 10:37:52','2022-06-10 10:37:52',1,1),(65,'草鱼2斤',16,68.00,'','原料：草鱼，黄豆芽，莲藕',1,'2022-06-10 10:41:08','2022-06-10 10:41:08',1,1),(66,'江团鱼2斤',16,119.00,'','配料：江团鱼，黄豆芽，莲藕',1,'2022-06-10 10:42:42','2022-06-10 10:42:42',1,1),(67,'鮰鱼2斤',16,72.00,'','原料：鮰鱼，黄豆芽，莲藕',1,'2022-06-10 10:43:56','2022-06-10 10:43:56',1,1),(68,'鸡蛋汤',21,4.00,'','配料：鸡蛋，紫菜',1,'2022-06-10 10:54:25','2022-06-10 10:54:25',1,1),(69,'平菇豆腐汤',21,6.00,'','配料：豆腐，平菇',1,'2022-06-10 10:55:02','2022-06-10 10:55:02',1,1),(70,'广式肠粉',12,8.00,'https://th.bing.com/th/id/OIP.ktMw3biy5nAFhlWp-A6hjwHaE8?w=290&h=193&c=7&r=0&o=7&cb=iwp2&dpr=1.5&pid=1.7&rm=3','原料：米浆，鸡蛋，生菜，豉油',0,NULL,NULL,NULL,NULL),(71,'排骨玉米汤',21,48.00,'https://th.bing.com/th/id/OIP.qmSi33D2_bg1-C5Ax82fhgHaFj?w=215&h=180&c=7&r=0&o=7&cb=iwp2&dpr=1.5&pid=1.7&rm=3','广东传统靓汤',1,NULL,NULL,NULL,NULL),(72,'番茄蛋汤',21,28.00,'https://th.bing.com/th/id/OIP.GYdpe0WW4yoaO7jMq0qB0QHaFj?w=225&h=180&c=7&r=0&o=7&cb=iwp2&dpr=1.5&pid=1.7&rm=3','传统家常汤',0,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `dish` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dish_flavor`
--

DROP TABLE IF EXISTS `dish_flavor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dish_flavor` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `dish_id` bigint NOT NULL COMMENT '菜品',
  `name` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL COMMENT '口味名称',
  `value` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL COMMENT '口味数据list',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin COMMENT='菜品口味关系表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dish_flavor`
--

LOCK TABLES `dish_flavor` WRITE;
/*!40000 ALTER TABLE `dish_flavor` DISABLE KEYS */;
INSERT INTO `dish_flavor` VALUES (40,10,'甜味','[\"无糖\",\"少糖\",\"半糖\",\"多糖\",\"全糖\"]'),(41,7,'忌口','[\"不要葱\",\"不要蒜\",\"不要香菜\",\"不要辣\"]'),(42,7,'温度','[\"热饮\",\"常温\",\"去冰\",\"少冰\",\"多冰\"]'),(45,6,'忌口','[\"不要葱\",\"不要蒜\",\"不要香菜\",\"不要辣\"]'),(46,6,'辣度','[\"不辣\",\"微辣\",\"中辣\",\"重辣\"]'),(47,5,'辣度','[\"不辣\",\"微辣\",\"中辣\",\"重辣\"]'),(48,5,'甜味','[\"无糖\",\"少糖\",\"半糖\",\"多糖\",\"全糖\"]'),(49,2,'甜味','[\"无糖\",\"少糖\",\"半糖\",\"多糖\",\"全糖\"]'),(50,4,'甜味','[\"无糖\",\"少糖\",\"半糖\",\"多糖\",\"全糖\"]'),(51,3,'甜味','[\"无糖\",\"少糖\",\"半糖\",\"多糖\",\"全糖\"]'),(52,3,'忌口','[\"不要葱\",\"不要蒜\",\"不要香菜\",\"不要辣\"]'),(86,52,'忌口','[\"不要葱\",\"不要蒜\",\"不要香菜\",\"不要辣\"]'),(87,52,'辣度','[\"不辣\",\"微辣\",\"中辣\",\"重辣\"]'),(88,51,'忌口','[\"不要葱\",\"不要蒜\",\"不要香菜\",\"不要辣\"]'),(89,51,'辣度','[\"不辣\",\"微辣\",\"中辣\",\"重辣\"]'),(92,53,'忌口','[\"不要葱\",\"不要蒜\",\"不要香菜\",\"不要辣\"]'),(93,53,'辣度','[\"不辣\",\"微辣\",\"中辣\",\"重辣\"]'),(94,54,'忌口','[\"不要葱\",\"不要蒜\",\"不要香菜\"]'),(95,56,'忌口','[\"不要葱\",\"不要蒜\",\"不要香菜\",\"不要辣\"]'),(96,57,'忌口','[\"不要葱\",\"不要蒜\",\"不要香菜\",\"不要辣\"]'),(97,60,'忌口','[\"不要葱\",\"不要蒜\",\"不要香菜\",\"不要辣\"]'),(101,66,'辣度','[\"不辣\",\"微辣\",\"中辣\",\"重辣\"]'),(102,67,'辣度','[\"不辣\",\"微辣\",\"中辣\",\"重辣\"]'),(103,65,'辣度','[\"不辣\",\"微辣\",\"中辣\",\"重辣\"]');
/*!40000 ALTER TABLE `dish_flavor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `dish_id` bigint NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `dish_id` (`dish_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`dish_id`) REFERENCES `dish` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,59,1,138.00),(2,2,55,1,18.00),(3,2,63,1,88.00),(4,2,65,2,68.00),(5,3,47,1,6.00),(6,3,54,1,18.00),(7,3,61,1,66.00),(8,4,46,1,8.00),(9,4,51,2,56.00),(10,5,47,1,6.00),(11,5,56,1,18.00),(12,5,62,1,88.00),(13,6,51,1,56.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,10,138.00,'completed','2025-05-16 20:20:45'),(2,10,242.00,'cancelled','2025-05-16 20:34:35'),(3,14,90.00,'completed','2025-05-16 20:44:36'),(4,14,120.00,'completed','2025-05-16 20:54:55'),(5,5,112.00,'completed','2025-05-16 21:06:10'),(6,4,56.00,'cancelled','2025-05-16 23:20:25');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key_name` varchar(100) NOT NULL,
  `value` text,
  `description` varchar(255) DEFAULT NULL,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_name` (`key_name`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES (17,'shop_name','家常小炒',NULL,'2025-05-16 23:20:16'),(18,'default_category','1',NULL,'2025-05-16 23:20:16'),(19,'auto_accept_order','true',NULL,'2025-05-16 23:20:16'),(20,'customer_service_phone','13988886669',NULL,'2025-05-16 23:20:16');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键',
  `openid` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL COMMENT '微信用户唯一标识',
  `name` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL COMMENT '姓名',
  `phone` varchar(11) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL COMMENT '手机号',
  `password` varchar(100) COLLATE utf8mb3_bin NOT NULL DEFAULT 'p@ssw0rd',
  `sex` varchar(2) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL COMMENT '性别',
  `id_number` varchar(18) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL COMMENT '身份证号',
  `avatar` varchar(500) CHARACTER SET utf8mb3 COLLATE utf8mb3_bin DEFAULT NULL COMMENT '头像',
  `create_time` datetime DEFAULT NULL,
  `auth_flag` enum('admin','customer','user') COLLATE utf8mb3_bin DEFAULT 'user',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_bin COMMENT='用户信息';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (4,'alicezhang','Alice Zhang','13800000066','$2b$10$OC3unzakTNt/UprNtG5jOOIeEHgbShYLX8Dv0nqfpcFnR8oGD5mYy','F','110101199003074321','https://th.bing.com/th/id/OIP.gDeNqCrB4G0AF25RkSJBxgHaG8?w=215&h=202&c=7&r=0&o=7&cb=iwp2&dpr=1.5&pid=1.7&rm=3','2025-05-01 10:30:00','admin'),(5,'bobli','Bob Lee','13800006688','$2b$10$OC3unzakTNt/UprNtG5jOOIeEHgbShYLX8Dv0nqfpcFnR8oGD5mYy','M','110121198809124567','https://th.bing.com/th/id/OIP.15vIA3dT_jOeDG7iDKOhngHaHa?w=203&h=200&c=7&r=0&o=7&cb=iwp2&dpr=1.5&pid=1.7&rm=3','2025-05-03 14:15:00','customer'),(7,'dianaliu','Diana Liu','13800000004','$2b$10$OC3unzakTNt/UprNtG5jOOIeEHgbShYLX8Dv0nqfpcFnR8oGD5mYy','F','110101199611235678','https://th.bing.com/th/id/OIP.BOnYAszpWkuwvmGogayWYgHaHa?w=198&h=198&c=7&r=0&o=7&cb=iwp2&dpr=1.5&pid=1.7&rm=3','2025-05-06 08:50:00','customer'),(8,'ericchenemployee','Eric Chen','13800000005','$2b$10$OC3unzakTNt/UprNtG5jOOIeEHgbShYLX8Dv0nqfpcFnR8oGD5mYy','M','110101199712085432','https://th.bing.com/th/id/OIP.qLQnu1KjARt_4qJml9t9AAHaHb?w=197&h=198&c=7&r=0&o=7&cb=iwp2&dpr=1.5&pid=1.7&rm=3','2025-05-07 17:45:00','user'),(9,'peterwong','Peter Wong','1388888888','$2b$10$OC3unzakTNt/UprNtG5jOOIeEHgbShYLX8Dv0nqfpcFnR8oGD5mYy','M','310101200111100234','https://th.bing.com/th/id/OIP.xXchck59eSpnlbCp-zfQ0wHaEK?w=257&h=180&c=7&r=0&o=7&cb=iwp2&dpr=1.5&pid=1.7&rm=3','2025-05-15 16:53:51','user'),(10,'admin','admin','19988886699','$2b$10$k38/P3LCPVzIUxMANBUK2.2OROkDm9EDCqX/rO8fYYAgdpt5XSBhy','M','888999200608068876','https://th.bing.com/th/id/OIP.Krgo7RVO65tKZALoXkBdRAHaHa?w=176&h=180&c=7&r=0&o=7&cb=iwp2&dpr=1.5&pid=1.7&rm=3','2025-05-15 18:33:04','admin'),(13,'user','MyUser',NULL,'$2b$10$N25ClS8m5dYJ8atVpVV6PuxD5y0xwZOjFYa17XMGdKdF7Dl0/7Vii','-',NULL,'https://th.bing.com/th/id/OSK.c22c0b590ed27d65fdc52974d9c80867?w=80&h=80&c=12&o=6&dpr=1.5&pid=SANGAM','2025-05-16 13:07:55','user'),(14,'customer','customer','12312221333','$2b$10$79OEa9NTCN.xsn6cxM3W8exJogZLE6a/5fF6a21tM2bGa4dvvJYcm','-','810000200001012568','https://th.bing.com/th/id/OIP.MMsYZP7G5DqKd6Pa0IyU2QHaFD?w=254&h=180&c=7&r=0&o=7&cb=iwp2&dpr=1.5&pid=1.7&rm=3','2025-05-16 13:12:55','customer');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'sky_take_out'
--

--
-- Dumping routines for database 'sky_take_out'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-17 12:07:03
