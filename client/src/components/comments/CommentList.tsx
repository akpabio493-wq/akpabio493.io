import { formatDistanceToNow } from "date-fns";
import { User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Comment {
  id: number;
  userId: number;
  username: string;
  avatarUrl?: string;
  content: string;
  likeCount: number;
  createdAt: Date;
  replies?: Comment[];
  isLiked?: boolean;
}

interface CommentListProps {
  comments: Comment[];
  onReply?: (commentId: number) => void;
  onLike?: (commentId: number) => void;
  isLoading?: boolean;
}

function CommentItem({
  comment,
  onReply,
  onLike,
  depth = 0,
}: {
  comment: Comment;
  onReply?: (commentId: number) => void;
  onLike?: (commentId: number) => void;
  depth?: number;
}) {
  return (
    <div className={`space-y-3 ${depth > 0 ? "ml-8" : ""}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        {comment.avatarUrl ? (
          <img
            src={comment.avatarUrl}
            alt={comment.username}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-accent" />
          </div>
        )}

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-secondary/30 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">
                {comment.username}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm text-foreground break-words">{comment.content}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-2 ml-3">
            <button
              onClick={() => onLike?.(comment.id)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors"
            >
              <Heart
                className={`w-3 h-3 ${
                  comment.isLiked ? "fill-red-500 text-red-500" : ""
                }`}
              />
              <span>{comment.likeCount > 0 ? comment.likeCount : ""}</span>
            </button>
            <button
              onClick={() => onReply?.(comment.id)}
              className="text-xs text-muted-foreground hover:text-accent transition-colors"
            >
              Reply
            </button>
          </div>
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onLike={onLike}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentList({
  comments,
  onReply,
  onLike,
  isLoading,
}: CommentListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 rounded-full border-4 border-accent/30 border-t-accent animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground">Loading comments...</p>
        </div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-muted-foreground">No comments yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onReply={onReply}
          onLike={onLike}
        />
      ))}
    </div>
  );
}
