import { eq, desc, and, isNull, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, videos, likes, comments, follows, userProfiles, Video, Like, Comment, Follow, UserProfile } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Video queries
 */
export async function getVideoById(videoId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(videos).where(eq(videos.id, videoId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getVideosByUserId(userId: number, limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(videos)
    .where(eq(videos.userId, userId))
    .orderBy(desc(videos.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getFeedVideos(limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  // Simple feed algorithm: return latest videos
  return db
    .select()
    .from(videos)
    .orderBy(desc(videos.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getFollowingFeedVideos(userId: number, limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  // Get videos from users that the current user follows
  return db
    .select()
    .from(videos)
    .innerJoin(follows, eq(videos.userId, follows.followingId))
    .where(eq(follows.followerId, userId))
    .orderBy(desc(videos.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function createVideo(video: typeof videos.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(videos).values(video);
  return result;
}

export async function updateVideoLikeCount(videoId: number, increment: number) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(videos)
    .set({ likeCount: sql`${videos.likeCount} + ${increment}` })
    .where(eq(videos.id, videoId));
}

export async function updateVideoCommentCount(videoId: number, increment: number) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(videos)
    .set({ commentCount: sql`${videos.commentCount} + ${increment}` })
    .where(eq(videos.id, videoId));
}

/**
 * Like queries
 */
export async function getLikeByUserAndVideo(userId: number, videoId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(likes)
    .where(and(eq(likes.userId, userId), eq(likes.videoId, videoId)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createLike(like: typeof likes.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(likes).values(like);
}

export async function deleteLike(userId: number, videoId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(likes).where(and(eq(likes.userId, userId), eq(likes.videoId, videoId)));
}

/**
 * Comment queries
 */
export async function getCommentsByVideoId(videoId: number, limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(comments)
    .where(and(eq(comments.videoId, videoId), isNull(comments.parentCommentId)))
    .orderBy(desc(comments.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getCommentReplies(parentCommentId: number, limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(comments)
    .where(eq(comments.parentCommentId, parentCommentId))
    .orderBy(desc(comments.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function createComment(comment: typeof comments.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(comments).values(comment);
}

/**
 * Follow queries
 */
export async function getFollowByUsers(followerId: number, followingId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(follows)
    .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createFollow(follow: typeof follows.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(follows).values(follow);
}

export async function deleteFollow(followerId: number, followingId: number) {
  const db = await getDb();
  if (!db) return;
  await db
    .delete(follows)
    .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)));
}

export async function getFollowers(userId: number, limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(follows)
    .where(eq(follows.followingId, userId))
    .limit(limit)
    .offset(offset);
}

export async function getFollowing(userId: number, limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(follows)
    .where(eq(follows.followerId, userId))
    .limit(limit)
    .offset(offset);
}

/**
 * User profile queries
 */
export async function getUserProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserProfileByUsername(username: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(userProfiles).where(eq(userProfiles.username, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createUserProfile(profile: typeof userProfiles.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(userProfiles).values(profile);
}

export async function updateUserProfile(userId: number, updates: Partial<typeof userProfiles.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(userProfiles).set(updates).where(eq(userProfiles.userId, userId));
}

export async function updateFollowerCount(userId: number, increment: number) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(userProfiles)
    .set({ followerCount: sql`${userProfiles.followerCount} + ${increment}` })
    .where(eq(userProfiles.userId, userId));
}

export async function updateFollowingCount(userId: number, increment: number) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(userProfiles)
    .set({ followingCount: sql`${userProfiles.followingCount} + ${increment}` })
    .where(eq(userProfiles.userId, userId));
}

export async function updateVideoCount(userId: number, increment: number) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(userProfiles)
    .set({ videoCount: sql`${userProfiles.videoCount} + ${increment}` })
    .where(eq(userProfiles.userId, userId));
}

export async function getSuggestedUsers(userId: number, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  // Simple suggestion: get random users that the current user doesn't follow
  return db
    .select()
    .from(userProfiles)
    .where(sql`${userProfiles.userId} != ${userId}`)
    .limit(limit);
}
