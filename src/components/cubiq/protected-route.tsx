import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Lock, LogIn, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/cubiq/auth-context";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-xs font-medium text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex my-12 max-w-md flex-col items-center text-center gap-6 rounded-3xl border border-border bg-card p-8 shadow-xl">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Lock className="size-7" />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-foreground">Authentication Required</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Please log in or create an account to access the CUBIQ Dashboard, Focus sessions, Meeting notes, Transcripts, and Device settings.
          </p>
        </div>

        <div className="flex w-full flex-col sm:flex-row gap-3 pt-2">
          <Button size="lg" asChild className="flex-1 gap-2 font-semibold">
            <Link to="/login">
              <LogIn className="size-4" />
              Log In
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="flex-1 gap-2 font-semibold">
            <Link to="/signup">
              <UserPlus className="size-4" />
              Sign Up
            </Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground pt-2">
          Don't have an account yet? Sign up takes less than 30 seconds.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
