CREATE TABLE `Professors` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`name` varchar NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `Classes` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`name` varchar NOT NULL,
	`identifier` varchar NOT NULL UNIQUE,
	PRIMARY KEY (`id`)
);

CREATE TABLE `Classrooms` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`building` varchar NOT NULL,
	`room` INT NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `Professor-Class-Assignments` (
	`professor_id` INT NOT NULL,
	`time_block_id` INT NOT NULL,
	`class_id` INT NOT NULL,
	`classroom_id` INT NOT NULL,
	PRIMARY KEY (`professor_id`,`time_block_id`,`class_id`,`classroom_id`)
);

CREATE TABLE `TimeBlocks` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`block` varchar NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `Proficiencies` (
	`professor_id` INT NOT NULL,
	`class_id` INT NOT NULL,
	PRIMARY KEY (`professor_id`,`class_id`)
);

ALTER TABLE `Professor-Class-Assignments` ADD CONSTRAINT `Professor-Class-Assignments_fk0` FOREIGN KEY (`professor_id`) REFERENCES `Professors`(`id`);

ALTER TABLE `Professor-Class-Assignments` ADD CONSTRAINT `Professor-Class-Assignments_fk1` FOREIGN KEY (`time_block_id`) REFERENCES `TimeBlocks`(`id`);

ALTER TABLE `Professor-Class-Assignments` ADD CONSTRAINT `Professor-Class-Assignments_fk2` FOREIGN KEY (`class_id`) REFERENCES `Classes`(`id`);

ALTER TABLE `Professor-Class-Assignments` ADD CONSTRAINT `Professor-Class-Assignments_fk3` FOREIGN KEY (`classroom_id`) REFERENCES `Classrooms`(`id`);

ALTER TABLE `Proficiencies` ADD CONSTRAINT `Proficiencies_fk0` FOREIGN KEY (`professor_id`) REFERENCES `Professors`(`id`);

ALTER TABLE `Proficiencies` ADD CONSTRAINT `Proficiencies_fk1` FOREIGN KEY (`class_id`) REFERENCES `Classes`(`id`);







