-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 06, 2025 at 03:54 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Letran`
--

-- --------------------------------------------------------

--
-- Table structure for table `college_grades`
--

CREATE TABLE `college_grades` (
  `subjectid` int(11) NOT NULL,
  `idnumber` int(11) NOT NULL,
  `ORT1_criteria1_score` int(11) DEFAULT NULL,
  `ORT1_criteria2_score` int(11) DEFAULT NULL,
  `ORT1_criteria3_score` int(11) DEFAULT NULL,
  `ORT1_criteria4_score` int(11) DEFAULT NULL,
  `ORT1_criteria5_score` int(11) DEFAULT NULL,
  `ORT1_total` int(11) GENERATED ALWAYS AS (coalesce(`ORT1_criteria1_score`,0) + coalesce(`ORT1_criteria2_score`,0) + coalesce(`ORT1_criteria3_score`,0) + coalesce(`ORT1_criteria4_score`,0) + coalesce(`ORT1_criteria5_score`,0)) VIRTUAL,
  `ORT2_criteria1_score` int(11) DEFAULT NULL,
  `ORT2_criteria2_score` int(11) DEFAULT NULL,
  `ORT2_criteria3_score` int(11) DEFAULT NULL,
  `ORT2_criteria4_score` int(11) DEFAULT NULL,
  `ORT2_criteria5_score` int(11) DEFAULT NULL,
  `ORT2_total` int(11) GENERATED ALWAYS AS (coalesce(`ORT2_criteria1_score`,0) + coalesce(`ORT2_criteria2_score`,0) + coalesce(`ORT2_criteria3_score`,0) + coalesce(`ORT2_criteria4_score`,0) + coalesce(`ORT2_criteria5_score`,0)) VIRTUAL,
  `ORT3_criteria1_score` int(11) DEFAULT NULL,
  `ORT3_criteria2_score` int(11) DEFAULT NULL,
  `ORT3_criteria3_score` int(11) DEFAULT NULL,
  `ORT3_criteria4_score` int(11) DEFAULT NULL,
  `ORT3_criteria5_score` int(11) DEFAULT NULL,
  `ORT3_total` int(11) GENERATED ALWAYS AS (coalesce(`ORT3_criteria1_score`,0) + coalesce(`ORT3_criteria2_score`,0) + coalesce(`ORT3_criteria3_score`,0) + coalesce(`ORT3_criteria4_score`,0) + coalesce(`ORT3_criteria5_score`,0)) VIRTUAL,
  `ORT4_criteria1_score` int(11) DEFAULT NULL,
  `ORT4_criteria2_score` int(11) DEFAULT NULL,
  `ORT4_criteria3_score` int(11) DEFAULT NULL,
  `ORT4_criteria4_score` int(11) DEFAULT NULL,
  `ORT4_criteria5_score` int(11) DEFAULT NULL,
  `ORT4_total` int(11) GENERATED ALWAYS AS (coalesce(`ORT4_criteria1_score`,0) + coalesce(`ORT4_criteria2_score`,0) + coalesce(`ORT4_criteria3_score`,0) + coalesce(`ORT4_criteria4_score`,0) + coalesce(`ORT4_criteria5_score`,0)) VIRTUAL,
  `ORT5_criteria1_score` int(11) DEFAULT NULL,
  `ORT5_criteria2_score` int(11) DEFAULT NULL,
  `ORT5_criteria3_score` int(11) DEFAULT NULL,
  `ORT5_criteria4_score` int(11) DEFAULT NULL,
  `ORT5_criteria5_score` int(11) DEFAULT NULL,
  `ORT5_total` int(11) GENERATED ALWAYS AS (coalesce(`ORT5_criteria1_score`,0) + coalesce(`ORT5_criteria2_score`,0) + coalesce(`ORT5_criteria3_score`,0) + coalesce(`ORT5_criteria4_score`,0) + coalesce(`ORT5_criteria5_score`,0)) VIRTUAL,
  `ORT6_criteria1_score` int(11) DEFAULT NULL,
  `ORT6_criteria2_score` int(11) DEFAULT NULL,
  `ORT6_criteria3_score` int(11) DEFAULT NULL,
  `ORT6_criteria4_score` int(11) DEFAULT NULL,
  `ORT6_criteria5_score` int(11) DEFAULT NULL,
  `ORT6_total` int(11) GENERATED ALWAYS AS (coalesce(`ORT6_criteria1_score`,0) + coalesce(`ORT6_criteria2_score`,0) + coalesce(`ORT6_criteria3_score`,0) + coalesce(`ORT6_criteria4_score`,0) + coalesce(`ORT6_criteria5_score`,0)) VIRTUAL,
  `ORT7_criteria1_score` int(11) DEFAULT NULL,
  `ORT7_criteria2_score` int(11) DEFAULT NULL,
  `ORT7_criteria3_score` int(11) DEFAULT NULL,
  `ORT7_criteria4_score` int(11) DEFAULT NULL,
  `ORT7_criteria5_score` int(11) DEFAULT NULL,
  `ORT7_total` int(11) GENERATED ALWAYS AS (coalesce(`ORT7_criteria1_score`,0) + coalesce(`ORT7_criteria2_score`,0) + coalesce(`ORT7_criteria3_score`,0) + coalesce(`ORT7_criteria4_score`,0) + coalesce(`ORT7_criteria5_score`,0)) VIRTUAL,
  `ORT8_criteria1_score` int(11) DEFAULT NULL,
  `ORT8_criteria2_score` int(11) DEFAULT NULL,
  `ORT8_criteria3_score` int(11) DEFAULT NULL,
  `ORT8_criteria4_score` int(11) DEFAULT NULL,
  `ORT8_criteria5_score` int(11) DEFAULT NULL,
  `ORT8_total` int(11) GENERATED ALWAYS AS (coalesce(`ORT8_criteria1_score`,0) + coalesce(`ORT8_criteria2_score`,0) + coalesce(`ORT8_criteria3_score`,0) + coalesce(`ORT8_criteria4_score`,0) + coalesce(`ORT8_criteria5_score`,0)) VIRTUAL,
  `WA1_criteria1_score` int(11) DEFAULT NULL,
  `WA1_criteria2_score` int(11) DEFAULT NULL,
  `WA1_criteria3_score` int(11) DEFAULT NULL,
  `WA1_criteria4_score` int(11) DEFAULT NULL,
  `WA1_criteria5_score` int(11) DEFAULT NULL,
  `WA1_total` int(11) GENERATED ALWAYS AS (coalesce(`WA1_criteria1_score`,0) + coalesce(`WA1_criteria2_score`,0) + coalesce(`WA1_criteria3_score`,0) + coalesce(`WA1_criteria4_score`,0) + coalesce(`WA1_criteria5_score`,0)) VIRTUAL,
  `WA2_criteria1_score` int(11) DEFAULT NULL,
  `WA2_criteria2_score` int(11) DEFAULT NULL,
  `WA2_criteria3_score` int(11) DEFAULT NULL,
  `WA2_criteria4_score` int(11) DEFAULT NULL,
  `WA2_criteria5_score` int(11) DEFAULT NULL,
  `WA2_total` int(11) GENERATED ALWAYS AS (coalesce(`WA2_criteria1_score`,0) + coalesce(`WA2_criteria2_score`,0) + coalesce(`WA2_criteria3_score`,0) + coalesce(`WA2_criteria4_score`,0) + coalesce(`WA2_criteria5_score`,0)) VIRTUAL,
  `WA3_criteria1_score` int(11) DEFAULT NULL,
  `WA3_criteria2_score` int(11) DEFAULT NULL,
  `WA3_criteria3_score` int(11) DEFAULT NULL,
  `WA3_criteria4_score` int(11) DEFAULT NULL,
  `WA3_criteria5_score` int(11) DEFAULT NULL,
  `WA3_total` int(11) GENERATED ALWAYS AS (coalesce(`WA3_criteria1_score`,0) + coalesce(`WA3_criteria2_score`,0) + coalesce(`WA3_criteria3_score`,0) + coalesce(`WA3_criteria4_score`,0) + coalesce(`WA3_criteria5_score`,0)) VIRTUAL,
  `WA4_criteria1_score` int(11) DEFAULT NULL,
  `WA4_criteria2_score` int(11) DEFAULT NULL,
  `WA4_criteria3_score` int(11) DEFAULT NULL,
  `WA4_criteria4_score` int(11) DEFAULT NULL,
  `WA4_criteria5_score` int(11) DEFAULT NULL,
  `WA4_total` int(11) GENERATED ALWAYS AS (coalesce(`WA4_criteria1_score`,0) + coalesce(`WA4_criteria2_score`,0) + coalesce(`WA4_criteria3_score`,0) + coalesce(`WA4_criteria4_score`,0) + coalesce(`WA4_criteria5_score`,0)) VIRTUAL,
  `WA5_criteria1_score` int(11) DEFAULT NULL,
  `WA5_criteria2_score` int(11) DEFAULT NULL,
  `WA5_criteria3_score` int(11) DEFAULT NULL,
  `WA5_criteria4_score` int(11) DEFAULT NULL,
  `WA5_criteria5_score` int(11) DEFAULT NULL,
  `WA5_total` int(11) GENERATED ALWAYS AS (coalesce(`WA5_criteria1_score`,0) + coalesce(`WA5_criteria2_score`,0) + coalesce(`WA5_criteria3_score`,0) + coalesce(`WA5_criteria4_score`,0) + coalesce(`WA5_criteria5_score`,0)) VIRTUAL,
  `WA6_criteria1_score` int(11) DEFAULT NULL,
  `WA6_criteria2_score` int(11) DEFAULT NULL,
  `WA6_criteria3_score` int(11) DEFAULT NULL,
  `WA6_criteria4_score` int(11) DEFAULT NULL,
  `WA6_criteria5_score` int(11) DEFAULT NULL,
  `WA6_total` int(11) GENERATED ALWAYS AS (coalesce(`WA6_criteria1_score`,0) + coalesce(`WA6_criteria2_score`,0) + coalesce(`WA6_criteria3_score`,0) + coalesce(`WA6_criteria4_score`,0) + coalesce(`WA6_criteria5_score`,0)) VIRTUAL,
  `long_test_criteria1_score` int(11) DEFAULT NULL,
  `long_test_criteria2_score` int(11) DEFAULT NULL,
  `long_test_criteria3_score` int(11) DEFAULT NULL,
  `long_test_criteria4_score` int(11) DEFAULT NULL,
  `long_test_criteria5_score` int(11) DEFAULT NULL,
  `long_test_total` int(11) GENERATED ALWAYS AS (coalesce(`long_test_criteria1_score`,0) + coalesce(`long_test_criteria2_score`,0) + coalesce(`long_test_criteria3_score`,0) + coalesce(`long_test_criteria4_score`,0) + coalesce(`long_test_criteria5_score`,0)) VIRTUAL,
  `midterm_criteria1_score` int(11) DEFAULT NULL,
  `midterm_criteria2_score` int(11) DEFAULT NULL,
  `midterm_criteria3_score` int(11) DEFAULT NULL,
  `midterm_criteria4_score` int(11) DEFAULT NULL,
  `midterm_criteria5_score` int(11) DEFAULT NULL,
  `midterm_total` int(11) GENERATED ALWAYS AS (coalesce(`midterm_criteria1_score`,0) + coalesce(`midterm_criteria2_score`,0) + coalesce(`midterm_criteria3_score`,0) + coalesce(`midterm_criteria4_score`,0) + coalesce(`midterm_criteria5_score`,0)) VIRTUAL,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `college_grades`
--

INSERT INTO `college_grades` (`subjectid`, `idnumber`, `ORT1_criteria1_score`, `ORT1_criteria2_score`, `ORT1_criteria3_score`, `ORT1_criteria4_score`, `ORT1_criteria5_score`, `ORT2_criteria1_score`, `ORT2_criteria2_score`, `ORT2_criteria3_score`, `ORT2_criteria4_score`, `ORT2_criteria5_score`, `ORT3_criteria1_score`, `ORT3_criteria2_score`, `ORT3_criteria3_score`, `ORT3_criteria4_score`, `ORT3_criteria5_score`, `ORT4_criteria1_score`, `ORT4_criteria2_score`, `ORT4_criteria3_score`, `ORT4_criteria4_score`, `ORT4_criteria5_score`, `ORT5_criteria1_score`, `ORT5_criteria2_score`, `ORT5_criteria3_score`, `ORT5_criteria4_score`, `ORT5_criteria5_score`, `ORT6_criteria1_score`, `ORT6_criteria2_score`, `ORT6_criteria3_score`, `ORT6_criteria4_score`, `ORT6_criteria5_score`, `ORT7_criteria1_score`, `ORT7_criteria2_score`, `ORT7_criteria3_score`, `ORT7_criteria4_score`, `ORT7_criteria5_score`, `ORT8_criteria1_score`, `ORT8_criteria2_score`, `ORT8_criteria3_score`, `ORT8_criteria4_score`, `ORT8_criteria5_score`, `WA1_criteria1_score`, `WA1_criteria2_score`, `WA1_criteria3_score`, `WA1_criteria4_score`, `WA1_criteria5_score`, `WA2_criteria1_score`, `WA2_criteria2_score`, `WA2_criteria3_score`, `WA2_criteria4_score`, `WA2_criteria5_score`, `WA3_criteria1_score`, `WA3_criteria2_score`, `WA3_criteria3_score`, `WA3_criteria4_score`, `WA3_criteria5_score`, `WA4_criteria1_score`, `WA4_criteria2_score`, `WA4_criteria3_score`, `WA4_criteria4_score`, `WA4_criteria5_score`, `WA5_criteria1_score`, `WA5_criteria2_score`, `WA5_criteria3_score`, `WA5_criteria4_score`, `WA5_criteria5_score`, `WA6_criteria1_score`, `WA6_criteria2_score`, `WA6_criteria3_score`, `WA6_criteria4_score`, `WA6_criteria5_score`, `long_test_criteria1_score`, `long_test_criteria2_score`, `long_test_criteria3_score`, `long_test_criteria4_score`, `long_test_criteria5_score`, `midterm_criteria1_score`, `midterm_criteria2_score`, `midterm_criteria3_score`, `midterm_criteria4_score`, `midterm_criteria5_score`, `last_updated`) VALUES
(10, 1445, 1, 12, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-01-27 03:15:11'),
(10, 1446, 10, 1, 1, NULL, NULL, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, '2025-02-04 02:34:37');

-- --------------------------------------------------------

--
-- Table structure for table `ejhs_shs_grades`
--

CREATE TABLE `ejhs_shs_grades` (
  `subject_id` int(11) NOT NULL,
  `idnumber` int(11) NOT NULL,
  `WW1_criteria1_score` int(11) DEFAULT NULL,
  `WW1_criteria2_score` int(11) DEFAULT NULL,
  `WW1_criteria3_score` int(11) DEFAULT NULL,
  `WW1_criteria4_score` int(11) DEFAULT NULL,
  `WW1_criteria5_score` int(11) DEFAULT NULL,
  `WW1_total` int(11) GENERATED ALWAYS AS (`WW1_criteria1_score` + `WW1_criteria2_score` + `WW1_criteria3_score` + `WW1_criteria4_score` + `WW1_criteria5_score`) VIRTUAL,
  `WW2_criteria1_score` int(11) DEFAULT NULL,
  `WW2_criteria2_score` int(11) DEFAULT NULL,
  `WW2_criteria3_score` int(11) DEFAULT NULL,
  `WW2_criteria4_score` int(11) DEFAULT NULL,
  `WW2_criteria5_score` int(11) DEFAULT NULL,
  `WW2_total` int(11) GENERATED ALWAYS AS (`WW2_criteria1_score` + `WW2_criteria2_score` + `WW2_criteria3_score` + `WW2_criteria4_score` + `WW2_criteria5_score`) VIRTUAL,
  `WW3_criteria1_score` int(11) DEFAULT NULL,
  `WW3_criteria2_score` int(11) DEFAULT NULL,
  `WW3_criteria3_score` int(11) DEFAULT NULL,
  `WW3_criteria4_score` int(11) DEFAULT NULL,
  `WW3_criteria5_score` int(11) DEFAULT NULL,
  `WW3_total` int(11) GENERATED ALWAYS AS (`WW3_criteria1_score` + `WW3_criteria2_score` + `WW3_criteria3_score` + `WW3_criteria4_score` + `WW3_criteria5_score`) VIRTUAL,
  `WW4_criteria1_score` int(11) DEFAULT NULL,
  `WW4_criteria2_score` int(11) DEFAULT NULL,
  `WW4_criteria3_score` int(11) DEFAULT NULL,
  `WW4_criteria4_score` int(11) DEFAULT NULL,
  `WW4_criteria5_score` int(11) DEFAULT NULL,
  `WW4_total` int(11) GENERATED ALWAYS AS (`WW4_criteria1_score` + `WW4_criteria2_score` + `WW4_criteria3_score` + `WW4_criteria4_score` + `WW4_criteria5_score`) VIRTUAL,
  `WW5_criteria1_score` int(11) DEFAULT NULL,
  `WW5_criteria2_score` int(11) DEFAULT NULL,
  `WW5_criteria3_score` int(11) DEFAULT NULL,
  `WW5_criteria4_score` int(11) DEFAULT NULL,
  `WW5_criteria5_score` int(11) DEFAULT NULL,
  `WW5_total` int(11) GENERATED ALWAYS AS (`WW5_criteria1_score` + `WW5_criteria2_score` + `WW5_criteria3_score` + `WW5_criteria4_score` + `WW5_criteria5_score`) VIRTUAL,
  `WW6_criteria1_score` int(11) DEFAULT NULL,
  `WW6_criteria2_score` int(11) DEFAULT NULL,
  `WW6_criteria3_score` int(11) DEFAULT NULL,
  `WW6_criteria4_score` int(11) DEFAULT NULL,
  `WW6_criteria5_score` int(11) DEFAULT NULL,
  `WW6_total` int(11) GENERATED ALWAYS AS (`WW6_criteria1_score` + `WW6_criteria2_score` + `WW6_criteria3_score` + `WW6_criteria4_score` + `WW6_criteria5_score`) VIRTUAL,
  `WW7_criteria1_score` int(11) DEFAULT NULL,
  `WW7_criteria2_score` int(11) DEFAULT NULL,
  `WW7_criteria3_score` int(11) DEFAULT NULL,
  `WW7_criteria4_score` int(11) DEFAULT NULL,
  `WW7_criteria5_score` int(11) DEFAULT NULL,
  `WW7_total` int(11) GENERATED ALWAYS AS (`WW7_criteria1_score` + `WW7_criteria2_score` + `WW7_criteria3_score` + `WW7_criteria4_score` + `WW7_criteria5_score`) VIRTUAL,
  `PT1_criteria1_score` int(11) DEFAULT NULL,
  `PT1_criteria2_score` int(11) DEFAULT NULL,
  `PT1_criteria3_score` int(11) DEFAULT NULL,
  `PT1_criteria4_score` int(11) DEFAULT NULL,
  `PT1_criteria5_score` int(11) DEFAULT NULL,
  `PT1_total` int(11) GENERATED ALWAYS AS (`PT1_criteria1_score` + `PT1_criteria2_score` + `PT1_criteria3_score` + `PT1_criteria4_score` + `PT1_criteria5_score`) VIRTUAL,
  `PT2_criteria1_score` int(11) DEFAULT NULL,
  `PT2_criteria2_score` int(11) DEFAULT NULL,
  `PT2_criteria3_score` int(11) DEFAULT NULL,
  `PT2_criteria4_score` int(11) DEFAULT NULL,
  `PT2_criteria5_score` int(11) DEFAULT NULL,
  `PT2_total` int(11) GENERATED ALWAYS AS (`PT2_criteria1_score` + `PT2_criteria2_score` + `PT2_criteria3_score` + `PT2_criteria4_score` + `PT2_criteria5_score`) VIRTUAL,
  `PT3_criteria1_score` int(11) DEFAULT NULL,
  `PT3_criteria2_score` int(11) DEFAULT NULL,
  `PT3_criteria3_score` int(11) DEFAULT NULL,
  `PT3_criteria4_score` int(11) DEFAULT NULL,
  `PT3_criteria5_score` int(11) DEFAULT NULL,
  `PT3_total` int(11) GENERATED ALWAYS AS (`PT3_criteria1_score` + `PT3_criteria2_score` + `PT3_criteria3_score` + `PT3_criteria4_score` + `PT3_criteria5_score`) VIRTUAL,
  `QA1_criteria1_score` int(11) DEFAULT NULL,
  `QA1_criteria2_score` int(11) DEFAULT NULL,
  `QA1_criteria3_score` int(11) DEFAULT NULL,
  `QA1_criteria4_score` int(11) DEFAULT NULL,
  `QA1_criteria5_score` int(11) DEFAULT NULL,
  `QA1_total` int(11) GENERATED ALWAYS AS (`QA1_criteria1_score` + `QA1_criteria2_score` + `QA1_criteria3_score` + `QA1_criteria4_score` + `QA1_criteria5_score`) VIRTUAL,
  `QA2_criteria1_score` int(11) DEFAULT NULL,
  `QA2_criteria2_score` int(11) DEFAULT NULL,
  `QA2_criteria3_score` int(11) DEFAULT NULL,
  `QA2_criteria4_score` int(11) DEFAULT NULL,
  `QA2_criteria5_score` int(11) DEFAULT NULL,
  `QA2_total` int(11) GENERATED ALWAYS AS (`QA2_criteria1_score` + `QA2_criteria2_score` + `QA2_criteria3_score` + `QA2_criteria4_score` + `QA2_criteria5_score`) VIRTUAL,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ejhs_shs_grades`
