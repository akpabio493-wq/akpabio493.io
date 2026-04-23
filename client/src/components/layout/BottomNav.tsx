import { Home, Upload, User } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export function BottomNav() {
  const [location, navigate] = useLocation();

  const isActive = (path: string) => location === path;

  const navItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Upload", icon: Upload, path: "/upload" },
    { label: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden z-40">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-none ${
                active ? "text-accent" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
