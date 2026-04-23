import { useAuth } from "@/_core/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import { VideoDropzone } from "@/components/upload/VideoDropzone";
import { UploadForm } from "@/components/upload/UploadForm";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Upload() {
  const { loading } = useAuth({ redirectOnUnauthenticated: true });
  const [, navigate] = useLocation();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (loading) {
    return null;
  }

  const handleFileSelect = (file: File) => {
    setVideoFile(file);
  };

  const handleSubmit = async (data: {
    title: string;
    description: string;
    tags: string[];
  }) => {
    if (!videoFile) return;

    setIsUploading(true);
    try {
      // TODO: Call tRPC mutation to upload video
      console.log("Uploading video:", {
        ...data,
        videoFile: videoFile.name,
      });

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Reset and navigate back to feed
      setVideoFile(null);
      navigate("/");
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="w-full max-w-2xl mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Upload Video</h1>
              <p className="text-muted-foreground">
                Share your creativity with the world
              </p>
            </div>

            {videoFile ? (
              <>
                {/* Video Preview */}
                <div className="space-y-4">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                      src={URL.createObjectURL(videoFile)}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => setVideoFile(null)}
                    className="text-sm text-accent hover:text-accent/80 transition-colors"
                  >
                    Change video
                  </button>
                </div>

                {/* Upload Form */}
                <UploadForm
                  videoFile={videoFile}
                  onSubmit={handleSubmit}
                  isLoading={isUploading}
                  onCancel={() => {
                    setVideoFile(null);
                    navigate("/");
                  }}
                />
              </>
            ) : (
              /* Video Dropzone */
              <VideoDropzone onFileSelect={handleFileSelect} />
            )}
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
