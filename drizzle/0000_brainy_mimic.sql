CREATE TABLE `exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `exercising_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`exerciseId` integer,
	`maxWeight` numeric DEFAULT 0 NOT NULL,
	`repetitions` numeric DEFAULT 0 NOT NULL,
	`date` integer NOT NULL,
	FOREIGN KEY (`exerciseId`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `date_idx` ON `exercising_history` (`date`);