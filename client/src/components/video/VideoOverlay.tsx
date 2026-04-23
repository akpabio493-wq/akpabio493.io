import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoActions } from "./VideoActions";

interface VideoOverlayProps {
  creatorName: string;
  creatorAvatar?: string;
  caption: string;
  tags: string[];
  likeCount: number;
  commentCount: number;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onFollow?: () => void;
  isLiked?: boolean;
  isFollowing?: boolean;
}

export function VideoOverlay({
  creatorName,
  creatorAvatar,
  caption,
  tags,
  likeCount,
  commentCount,
  onLike,
  onComment,
  onShare,
  onFollow,
  isLiked,
  isFollowing,
}: VideoOverlayProps) {
  return (
    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
      {/* Top - Creator Info */}
      <div className="p-4 pointer-events-auto">
        <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 w-fit">
          {creatorAvatar ? (
            <img
              src={creatorAvatar}
              alt={creatorName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <User className="w-4 h-4 text-accent" />
            </div>
          )}
          <span className="text-sm font-semibold text-white">{creatorName}</span>
          {!isFollowing && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onFollow}
              className="h-6 px-2 text-xs bg-accent hover:bg-accent/90 text-accent-foreground rounded-full ml-2"
            >
              Follow
            </Button>
          )}
        </div>
      </div>

      {/* Bottom - Caption and Actions */}
      <div className="p-4 pointer-events-auto space-y-4">
        {/* Caption */}
        <div className="space-y-2">
          <p className="text-sm text-white line-clamp-3">{caption}</p>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="text-xs text-accent font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons - Right Side */}
        <VideoActions
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
    </div>
  );
}
