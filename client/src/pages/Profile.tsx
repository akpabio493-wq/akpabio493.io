import { useAuth } from "@/_core/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileGrid } from "@/components/profile/ProfileGrid";

export default function Profile() {
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true });

  if (loading) {
    return null;
  }

  // Mock user videos
  const mockVideos = [
    {
      id: 1,
      caption: "Amazing video 1",
      likeCount: 1234,
      commentCount: 456,
    },
    {
      id: 2,
      caption: "Beautiful moment",
      likeCount: 5678,
      commentCount: 234,
    },
    {
      id: 3,
      caption: "Fun times",
      likeCount: 890,
      commentCount: 123,
    },
    {
      id: 4,
      caption: "Great content",
      likeCount: 2345,
      commentCount: 567,
    },
    {
      id: 5,
      caption: "Love this",
      likeCount: 3456,
      commentCount: 678,
    },
    {
      id: 6,
      caption: "Check it out",
      likeCount: 4567,
      commentCount: 789,
    },
  ];

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="w-full bg-background">
          {/* Profile Header */}
          <ProfileHeader
            username={user?.name || "User"}
            bio="Living my best life 🎬✨"
            followerCount={12345}
            followingCount={567}
            videoCount={42}
            isOwnProfile={true}
            onEditProfile={() => {
              console.log("Edit profile clicked");
            }}
          />

          {/* Videos Grid */}
          <div className="p-4 md:p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Videos</h2>
            <ProfileGrid videos={mockVideos} />
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
