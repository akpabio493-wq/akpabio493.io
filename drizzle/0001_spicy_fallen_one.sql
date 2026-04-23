CREATE TABLE `comments` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`videoId` bigint NOT NULL,
	`parentCommentId` bigint,
	`content` text NOT NULL,
	`likeCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `follows` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`followerId` int NOT NULL,
	`followingId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `follows_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `likes` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`videoId` bigint NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `likes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userProfiles` (
	`userId` int NOT NULL,
	`username` varchar(64) NOT NULL,
	`bio` text,
	`avatarUrl` varchar(512),
	`followerCount` int NOT NULL DEFAULT 0,
	`followingCount` int NOT NULL DEFAULT 0,
	`videoCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userProfiles_userId` PRIMARY KEY(`userId`),
	CONSTRAINT `userProfiles_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `videos` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`caption` text,
	`tags` text,
	`videoUrl` varchar(512) NOT NULL,
	`thumbnailUrl` varchar(512),
	`duration` int,
	`width` int,
	`height` int,
	`likeCount` int NOT NULL DEFAULT 0,
	`commentCount` int NOT NULL DEFAULT 0,
	`viewCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `videos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `comments_videoId_idx` ON `comments` (`videoId`);--> statement-breakpoint
CREATE INDEX `comments_userId_idx` ON `comments` (`userId`);--> statement-breakpoint
CREATE INDEX `comments_parentCommentId_idx` ON `comments` (`parentCommentId`);--> statement-breakpoint
CREATE INDEX `follows_followerId_followingId_unique` ON `follows` (`followerId`,`followingId`);--> statement-breakpoint
CREATE INDEX `follows_followingId_idx` ON `follows` (`followingId`);--> statement-breakpoint
CREATE INDEX `likes_userId_videoId_unique` ON `likes` (`userId`,`videoId`);--> statement-breakpoint
CREATE INDEX `likes_videoId_idx` ON `likes` (`videoId`);--> statement-breakpoint
CREATE INDEX `userProfiles_username_idx` ON `userProfiles` (`username`);--> statement-breakpoint
CREATE INDEX `videos_userId_idx` ON `videos` (`userId`);--> statement-breakpoint
CREATE INDEX `videos_createdAt_idx` ON `videos` (`createdAt`);