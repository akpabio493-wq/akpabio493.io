import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

interface HeartAnimationProps {
  isVisible: boolean;  
  x: number;
  y: number;
}

export function HeartAnimation({ isVisible, x, y }: HeartAnimationProps) {
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setKey((prev) => prev + 1);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      key={key}
      className="fixed pointer-events-none"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="animate-float">
        <Heart className="w-16 h-16 fill-red-500 text-red-500 drop-shadow-lg" />
      </div>
      <style>{`
        @keyframes float {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -150%) scale(1.2);
          }
        }
        .animate-float {
          animation: float 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
