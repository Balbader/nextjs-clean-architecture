-- This migration file represents the data layer in Clean Architecture.
-- It defines the database schema and relationships between core entities:
-- users, their sessions, and todos. In Clean Architecture, this sits in
-- the outermost layer (frameworks & drivers) as it deals with database
-- infrastructure. The schema supports the domain entities while keeping
-- them isolated from the specific database implementation details.

CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `todos` (
	`id` integer PRIMARY KEY NOT NULL,
	`todo` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL
);
