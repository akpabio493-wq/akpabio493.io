import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export default function Login() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8 space-y-8">
          {/* Logo/Branding */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/70 rounded-full flex items-center justify-center">
                <div className="text-2xl font-bold text-accent-foreground">▶</div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground">TikTok</h1>
            <p className="text-sm text-muted-foreground">
              Share your moments with the world
            </p>
          </div>

          {/* Sign In Section */}
          <div className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>

            <Button
              onClick={() => {
                window.location.href = getLoginUrl();
              }}
              size="lg"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-12 rounded-lg transition-all duration-200"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign in with Manus
            </Button>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
