import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  onIntersect?: (isIntersecting: boolean) => void;
}

export function VideoPlayer({ videoUrl, thumbnailUrl, onIntersect }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Intersection Observer for auto-play
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const playPromise = videoRef.current?.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                onIntersect?.(true);
              })
              .catch((err) => {
                console.error("Play error:", err);
                setError(err.message);
              });
          }
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
          onIntersect?.(false);
        }
      },
      { threshold: 0.8 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [onIntersect]);

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    console.error("Video error:", video.error);
    setError(`Video error: ${video.error?.message || 'Unknown error'}`);
  };

  const handleCanPlay = () => {
    setError(null);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden group"
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbnailUrl}
        muted={isMuted}
        loop
        playsInline
        crossOrigin="anonymous"
        onError={handleVideoError}
        onCanPlay={handleCanPlay}
        className="w-full h-full object-cover"
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white text-center p-4">
          <div>
            <p className="text-sm mb-2">Video failed to load</p>
            <p className="text-xs text-gray-400">{error}</p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute top-4 left-4 z-20 bg-red-500/80 text-white text-xs px-3 py-2 rounded">
          Error loading video
        </div>
      )}

      {/* Mute Toggle Button */}
      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </button>
    </div>
  );
}
