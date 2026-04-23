import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommentList, type Comment } from "./CommentList";
import { CommentInput } from "./CommentInput";

interface CommentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  comments: Comment[];
  onAddComment: (content: string) => void;
  onLikeComment?: (commentId: number) => void;
  onReplyComment?: (commentId: number) => void;
  isLoading?: boolean;
}

export function CommentSheet({
  isOpen,
  onClose,
  comments,
  onAddComment,
  onLikeComment,
  onReplyComment,
  isLoading,
}: CommentSheetProps) {
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 bg-card rounded-t-2xl z-50 max-h-[90vh] flex flex-col md:max-w-md md:right-0 md:left-auto md:top-0 md:rounded-none md:bottom-0 md:border-l md:border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
          <h2 className="text-lg font-semibold text-foreground">
            {comments.length} Comments
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4">
          <CommentList
            comments={comments}
            onLike={onLikeComment}
            onReply={(commentId) => {
              setReplyingTo(commentId);
            }}
            isLoading={isLoading}
          />
        </div>

        {/* Comment Input */}
        <div className="border-t border-border flex-shrink-0">
          <CommentInput
            onSubmit={(content) => {
              onAddComment(content);
              setReplyingTo(null);
            }}
            placeholder={
              replyingTo ? "Write a reply..." : "Add a comment..."
            }
          />
        </div>
      </div>
    </>
  );
}
