import { Play } from "lucide-react";

interface Video {
  id: number;
  thumbnailUrl?: string;
  caption: string;
  likeCount: number;
  commentCount: number;
}

interface ProfileGridProps {
  videos: Video[];
  onVideoClick?: (videoId: number) => void;
  isLoading?: boolean;
}

export function ProfileGrid({ videos, onVideoClick, isLoading }: ProfileGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 rounded-full border-4 border-accent/30 border-t-accent animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground">Loading videos...</p>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-muted-foreground">No videos yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1 md:gap-2">
      {videos.map((video) => (
        <button
          key={video.id}
          onClick={() => onVideoClick?.(video.id)}
          className="aspect-square bg-secondary/50 rounded-lg overflow-hidden group relative"
        >
          {/* Thumbnail */}
          {video.thumbnailUrl ? (
            <img
              src={video.thumbnailUrl}
              alt={video.caption}
              className="w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-200"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
              <Play className="w-8 h-8 text-accent/40" />
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex items-center gap-2 text-white text-xs font-semibold">
              <div className="flex items-center gap-1">
                <span>❤️</span>
                <span>{video.likeCount > 999 ? `${(video.likeCount / 1000).toFixed(1)}K` : video.likeCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>💬</span>
                <span>{video.commentCount > 999 ? `${(video.commentCount / 1000).toFixed(1)}K` : video.commentCount}</span>
              </div>
            </div>
          </div>

          {/* Play Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
