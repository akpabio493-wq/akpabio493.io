import { BottomNav } from "./BottomNav";
import { RightSidebar } from "./RightSidebar";
import type { RightSidebarProps } from "./RightSidebar";

interface MainLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  sidebarProps?: RightSidebarProps;
}

export function MainLayout({ children, showSidebar = true, sidebarProps }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {children}
        </div>
      </main>

      {/* Right Sidebar - Desktop Only */}
      {showSidebar && <RightSidebar {...sidebarProps} />}

      {/* Bottom Navigation - Mobile Only */}
      <BottomNav />
    </div>
  );
}
