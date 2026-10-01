import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { UserPlus, ArrowRight } from "lucide-react";

import { CubiqLogo } from "@/components/cubiq/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/cubiq/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — CUBIQ" },
      { name: "description", content: "Create your CUBIQ account." },
      { property: "og:title", content: "Sign Up — CUBIQ" },
      { property: "og:description", content: "Create your CUBIQ account." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setSubmitting(true);
    const success = await signup(name || "User", email, password);
    setSubmitting(false);
    if (success) {
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4 py-8">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl grid lg:grid-cols-2">
        {/* Left Side: CUBIQ Hardware Device Photo */}
        <div className="relative hidden lg:flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/10 via-card to-background border-r border-border">
          <div className="flex flex-col items-center text-center gap-4">
            <Link to="/" aria-label="CUBIQ home">
              <CubiqLogo />
            </Link>
            <div className="relative overflow-hidden rounded-2xl border-2 border-primary/30 p-2 shadow-xl bg-card">
              <img
                src="/cubiq-hardware-cube.jpg"
                alt="CUBIQ Microprocessor Cube"
                className="w-full max-w-[280px] h-auto object-cover rounded-xl shadow-inner"
              />
            </div>
            <p className="text-sm font-bold text-foreground">CUBIQ Smart Microprocessor System</p>
            <p className="text-xs text-muted-foreground max-w-xs">
              Physical gesture-controlled hardware device with cloud AI session analytics.
            </p>
          </div>
        </div>

        {/* Right Side: Clean Signup Form */}
        <div className="flex flex-col justify-center p-6 sm:p-10 space-y-6">
          <div className="flex flex-col space-y-2 text-left">
            <div className="lg:hidden pb-2">
              <Link to="/" aria-label="CUBIQ home">
                <CubiqLogo />
              </Link>
            </div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Sign Up
            </h1>
            <p className="text-xs text-muted-foreground">
              Fill in your details to create a new CUBIQ account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-xs font-bold text-foreground">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Johnson"
                className="rounded-xl bg-background border-border h-10 text-sm font-medium"
              />
            </div>

            <div className="space-y-1">
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
                className="rounded-xl bg-background border-border h-10 text-sm font-medium"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-xs font-bold text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                className="rounded-xl bg-background border-border h-10 text-sm font-medium"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="text-xs font-bold text-foreground">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="rounded-xl bg-background border-border h-10 text-sm font-medium"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              size="lg"
              className="w-full rounded-xl font-bold bg-primary text-primary-foreground shadow-md h-11 text-sm mt-2"
            >
              {submitting ? (
                "Creating Account..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <UserPlus className="size-4" /> Sign Up <ArrowRight className="size-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Already Have an Account? Log In Option */}
          <div className="pt-3 border-t border-border text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-primary hover:underline ml-1">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
