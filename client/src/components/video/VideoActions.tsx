import { useState } from "react";
import { Heart, MessageCircle, Share2, User } from "lucide-react";
import { HeartAnimation } from "./HeartAnimation";

interface VideoActionsProps {
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  isFollowing?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onFollow?: () => void;
}

export function VideoActions({
  likeCount,
  commentCount,
  isLiked,
  isFollowing,
  onLike,
  onComment,
  onShare,
  onFollow,
}: VideoActionsProps) {
  const [heartAnimation, setHeartAnimation] = useState<{
    isVisible: boolean;
    x: number;
    y: number;
  }>({ isVisible: false, x: 0, y: 0 });
  const [localLikeCount, setLocalLikeCount] = useState(likeCount);
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);

  const handleLike = () => {
    // Optimistic update
    setLocalIsLiked(!localIsLiked);
    setLocalLikeCount((prev) => (localIsLiked ? prev - 1 : prev + 1));

    // Show heart animation
    setHeartAnimation({
      isVisible: true,
      x: window.innerWidth - 60,
      y: window.innerHeight / 2,
    });

    // Call the actual handler
    onLike?.();

    // Hide animation after completion
    setTimeout(() => {
      setHeartAnimation({ isVisible: false, x: 0, y: 0 });
    }, 800);
  };

  const handleShare = () => {
    onShare?.();
    // Show toast notification
    if (navigator.share) {
      navigator.share({
        title: "Check out this video!",
        text: "I found this amazing video on TikTok",
      }).catch(() => {
        // Silently fail if share is cancelled
      });
    }
  };

  return (
    <>
      <HeartAnimation
        isVisible={heartAnimation.isVisible}
        x={heartAnimation.x}
        y={heartAnimation.y}
      />

      <div className="flex flex-col gap-4 items-end">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center group-hover:bg-black/50 transition-all duration-200">
            <Heart
              className={`w-6 h-6 transition-all duration-200 ${
                localIsLiked
                  ? "fill-red-500 text-red-500"
                  : "text-white group-hover:scale-110"
              }`}
            />
          </div>
          <span className="text-xs text-white font-semibold">
            {localLikeCount > 0
              ? localLikeCount > 999
                ? `${(localLikeCount / 1000).toFixed(1)}K`
                : localLikeCount
              : "Like"}
          </span>
        </button>

        {/* Comment Button */}
        <button
          onClick={onComment}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center group-hover:bg-black/50 transition-all duration-200">
            <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-all duration-200" />
          </div>
          <span className="text-xs text-white font-semibold">
            {commentCount > 0
              ? commentCount > 999
                ? `${(commentCount / 1000).toFixed(1)}K`
                : commentCount
              : "Comment"}
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center group-hover:bg-black/50 transition-all duration-200">
            <Share2 className="w-6 h-6 text-white group-hover:scale-110 transition-all duration-200" />
          </div>
          <span className="text-xs text-white font-semibold">Share</span>
        </button>
      </div>
    </>
  );
}
