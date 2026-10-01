import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

import { CubiqLogo } from "@/components/cubiq/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/cubiq/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — CUBIQ Companion" },
      { name: "description", content: "Create your CUBIQ Focus & Meeting Companion account." },
      { property: "og:title", content: "Sign Up — CUBIQ Companion" },
      { property: "og:description", content: "Create your CUBIQ Focus & Meeting Companion account." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { signup, isFirebaseActive } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setSubmitting(true);
    const success = await signup(name, email, password);
    setSubmitting(false);
    if (success) {
      navigate({ to: "/" });
    }
  };

  const handleQuickSignup = async () => {
    setSubmitting(true);
    const dummyEmail = `newuser${Math.floor(Math.random() * 900 + 100)}@cubiq.com`;
    const success = await signup("New Operator", dummyEmail, "password123");
    setSubmitting(false);
    if (success) {
      navigate({ to: "/" });
    }
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
            Create CUBIQ Account
          </h1>
          <p className="text-sm font-medium text-muted-foreground max-w-xs">
            Connect your device, track focus sessions, and process meeting speech transcripts.
          </p>
        </div>

        {/* Quick Instant Dummy Signup Banner */}
        <div className="rounded-2xl border border-primary/20 bg-primary/10 backdrop-blur-md p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold text-primary">
            <span className="flex items-center gap-1.5 font-display">
              <Sparkles className="size-3.5" /> 1-Click Fast Signup
            </span>
            <span className="text-[0.625rem] font-extrabold uppercase tracking-wider bg-primary/15 px-2 py-0.5 rounded-md border border-primary/20">
              Dummy Account
            </span>
          </div>
          <p className="text-muted-foreground font-medium text-[0.6875rem]">
            Test immediately with an auto-generated dummy profile or fill in your details below:
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleQuickSignup}
            disabled={submitting}
            className="w-full rounded-xl font-bold border-primary/30 text-primary hover:bg-primary/15 text-xs h-8.5 backdrop-blur-md"
          >
            Create Instant Dummy Account
          </Button>
        </div>

        {/* Signup Form Card */}
        <div className="surface p-6 sm:p-8 space-y-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <User className="size-3.5 text-primary" />
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson"
                className="rounded-xl h-11 text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Mail className="size-3.5 text-primary" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                className="rounded-xl h-11 text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Lock className="size-3.5 text-primary" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password..."
                  className="rounded-xl h-11 text-sm font-medium pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Lock className="size-3.5 text-primary" />
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password..."
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
                "Creating Account..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <UserPlus className="size-4" /> Create CUBIQ Account <ArrowRight className="size-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Connection Mode Footer */}
          <div className="pt-2 border-t border-border/50 text-center text-xs text-muted-foreground font-medium flex items-center justify-center gap-1.5">
            <ShieldCheck className="size-3.5 text-emerald-500" />
            <span>
              {isFirebaseActive ? "Syncs with Firebase Authentication" : "Offline Dummy Authentication Active"}
            </span>
          </div>
        </div>

        {/* Link to Login */}
        <p className="text-center text-xs font-medium text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
}
