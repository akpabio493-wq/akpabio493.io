import { useRef, useState } from "react";
import { Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoDropzoneProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  maxSizeMB?: number;
}

export function VideoDropzone({
  onFileSelect,
  isLoading,
  maxSizeMB = 100,
}: VideoDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File) => {
    const videoTypes = ["video/mp4", "video/webm", "video/quicktime"];
    const maxBytes = maxSizeMB * 1024 * 1024;

    if (!videoTypes.includes(file.type)) {
      setError("Please upload a valid video file (MP4, WebM, or MOV)");
      return false;
    }

    if (file.size > maxBytes) {
      setError(`Video must be smaller than ${maxSizeMB}MB`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
          isDragging
            ? "border-accent bg-accent/10"
            : "border-border hover:border-accent/50 bg-secondary/20"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          onChange={handleFileInputChange}
          disabled={isLoading}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
            <Upload className="w-8 h-8 text-accent" />
          </div>

          <div className="space-y-2">
            <p className="text-lg font-semibold text-foreground">
              {isDragging ? "Drop your video here" : "Drag and drop your video"}
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse (Max {maxSizeMB}MB)
            </p>
          </div>

          <Button
            onClick={() => inputRef.current?.click()}
            disabled={isLoading}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {isLoading ? "Uploading..." : "Select Video"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
}
