import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { eq, desc, and, count } from "drizzle-orm";
import { videos, likes, comments } from "../../drizzle/schema";

export const videoRouter = router({
  // Get feed videos (For You or Following)
  getFeed: publicProcedure
    .input(
      z.object({
        tab: z.enum(["for-you", "following"]),
        limit: z.number().default(10),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        // For now, return all videos for both tabs
        // In production, implement proper algorithm
        const result = await db
          .select()
          .from(videos)
          .orderBy(desc(videos.createdAt))
          .limit(input.limit)
          .offset(input.offset);

        return result;
      } catch (error) {
        console.error("[Video] Failed to get feed:", error);
        return [];
      }
    }),

  // Get video by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      try {
        const result = await db
          .select()
          .from(videos)
          .where(eq(videos.id, input.id))
          .limit(1);

        return result[0] || null;
      } catch (error) {
        console.error("[Video] Failed to get video:", error);
        return null;
      }
    }),

  // Get videos by user
  getByUserId: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        limit: z.number().default(10),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        const result = await db
          .select()
          .from(videos)
          .where(eq(videos.userId, input.userId))
          .orderBy(desc(videos.createdAt))
          .limit(input.limit)
          .offset(input.offset);

        return result;
      } catch (error) {
        console.error("[Video] Failed to get user videos:", error);
        return [];
      }
    }),

  // Like a video
  like: protectedProcedure
    .input(z.object({ videoId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // Check if already liked
        const existing = await db
          .select()
          .from(likes)
          .where(
            and(
              eq(likes.videoId, input.videoId),
              eq(likes.userId, ctx.user.id)
            )
          )
          .limit(1);

        if (existing.length > 0) {
          // Unlike
          await db
            .delete(likes)
            .where(
              and(
                eq(likes.videoId, input.videoId),
                eq(likes.userId, ctx.user.id)
              )
            );
          return { liked: false };
        } else {
          // Like
          await db.insert(likes).values({
            videoId: input.videoId,
            userId: ctx.user.id,
          });
          return { liked: true };
        }
      } catch (error) {
        console.error("[Video] Failed to like video:", error);
        throw error;
      }
    }),

  // Get like count for video
  getLikeCount: publicProcedure
    .input(z.object({ videoId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return 0;

      try {
        const result = await db
          .select()
          .from(likes)
          .where(eq(likes.videoId, input.videoId));

        return result.length;
      } catch (error) {
        console.error("[Video] Failed to get like count:", error);
        return 0;
      }
    }),

  // Get comment count for video
  getCommentCount: publicProcedure
    .input(z.object({ videoId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return 0;

      try {
        const result = await db
          .select()
          .from(comments)
          .where(eq(comments.videoId, input.videoId));

        return result.length;
      } catch (error) {
        console.error("[Video] Failed to get comment count:", error);
        return 0;
      }
    }),

  // Upload video
  upload: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(100),
        description: z.string().max(500),
        tags: z.array(z.string()).max(10),
        videoUrl: z.string().url(),
        thumbnailUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        await db.insert(videos).values({
          userId: ctx.user.id,
          title: input.title,
          description: input.description,
          tags: JSON.stringify(input.tags),
          videoUrl: input.videoUrl,
          thumbnailUrl: input.thumbnailUrl,
        });

        return { success: true };
      } catch (error) {
        console.error("[Video] Failed to upload video:", error);
        throw error;
      }
    }),
});
