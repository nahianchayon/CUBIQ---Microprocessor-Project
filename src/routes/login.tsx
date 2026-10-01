import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, Mail, Eye, EyeOff, LogIn, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

import { CubiqLogo } from "@/components/cubiq/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/cubiq/auth-context";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — CUBIQ Companion" },
      { name: "description", content: "Log in to your CUBIQ Focus & Meeting Companion account." },
      { property: "og:title", content: "Sign In — CUBIQ Companion" },
      { property: "og:description", content: "Log in to your CUBIQ Focus & Meeting Companion account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, isFirebaseActive } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("demo@cubiq.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await login(email, password);
    setSubmitting(false);
    if (success) {
      navigate({ to: "/" });
    }
  };

  const fillQuickDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-6 animate-rise">
        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link to="/" aria-label="CUBIQ home">
            <CubiqLogo />
          </Link>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl pt-2">
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground max-w-xs">
            Sign in to access your CUBIQ device telemetry, transcripts, and AI insights.
          </p>
        </div>

        {/* 1-Click Quick Demo Login Shortcuts */}
        <div className="rounded-2xl border border-primary/20 bg-primary-soft/40 p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold text-primary">
            <span className="flex items-center gap-1.5">
              <Sparkles className="size-3.5" /> Quick Demo Credentials
            </span>
            <span className="text-[0.625rem] uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
              Dummy Login Ready
            </span>
          </div>
          <p className="text-muted-foreground text-[0.6875rem]">
            You can sign in with any email and password or click a quick demo profile below:
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => fillQuickDemo("operator@cubiq.com", "cubiq2026")}
              className="rounded-xl border border-border bg-card px-2.5 py-1.5 text-left hover:border-primary transition-colors"
            >
              <span className="block font-bold text-foreground">Operator Demo</span>
              <span className="block text-[0.625rem] text-muted-foreground">operator@cubiq.com</span>
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo("manager@cubiq.com", "cubiq2026")}
              className="rounded-xl border border-border bg-card px-2.5 py-1.5 text-left hover:border-primary transition-colors"
            >
              <span className="block font-bold text-foreground">Manager Demo</span>
              <span className="block text-[0.625rem] text-muted-foreground">manager@cubiq.com</span>
            </button>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="surface p-6 sm:p-8 space-y-6 shadow-raised">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Mail className="size-3.5 text-primary" />
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="rounded-xl bg-card border-border h-11 text-sm font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Lock className="size-3.5 text-primary" />
                  Password
                </Label>
                <span className="text-xs font-semibold text-primary">Dummy Login Allowed</span>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className="rounded-xl bg-card border-border h-11 text-sm font-medium pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              size="lg"
              className="w-full rounded-xl font-bold bg-primary text-primary-foreground shadow-md h-11 text-sm mt-2"
            >
              {submitting ? (
                "Signing In..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn className="size-4" /> Sign In to CUBIQ <ArrowRight className="size-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Connection Mode Footer */}
          <div className="pt-2 border-t border-border/50 text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <ShieldCheck className="size-3.5 text-success" />
            <span>
              {isFirebaseActive ? "Protected by Firebase Authentication" : "Offline Dummy Authentication Active"}
            </span>
          </div>
        </div>

        {/* Link to Signup */}
        <p className="text-center text-xs font-medium text-muted-foreground">
          Don't have an account yet?{" "}
          <Link to="/signup" className="font-bold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
