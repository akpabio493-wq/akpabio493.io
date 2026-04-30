import { useAuth } from "@/_core/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Feed } from "@/components/feed/Feed";
import { CommentSheet } from "@/components/comments/CommentSheet";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function FeedPage() {
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true });
  const [activeTab, setActiveTab] = useState<"for-you" | "following">("for-you");
  const [likedVideos, setLikedVideos] = useState<Set<number>>(new Set());
  const [followingUsers, setFollowingUsers] = useState<Set<number>>(new Set());
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);
  const [isCommentSheetOpen, setIsCommentSheetOpen] = useState(false);

  // Mock videos data with working public video URLs
  const mockVideos = [
    {
      id: 1,
      videoUrl: "/manus-storage/test-video_43d73927.mp4",
      creatorName: "Creator One",
      creatorId: 101,
      caption: "Check out this amazing video! 🎬",
      tags: ["viral", "trending", "awesome"],
      likeCount: 1234,
      commentCount: 456,
    },
    {
      id: 2,
      videoUrl: "/manus-storage/test-video_43d73927.mp4",
      creatorName: "Creator Two",
      creatorId: 102,
      caption: "Beautiful moments captured 📸",
      tags: ["nature", "beautiful"],
      likeCount: 5678,
      commentCount: 234,
    },
  ];

  // Mock comments data
  const mockComments = [
    {
      id: 1,
      userId: 101,
      username: "user_one",
      content: "This is amazing! 🔥",
      likeCount: 12,
      createdAt: new Date(Date.now() - 3600000),
      replies: [
        {
          id: 2,
          userId: 102,
          username: "user_two",
          content: "I agree! So cool",
          likeCount: 3,
          createdAt: new Date(Date.now() - 1800000),
        },
      ],
    },
    {
      id: 3,
      userId: 103,
      username: "user_three",
      content: "Love this content!",
      likeCount: 8,
      createdAt: new Date(Date.now() - 7200000),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  const handleLike = (videoId: number) => {
    const newLiked = new Set(likedVideos);
    if (newLiked.has(videoId)) {
      newLiked.delete(videoId);
    } else {
      newLiked.add(videoId);
    }
    setLikedVideos(newLiked);
  };

  const handleFollow = (userId: number) => {
    const newFollowing = new Set(followingUsers);
    if (newFollowing.has(userId)) {
      newFollowing.delete(userId);
    } else {
      newFollowing.add(userId);
    }
    setFollowingUsers(newFollowing);
  };

  const handleComment = (videoId: number) => {
    setSelectedVideoId(videoId);
    setIsCommentSheetOpen(true);
  };

  const handleAddComment = (content: string) => {
    // Optimistic update - in real app, would call mutation
    console.log("Comment added:", content);
  };

  return (
    <ProtectedRoute>
      <div className="w-full h-screen">
        <Feed
          videos={mockVideos}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLike={handleLike}
          onComment={handleComment}
          onFollow={handleFollow}
          likedVideos={likedVideos}
          followingUsers={followingUsers}
        />
        <CommentSheet
          isOpen={isCommentSheetOpen}
          onClose={() => setIsCommentSheetOpen(false)}
          comments={mockComments}
          onAddComment={handleAddComment}
        />
      </div>
    </ProtectedRoute>
  );
}
