import { useState } from "react";
import { FeedTabs } from "./FeedTabs";
import { VideoCard } from "./VideoCard";

interface Video {
  id: number;
  videoUrl: string;
  thumbnailUrl?: string;
  creatorName: string;
  creatorId: number;
  creatorAvatar?: string;
  caption: string;
  tags: string[];
  likeCount: number;
  commentCount: number;
}

interface FeedProps {
  videos: Video[];
  isLoading?: boolean;
  activeTab?: "for-you" | "following";
  onTabChange?: (tab: "for-you" | "following") => void;
  onLike?: (videoId: number) => void;
  onComment?: (videoId: number) => void;
  onShare?: (videoId: number) => void;
  onFollow?: (userId: number) => void;
  likedVideos?: Set<number>;
  followingUsers?: Set<number>;
}

export function Feed({
  videos,
  isLoading,
  activeTab = "for-you",
  onTabChange,
  onLike,
  onComment,
  onShare,
  onFollow,
  likedVideos = new Set(),
  followingUsers = new Set(),
}: FeedProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const index = Math.round(element.scrollTop / window.innerHeight);
    setCurrentVideoIndex(index);
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-accent/30 border-t-accent animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading videos...</p>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="w-full h-screen flex flex-col">
        <FeedTabs activeTab={activeTab} onTabChange={onTabChange || (() => {})} />
        <div className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <p className="text-lg font-semibold text-foreground">No videos yet</p>
            <p className="text-sm text-muted-foreground">
              {activeTab === "following"
                ? "Follow creators to see their videos"
                : "Check back soon for new content"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-background">
      <FeedTabs activeTab={activeTab} onTabChange={onTabChange || (() => {})} />
      <div
        className="flex-1 overflow-y-scroll snap-y snap-mandatory scroll-smooth"
        onScroll={handleScroll}
        style={{ scrollBehavior: "smooth" }}
      >
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            id={video.id}
            videoUrl={video.videoUrl}
            thumbnailUrl={video.thumbnailUrl}
            creatorName={video.creatorName}
            creatorAvatar={video.creatorAvatar}
            caption={video.caption}
            tags={video.tags}
            likeCount={video.likeCount}
            commentCount={video.commentCount}
            isLiked={likedVideos.has(video.id)}
            isFollowing={followingUsers.has(video.creatorId)}
            onLike={() => onLike?.(video.id)}
            onComment={() => onComment?.(video.id)}
            onShare={() => onShare?.(video.id)}
            onFollow={() => onFollow?.(video.creatorId)}
          />
        ))}
      </div>
    </div>
  );
}
