import { Button } from "@/components/ui/button";

interface FeedTabsProps {
  activeTab: "for-you" | "following";
  onTabChange: (tab: "for-you" | "following") => void;
}

export function FeedTabs({ activeTab, onTabChange }: FeedTabsProps) {
  const tabs = [
    { id: "for-you", label: "For You" },
    { id: "following", label: "Following" },
  ] as const;

  return (
    <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center gap-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 rounded-none border-b-2 transition-all duration-200 ${
                isActive
                  ? "border-accent text-foreground font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
