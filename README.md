- NPM install

- add .env file with the following

NODE_ENV=DEVELOPMENT

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=auth

- Create sessions table with following

CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB

- create users table with the following 

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(30),
  `password` BINARY(65),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB
