import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface UploadFormProps {
  videoFile?: File;
  onSubmit: (data: {
    title: string;
    description: string;
    tags: string[];
  }) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export function UploadForm({
  videoFile,
  onSubmit,
  isLoading,
  onCancel,
}: UploadFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit({
        title: title.trim(),
        description: description.trim(),
        tags,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-semibold text-foreground">
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your video a catchy title"
          maxLength={100}
          disabled={isLoading}
          className="w-full bg-secondary/50 text-foreground placeholder-muted-foreground rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
        />
        <p className="text-xs text-muted-foreground">{title.length}/100</p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-semibold text-foreground">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell viewers more about your video"
          maxLength={500}
          disabled={isLoading}
          rows={4}
          className="w-full bg-secondary/50 text-foreground placeholder-muted-foreground rounded-lg px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
        />
        <p className="text-xs text-muted-foreground">{description.length}/500</p>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label htmlFor="tags" className="block text-sm font-semibold text-foreground">
          Tags
        </label>
        <div className="flex gap-2">
          <input
            id="tags"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a tag and press Enter"
            disabled={isLoading}
            className="flex-1 bg-secondary/50 text-foreground placeholder-muted-foreground rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200"
          />
          <Button
            type="button"
            onClick={handleAddTag}
            disabled={!tagInput.trim() || isLoading}
            variant="outline"
            className="rounded-lg"
          >
            Add
          </Button>
        </div>

        {/* Tags Display */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag) => (
              <div
                key={tag}
                className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  disabled={isLoading}
                  className="hover:opacity-70 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* File Info */}
      {videoFile && (
        <div className="p-4 rounded-lg bg-secondary/30 border border-border">
          <p className="text-sm font-semibold text-foreground">File selected:</p>
          <p className="text-xs text-muted-foreground mt-1">
            {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)}MB)
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 rounded-lg"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!title.trim() || !videoFile || isLoading}
          className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg"
        >
          {isLoading ? "Uploading..." : "Upload Video"}
        </Button>
      </div>
    </form>
  );
}
