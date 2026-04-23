import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface CommentInputProps {
  onSubmit: (content: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function CommentInput({
  onSubmit,
  isLoading,
  placeholder = "Add a comment...",
}: CommentInputProps) {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content);
      setContent("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-3 items-end p-4 border-t border-border bg-card">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-secondary/50 text-foreground placeholder-muted-foreground rounded-lg px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200 max-h-24"
        rows={1}
      />
      <Button
        onClick={handleSubmit}
        disabled={!content.trim() || isLoading}
        size="sm"
        className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg flex-shrink-0"
      >
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
}
