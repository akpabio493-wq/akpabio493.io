import { Button } from "@/components/ui/button";
import { User, Mail } from "lucide-react";

interface ProfileHeaderProps {
  username: string;
  avatarUrl?: string;
  bio?: string;
  followerCount: number;
  followingCount: number;
  videoCount: number;
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  onFollow?: () => void;
  onEditProfile?: () => void;
}

export function ProfileHeader({
  username,
  avatarUrl,
  bio,
  followerCount,
  followingCount,
  videoCount,
  isOwnProfile,
  isFollowing,
  onFollow,
  onEditProfile,
}: ProfileHeaderProps) {
  return (
    <div className="bg-card border-b border-border p-6 space-y-6">
      {/* Avatar and Basic Info */}
      <div className="flex gap-6 items-start">
        {/* Avatar */}
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={username}
            className="w-20 h-20 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
            <User className="w-10 h-10 text-accent" />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{username}</h1>
            {bio && <p className="text-sm text-muted-foreground mt-1">{bio}</p>}
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{videoCount}</p>
              <p className="text-xs text-muted-foreground">Videos</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">
                {followerCount > 999
                  ? `${(followerCount / 1000).toFixed(1)}K`
                  : followerCount}
              </p>
              <p className="text-xs text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">
                {followingCount > 999
                  ? `${(followingCount / 1000).toFixed(1)}K`
                  : followingCount}
              </p>
              <p className="text-xs text-muted-foreground">Following</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {isOwnProfile ? (
          <>
            <Button
              onClick={onEditProfile}
              variant="outline"
              className="flex-1 rounded-lg"
            >
              Edit Profile
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-lg"
            >
              <Mail className="w-5 h-5" />
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={onFollow}
              className={`flex-1 rounded-lg ${
                isFollowing
                  ? "bg-secondary hover:bg-secondary/80 text-foreground"
                  : "bg-accent hover:bg-accent/90 text-accent-foreground"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-lg"
            >
              <Mail className="w-5 h-5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
