-- Database: mentalboost_db

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `nim` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'student',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_nim_unique` (`nim`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dass_questions`
--

CREATE TABLE IF NOT EXISTS `dass_questions` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `question` text NOT NULL,
  `category` enum('depression','anxiety','stress') NOT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `dass_questions`
--

INSERT INTO `dass_questions` (`id`, `question`, `category`, `order`, `created_at`, `updated_at`) VALUES
(1, 'I found it hard to wind down', 'stress', 1, NOW(), NOW()),
(2, 'I tended to over-react to situations', 'stress', 2, NOW(), NOW()),
(3, 'I felt that I was using a lot of nervous energy', 'stress', 3, NOW(), NOW()),
(4, 'I found myself getting agitated', 'stress', 4, NOW(), NOW()),
(5, 'I found it difficult to relax', 'stress', 5, NOW(), NOW()),
(6, 'I was intolerant of anything that kept me from getting on with what I was doing', 'stress', 6, NOW(), NOW()),
(7, 'I felt that I was rather touchy', 'stress', 7, NOW(), NOW()),
(8, 'I was aware of dryness of my mouth', 'anxiety', 8, NOW(), NOW()),
(9, 'I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion)', 'anxiety', 9, NOW(), NOW()),
(10, 'I experienced trembling (e.g. in the hands)', 'anxiety', 10, NOW(), NOW()),
(11, 'I was worried about situations in which I might panic and make a fool of myself', 'anxiety', 11, NOW(), NOW()),
(12, 'I felt I was close to panic', 'anxiety', 12, NOW(), NOW()),
(13, 'I felt scared without any good reason', 'anxiety', 13, NOW(), NOW()),
(14, 'I felt my heart absent or missing a beat', 'anxiety', 14, NOW(), NOW()),
(15, 'I couldn\'t seem to experience any positive feeling at all', 'depression', 15, NOW(), NOW()),
(16, 'I found it difficult to work up the initiative to do things', 'depression', 16, NOW(), NOW()),
(17, 'I felt that I had nothing to look forward to', 'depression', 17, NOW(), NOW()),
(18, 'I felt down-hearted and blue', 'depression', 18, NOW(), NOW()),
(19, 'I was unable to become enthusiastic about anything', 'depression', 19, NOW(), NOW()),
(20, 'I felt I wasn\'t worth much as a person', 'depression', 20, NOW(), NOW()),
(21, 'I felt that life was meaningless', 'depression', 21, NOW(), NOW());

-- --------------------------------------------------------

--
-- Table structure for table `test_results`
--

CREATE TABLE IF NOT EXISTS `test_results` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `depression_score` int(11) NOT NULL,
  `anxiety_score` int(11) NOT NULL,
  `stress_score` int(11) NOT NULL,
  `depression_level` varchar(255) NOT NULL,
  `anxiety_level` varchar(255) NOT NULL,
  `stress_level` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `test_results_user_id_foreign` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `test_results`
--
ALTER TABLE `test_results`
  ADD CONSTRAINT `test_results_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

-- --------------------------------------------------------
-- Personal Access Tokens (Sanctum)
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
