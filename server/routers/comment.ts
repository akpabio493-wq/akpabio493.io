import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { eq, and, desc, isNull } from "drizzle-orm";
import { comments } from "../../drizzle/schema";

export const commentRouter = router({
  // Get comments for a video
  getByVideoId: publicProcedure
    .input(
      z.object({
        videoId: z.number(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        const result = await db
          .select()
          .from(comments)
          .where(
            and(
              eq(comments.videoId, input.videoId),
              isNull(comments.parentCommentId)
            )
          )
          .orderBy(desc(comments.createdAt))
          .limit(input.limit)
          .offset(input.offset);

        return result;
      } catch (error) {
        console.error("[Comment] Failed to get comments:", error);
        return [];
      }
    }),

  // Get replies for a comment
  getReplies: publicProcedure
    .input(
      z.object({
        commentId: z.number(),
        limit: z.number().default(10),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        const result = await db
          .select()
          .from(comments)
          .where(eq(comments.parentCommentId, input.commentId))
          .orderBy(desc(comments.createdAt))
          .limit(input.limit);

        return result;
      } catch (error) {
        console.error("[Comment] Failed to get replies:", error);
        return [];
      }
    }),

  // Post a comment
  post: protectedProcedure
    .input(
      z.object({
        videoId: z.number(),
        content: z.string().min(1).max(500),
        parentCommentId: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        await db.insert(comments).values({
          videoId: input.videoId,
          userId: ctx.user.id,
          content: input.content,
          parentCommentId: input.parentCommentId || null,
        });

        return { success: true };
      } catch (error) {
        console.error("[Comment] Failed to post comment:", error);
        throw error;
      }
    }),

  // Delete a comment
  delete: protectedProcedure
    .input(z.object({ commentId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // Verify ownership
        const comment = await db
          .select()
          .from(comments)
          .where(eq(comments.id, input.commentId))
          .limit(1);

        if (!comment[0] || comment[0].userId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }

        await db.delete(comments).where(eq(comments.id, input.commentId));
        return { success: true };
      } catch (error) {
        console.error("[Comment] Failed to delete comment:", error);
        throw error;
      }
    }),
});