--

INSERT INTO `ejhs_shs_grades` (`subject_id`, `idnumber`, `WW1_criteria1_score`, `WW1_criteria2_score`, `WW1_criteria3_score`, `WW1_criteria4_score`, `WW1_criteria5_score`, `WW2_criteria1_score`, `WW2_criteria2_score`, `WW2_criteria3_score`, `WW2_criteria4_score`, `WW2_criteria5_score`, `WW3_criteria1_score`, `WW3_criteria2_score`, `WW3_criteria3_score`, `WW3_criteria4_score`, `WW3_criteria5_score`, `WW4_criteria1_score`, `WW4_criteria2_score`, `WW4_criteria3_score`, `WW4_criteria4_score`, `WW4_criteria5_score`, `WW5_criteria1_score`, `WW5_criteria2_score`, `WW5_criteria3_score`, `WW5_criteria4_score`, `WW5_criteria5_score`, `WW6_criteria1_score`, `WW6_criteria2_score`, `WW6_criteria3_score`, `WW6_criteria4_score`, `WW6_criteria5_score`, `WW7_criteria1_score`, `WW7_criteria2_score`, `WW7_criteria3_score`, `WW7_criteria4_score`, `WW7_criteria5_score`, `PT1_criteria1_score`, `PT1_criteria2_score`, `PT1_criteria3_score`, `PT1_criteria4_score`, `PT1_criteria5_score`, `PT2_criteria1_score`, `PT2_criteria2_score`, `PT2_criteria3_score`, `PT2_criteria4_score`, `PT2_criteria5_score`, `PT3_criteria1_score`, `PT3_criteria2_score`, `PT3_criteria3_score`, `PT3_criteria4_score`, `PT3_criteria5_score`, `QA1_criteria1_score`, `QA1_criteria2_score`, `QA1_criteria3_score`, `QA1_criteria4_score`, `QA1_criteria5_score`, `QA2_criteria1_score`, `QA2_criteria2_score`, `QA2_criteria3_score`, `QA2_criteria4_score`, `QA2_criteria5_score`, `last_updated`) VALUES
(8, 1444, 10, 1, 1, NULL, NULL, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, '2025-01-24 03:06:52'),
(9, 1445, 1, 9, NULL, NULL, NULL, 2, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 20, 20, 20, 25, NULL, 45, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 20, 19, 55, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-02-03 07:17:03');

-- --------------------------------------------------------

--
-- Table structure for table `enrolled`
--

CREATE TABLE `enrolled` (
  `subjectid` int(11) NOT NULL,
  `idnumber` int(11) NOT NULL,
  `status` enum('ENROLLED','DROP') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrolled`
--

INSERT INTO `enrolled` (`subjectid`, `idnumber`, `status`) VALUES
(8, 1444, 'ENROLLED'),
(9, 1445, 'ENROLLED'),
(10, 1446, 'ENROLLED');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `subject_id` int(11) NOT NULL,
  `subject_code` varchar(50) NOT NULL,
  `section` varchar(50) NOT NULL,
  `subject_name` varchar(100) NOT NULL,
  `teacherid` int(11) DEFAULT NULL,
  `department` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`subject_id`, `subject_code`, `section`, `subject_name`, `teacherid`, `department`) VALUES
(8, 'EJHS101', 'S1', 'Elementary Junior High School Test Subject', 1440, 'EJHS'),
(9, 'SHS101', 'S1', 'Senior High School Test Subject', 1441, 'SHS'),
(10, 'COLLEGE101', 'S1', 'College Test Subject', 1442, 'College');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `idNumber` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('ADMIN','TEACHER','STUDENT') NOT NULL,
  `year` enum('EJHS','SHS','College') NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`idNumber`, `name`, `email`, `role`, `year`, `password`) VALUES
(1439, 'itso', 'itso@letran', 'ADMIN', 'College', 'itso'),
(1440, 'ejhs teacher', 'ejhs.teacher@letran', 'TEACHER', 'EJHS', 'ejhs'),
(1441, 'shs teacher', 'shs.teacher@letran', 'TEACHER', 'SHS', 'shs'),
(1442, 'college teacher', 'college.teacher@letran', 'TEACHER', 'College', 'college'),
(1444, 'Page', 'page@letran', 'STUDENT', 'EJHS', 'page'),
(1445, 'Squire', 'squire@letran', 'STUDENT', 'SHS', 'squire'),
(1446, 'Knight', 'knight@letran', 'STUDENT', 'College', 'knight');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `college_grades`
--
ALTER TABLE `college_grades`
  ADD PRIMARY KEY (`subjectid`,`idnumber`);

--
-- Indexes for table `ejhs_shs_grades`
--
ALTER TABLE `ejhs_shs_grades`
  ADD PRIMARY KEY (`subject_id`,`idnumber`),
  ADD UNIQUE KEY `unique_subject_id_idnumber` (`subject_id`,`idnumber`);

--
-- Indexes for table `enrolled`
--
ALTER TABLE `enrolled`
  ADD PRIMARY KEY (`subjectid`,`idnumber`),
  ADD KEY `idnumber` (`idnumber`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`subject_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`idNumber`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `idNumber` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1447;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `enrolled`
--
ALTER TABLE `enrolled`
  ADD CONSTRAINT `enrolled_ibfk_1` FOREIGN KEY (`subjectid`) REFERENCES `subjects` (`subject_id`),
  ADD CONSTRAINT `enrolled_ibfk_2` FOREIGN KEY (`idnumber`) REFERENCES `users` (`idNumber`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
