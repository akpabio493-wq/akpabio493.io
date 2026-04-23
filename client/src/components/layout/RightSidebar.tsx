import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface SuggestedUser {
  id: number;
  username: string;
  avatarUrl?: string;
}

export interface RightSidebarProps {
  suggestedUsers?: SuggestedUser[];
  onFollow?: (userId: number) => void;
}

export function RightSidebar({ suggestedUsers = [], onFollow }: RightSidebarProps) {
  return (
    <aside className="hidden lg:block w-80 bg-card border-l border-border p-6 space-y-6 max-h-screen overflow-y-auto">
      {/* Suggested Users Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-semibold text-foreground">Suggested Users</h2>
        </div>

        {suggestedUsers.length > 0 ? (
          <div className="space-y-3">
            {suggestedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-accent">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.username}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onFollow?.(user.id)}
                  className="ml-2 flex-shrink-0"
                >
                  Follow
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">
            No suggestions available
          </p>
        )}
      </div>
    </aside>
  );
}
