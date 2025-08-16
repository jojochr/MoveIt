ALTER TABLE `exercising_history` ADD `exerciseData` text DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE `exercising_history` DROP COLUMN `maxWeight`;--> statement-breakpoint
ALTER TABLE `exercising_history` DROP COLUMN `repetitions`;