import { VideoPlayer } from "@/components/video/VideoPlayer";
import { VideoOverlay } from "@/components/video/VideoOverlay";

interface VideoCardProps {
  id: number;
  videoUrl: string;
  thumbnailUrl?: string;
  creatorName: string;
  creatorAvatar?: string;
  caption: string;
  tags: string[];
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  isFollowing?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onFollow?: () => void;
}

export function VideoCard({
  id,
  videoUrl,
  thumbnailUrl,
  creatorName,
  creatorAvatar,
  caption,
  tags,
  likeCount,
  commentCount,
  isLiked,
  isFollowing,
  onLike,
  onComment,
  onShare,
  onFollow,
}: VideoCardProps) {
  return (
    <div className="relative w-full h-screen bg-black snap-start">
      <VideoPlayer videoUrl={videoUrl} thumbnailUrl={thumbnailUrl} />
      <VideoOverlay
        creatorName={creatorName}
        creatorAvatar={creatorAvatar}
        caption={caption}
        tags={tags}
        likeCount={likeCount}
        commentCount={commentCount}
        isLiked={isLiked}
        isFollowing={isFollowing}
        onLike={onLike}
        onComment={onComment}
        onShare={onShare}
        onFollow={onFollow}
      />
    </div>
  );
}
