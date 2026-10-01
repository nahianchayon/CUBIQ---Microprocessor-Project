import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogIn, ArrowRight } from "lucide-react";

import { CubiqLogo } from "@/components/cubiq/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/cubiq/auth-context";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log In — CUBIQ" },
      { name: "description", content: "Log in to your CUBIQ account." },
      { property: "og:title", content: "Log In — CUBIQ" },
      { property: "og:description", content: "Log in to your CUBIQ account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await login(email || "demo@cubiq.com", password || "password123");
    setSubmitting(false);
    if (success) {
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4 py-8">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-border/60 bg-card/75 backdrop-blur-2xl shadow-2xl grid lg:grid-cols-2">
        {/* Left Side: CUBIQ Hardware Device Photo */}
        <div className="relative hidden lg:flex flex-col items-center justify-center p-8 bg-secondary/30 border-r border-border/50">
          <div className="flex flex-col items-center text-center gap-4">
            <Link to="/" aria-label="CUBIQ home">
              <CubiqLogo />
            </Link>
            <div className="relative overflow-hidden rounded-2xl border-2 border-primary/30 p-2 shadow-xl bg-card/80 backdrop-blur-md">
              <img
                src="/cubiq-hardware-cube.jpg"
                alt="CUBIQ Microprocessor Cube"
                className="w-full max-w-[280px] h-auto object-cover rounded-xl shadow-inner"
              />
            </div>
            <p className="text-sm font-bold text-foreground font-display">CUBIQ Smart Microprocessor System</p>
            <p className="text-xs text-muted-foreground font-medium max-w-xs">
              Physical gesture-controlled hardware device with cloud AI session analytics.
            </p>
          </div>
        </div>

        {/* Right Side: Clean Login Form */}
        <div className="flex flex-col justify-center p-6 sm:p-10 space-y-6">
          <div className="flex flex-col space-y-2 text-left">
            <div className="lg:hidden pb-2">
              <Link to="/" aria-label="CUBIQ home">
                <CubiqLogo />
              </Link>
            </div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Log In
            </h1>
            <p className="text-xs font-medium text-muted-foreground">
              Enter your email address and password to log in.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-foreground">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="rounded-xl h-11 text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="rounded-xl h-11 text-sm font-medium"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              size="lg"
              className="w-full rounded-xl font-bold shadow-md h-11 text-sm mt-2"
            >
              {submitting ? (
                "Logging In..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn className="size-4" /> Log In <ArrowRight className="size-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Don't Have an Account? Sign Up Option */}
          <div className="pt-4 border-t border-border/50 text-center text-xs text-muted-foreground font-medium">
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold text-primary hover:underline ml-1">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
