import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { eq, and } from "drizzle-orm";
import { users, follows } from "../../drizzle/schema";

export const userRouter = router({
  // Get user profile by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      try {
        const result = await db
          .select()
          .from(users)
          .where(eq(users.id, input.id))
          .limit(1);

        return result[0] || null;
      } catch (error) {
        console.error("[User] Failed to get user:", error);
        return null;
      }
    }),

  // Get user profile by username (openId)
  getByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      try {
        const result = await db
          .select()
          .from(users)
          .where(eq(users.openId, input.username))
          .limit(1);

        return result[0] || null;
      } catch (error) {
        console.error("[User] Failed to get user by username:", error);
        return null;
      }
    }),

  // Get current user
  me: protectedProcedure.query(({ ctx }) => {
    return ctx.user;
  }),

  // Follow a user
  follow: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      if (input.userId === ctx.user.id) {
        throw new Error("Cannot follow yourself");
      }

      try {
        // Check if already following
        const existing = await db
          .select()
          .from(follows)
          .where(
            and(
              eq(follows.followerId, ctx.user.id),
              eq(follows.followingId, input.userId)
            )
          )
          .limit(1);

        if (existing.length > 0) {
          // Unfollow
          await db
            .delete(follows)
            .where(
              and(
                eq(follows.followerId, ctx.user.id),
                eq(follows.followingId, input.userId)
              )
            );
          return { following: false };
        } else {
          // Follow
          await db.insert(follows).values({
            followerId: ctx.user.id,
            followingId: input.userId,
          });
          return { following: true };
        }
      } catch (error) {
        console.error("[User] Failed to follow user:", error);
        throw error;
      }
    }),

  // Get follower count
  getFollowerCount: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return 0;

      try {
        const result = await db
          .select()
          .from(follows)
          .where(eq(follows.followingId, input.userId));

        return result.length;
      } catch (error) {
        console.error("[User] Failed to get follower count:", error);
        return 0;
      }
    }),

  // Get following count
  getFollowingCount: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return 0;

      try {
        const result = await db
          .select()
          .from(follows)
          .where(eq(follows.followerId, input.userId));

        return result.length;
      } catch (error) {
        console.error("[User] Failed to get following count:", error);
        return 0;
      }
    }),

  // Check if following
  isFollowing: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user) return false;

      const db = await getDb();
      if (!db) return false;

      try {
        const result = await db
          .select()
          .from(follows)
          .where(
            and(
              eq(follows.followerId, ctx.user.id),
              eq(follows.followingId, input.userId)
            )
          )
          .limit(1);

        return result.length > 0;
      } catch (error) {
        console.error("[User] Failed to check following:", error);
        return false;
      }
    }),

  // Get suggested users
  getSuggested: publicProcedure
    .input(z.object({ limit: z.number().default(5) }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        // Simple implementation: return random users
        // In production, implement proper algorithm
        const result = await db
          .select()
          .from(users)
          .limit(input.limit);

        return result;
      } catch (error) {
        console.error("[User] Failed to get suggested users:", error);
        return [];
      }
    }),
});
