import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, bigint, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Videos table storing user-uploaded video metadata.
 * Video files are stored in S3; this table stores metadata and references.
 */
export const videos = mysqlTable(
  "videos",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    caption: text("caption"),
    tags: text("tags"), // JSON array of tags
    videoUrl: varchar("videoUrl", { length: 512 }).notNull(), // S3 URL or storage key
    thumbnailUrl: varchar("thumbnailUrl", { length: 512 }), // Optional thumbnail
    duration: int("duration"), // Duration in seconds
    width: int("width"),
    height: int("height"),
    likeCount: int("likeCount").default(0).notNull(),
    commentCount: int("commentCount").default(0).notNull(),
    viewCount: int("viewCount").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("videos_userId_idx").on(table.userId),
    createdAtIdx: index("videos_createdAt_idx").on(table.createdAt),
  })
);

export type Video = typeof videos.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;

/**
 * Likes table tracking which users have liked which videos.
 */
export const likes = mysqlTable(
  "likes",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    videoId: bigint("videoId", { mode: "number" }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userVideoUnique: index("likes_userId_videoId_unique").on(table.userId, table.videoId),
    videoIdIdx: index("likes_videoId_idx").on(table.videoId),
  })
);

export type Like = typeof likes.$inferSelect;
export type InsertLike = typeof likes.$inferInsert;

/**
 * Comments table for video comments.
 */
export const comments = mysqlTable(
  "comments",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    videoId: bigint("videoId", { mode: "number" }).notNull(),
    parentCommentId: bigint("parentCommentId", { mode: "number" }), // For threaded replies
    content: text("content").notNull(),
    likeCount: int("likeCount").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    videoIdIdx: index("comments_videoId_idx").on(table.videoId),
    userIdIdx: index("comments_userId_idx").on(table.userId),
    parentCommentIdIdx: index("comments_parentCommentId_idx").on(table.parentCommentId),
  })
);

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;

/**
 * Follows table tracking which users follow which users.
 */
export const follows = mysqlTable(
  "follows",
  {
    id: bigint("id", { mode: "number" }).autoincrement().primaryKey(),
    followerId: int("followerId").notNull(), // User doing the following
    followingId: int("followingId").notNull(), // User being followed
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    followerFollowingUnique: index("follows_followerId_followingId_unique").on(
      table.followerId,
      table.followingId
    ),
    followingIdIdx: index("follows_followingId_idx").on(table.followingId),
  })
);

export type Follow = typeof follows.$inferSelect;
export type InsertFollow = typeof follows.$inferInsert;

/**
 * User profiles table with additional profile information.
 */
export const userProfiles = mysqlTable(
  "userProfiles",
  {
    userId: int("userId").primaryKey(),
    username: varchar("username", { length: 64 }).unique().notNull(),
    bio: text("bio"),
    avatarUrl: varchar("avatarUrl", { length: 512 }),
    followerCount: int("followerCount").default(0).notNull(),
    followingCount: int("followingCount").default(0).notNull(),
    videoCount: int("videoCount").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    usernameIdx: index("userProfiles_username_idx").on(table.username),
  })
);

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;