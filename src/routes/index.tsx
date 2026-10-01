import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Cpu,
  LayoutDashboard,
  LogIn,
  Mic,
  ShieldCheck,
  Sparkles,
  Timer,
  UserPlus,
  Users,
} from "lucide-react";

import { DeviceVisual } from "@/components/cubiq/device-visual";
import { SectionCard, StatusBadge } from "@/components/cubiq/primitives";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/cubiq/auth-context";
import { useDevice } from "@/lib/cubiq/device-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CUBIQ — Smart Productivity & Focus Microprocessor System" },
      {
        name: "description",
        content:
          "Official CUBIQ Microprocessor website. Physical gesture-controlled device with Realtime Firebase Database, AI meeting transcription, and focus tracking.",
      },
      { property: "og:title", content: "CUBIQ — Smart Productivity & Focus Microprocessor System" },
      {
        property: "og:description",
        content:
          "Official CUBIQ Microprocessor website created by Nahian Rahman Chayon and the team.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { user } = useAuth();
  const { device, setOrientation, pressStart, pressStop, status } = useDevice();

  return (
    <div className="flex flex-col gap-14 py-4">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/65 backdrop-blur-2xl p-6 sm:p-10 lg:p-14 shadow-2xl">
        <div className="absolute -top-32 -right-32 size-96 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-accent/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.2fr_1fr] items-center">
          <div className="flex flex-col gap-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-primary w-max">
              <Sparkles className="size-3.5" />
              <span>Microprocessor & Cloud IoT Ecosystem</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground font-display">
              Master Your Focus with <span className="text-primary">CUBIQ</span> Hardware
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
              Physical gesture-controlled microprocessor device synced with cloud AI session analytics, automated meeting transcriptions, and Realtime Firebase state management.
            </p>

            {/* Prominent Log In and Sign Up Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {user ? (
                <Button size="lg" asChild className="gap-2 font-bold shadow-lg">
                  <Link to="/dashboard">
                    <LayoutDashboard className="size-5" />
                    Open Live Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild className="gap-2 font-bold shadow-lg px-8">
                    <Link to="/login">
                      <LogIn className="size-5" />
                      Log In
                    </Link>
                  </Button>

                  <Button size="lg" variant="outline" asChild className="gap-2 font-bold px-8 backdrop-blur-md">
                    <Link to="/signup">
                      <UserPlus className="size-5 text-primary" />
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}

              <Button size="lg" variant="ghost" asChild className="gap-2 font-semibold">
                <Link to="/device">
                  <Cpu className="size-5 text-muted-foreground" />
                  Explore Specs
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            {/* Live Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
              <div>
                <p className="text-2xl font-extrabold text-foreground font-display">100%</p>
                <p className="text-xs font-medium text-muted-foreground">Realtime Hardware Sync</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-primary font-display">Firebase</p>
                <p className="text-xs font-medium text-muted-foreground">Cloud Auth & Storage</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-emerald-500 font-display">Online</p>
                <p className="text-xs font-medium text-muted-foreground">RTDB Status</p>
              </div>
            </div>
          </div>

          {/* Interactive Hardware Feature Preview */}
          <div className="relative flex flex-col gap-4 rounded-3xl border border-border/60 bg-card/75 p-6 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="size-5 text-primary animate-pulse" />
                <span className="font-bold text-sm text-foreground">CUBIQ Hardware Simulator</span>
              </div>
              <StatusBadge
                health={device.connected ? "online" : "offline"}
                label={device.connected ? "Live Connected" : "Offline"}
                pulse={device.connected}
              />
            </div>

            <DeviceVisual />

            <div className="grid grid-cols-3 gap-2 pt-2">
              <Button
                size="sm"
                variant={device.mode === "idle" ? "default" : "outline"}
                className="text-xs font-medium rounded-xl"
                onClick={() => setOrientation("face-down")}
              >
                Idle (Face Down)
              </Button>
              <Button
                size="sm"
                variant={device.mode === "focus" ? "default" : "outline"}
                className="text-xs font-medium rounded-xl"
                onClick={() => setOrientation("focus-up")}
              >
                Focus Mode
              </Button>
              <Button
                size="sm"
                variant={device.mode === "meeting" ? "default" : "outline"}
                className="text-xs font-medium rounded-xl"
                onClick={() => setOrientation("meeting-up")}
              >
                Meeting Mode
              </Button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs text-muted-foreground font-medium">
              <span>Status: <strong className="text-foreground capitalize font-bold">{status}</strong></span>
              {status === "running" || status === "recording" ? (
                <Button size="sm" variant="destructive" className="h-7 text-xs font-bold rounded-lg" onClick={pressStop}>
                  Stop Session
                </Button>
              ) : (
                <Button size="sm" variant="default" className="h-7 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 rounded-lg" onClick={pressStart}>
                  Start Session
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PEOPLE WHO MADE IT HAPPEN */}
      <section className="flex flex-col items-center text-center gap-6 py-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-primary">
          <Users className="size-4" />
          <span>Project Team & Visionaries</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground font-display">
          The People Who Made It Happen
        </h2>

        <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
          The dedicated team behind the CUBIQ Microprocessor Project — bringing together hardware engineering, software architecture, IoT cloud connectivity, and innovation.
        </p>

        {/* Big Centered Photo Showcase Container */}
        <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-primary/30 bg-card/75 p-3 sm:p-5 shadow-2xl backdrop-blur-2xl">
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-primary/20 via-accent/20 to-emerald-500/20 opacity-30 blur-2xl pointer-events-none" />
          
          <img
            src="/team-people-who-made-it-happen.jpg"
            alt="The People Who Made It Happen - CUBIQ Project Team"
            className="relative w-full h-auto max-h-[650px] object-cover rounded-2xl border border-border/60 shadow-xl"
          />

          <div className="mt-4 flex flex-col items-center gap-1.5 pb-2">
            <h3 className="text-lg font-bold text-foreground font-display">
              CUBIQ Microprocessor Team
            </h3>
            <p className="text-xs sm:text-sm text-primary font-semibold">
              Hardware Engineering · IoT Realtime Database Sync · System Architecture
            </p>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES GRID */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SectionCard title="Hardware Telemetry" action={<Cpu className="size-5 text-primary" />}>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            Realtime orientation sensing detects whether CUBIQ is facing down (Idle), standing (Focus), or tilted (Meeting), automatically updating cloud databases.
          </p>
          <div className="mt-4">
            <Button variant="link" className="px-0 text-xs text-primary font-bold" asChild>
              <Link to="/device">View Device Telemetry &rarr;</Link>
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="Firebase Cloud Auth & Data" action={<ShieldCheck className="size-5 text-primary" />}>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            Secure user sign up, log in, and Firestore database integration ensures every user's focus metrics and meeting transcripts stay 100% private and persistent.
          </p>
          <div className="mt-4 flex gap-3">
            <Button variant="link" className="px-0 text-xs text-primary font-bold" asChild>
              <Link to="/login">Log In &rarr;</Link>
            </Button>
            <Button variant="link" className="px-0 text-xs text-primary font-bold" asChild>
              <Link to="/signup">Sign Up &rarr;</Link>
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="AI Meeting & Focus Insights" action={<Sparkles className="size-5 text-primary" />}>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            Automatic audio recording during meeting mode generate structured AI transcripts, key action items, and focus productivity analytics.
          </p>
          <div className="mt-4">
            <Button variant="link" className="px-0 text-xs text-primary font-bold" asChild>
              <Link to="/ai-insights">Explore AI Insights &rarr;</Link>
            </Button>
          </div>
        </SectionCard>
      </section>

      {/* 4. SYSTEM NAVIGATION CARDS */}
      <section className="rounded-3xl border border-border/60 bg-card/75 p-6 sm:p-8 backdrop-blur-2xl shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/50">
          <div>
            <h3 className="text-xl font-bold text-foreground font-display">Explore CUBIQ Web Application</h3>
            <p className="text-sm text-muted-foreground font-medium">Access all live system modules and features</p>
          </div>
          <div className="flex gap-2">
            {!user && (
              <>
                <Button size="sm" asChild className="rounded-xl font-bold">
                  <Link to="/login">Log In Now</Link>
                </Button>
                <Button size="sm" variant="outline" asChild className="rounded-xl font-bold backdrop-blur-md">
                  <Link to="/signup">Create Account</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-6">
          <Link
            to="/dashboard"
            className="flex flex-col items-center gap-2.5 p-4.5 rounded-2xl border border-border/60 bg-secondary/40 backdrop-blur-md hover:bg-primary/10 hover:border-primary/40 transition-all text-center group shadow-2xs"
          >
            <LayoutDashboard className="size-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-foreground font-display">Dashboard</span>
          </Link>

          <Link
            to="/focus"
            className="flex flex-col items-center gap-2.5 p-4.5 rounded-2xl border border-border/60 bg-secondary/40 backdrop-blur-md hover:bg-primary/10 hover:border-primary/40 transition-all text-center group shadow-2xs"
          >
            <Timer className="size-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-foreground font-display">Focus Mode</span>
          </Link>

          <Link
            to="/meetings"
            className="flex flex-col items-center gap-2.5 p-4.5 rounded-2xl border border-border/60 bg-secondary/40 backdrop-blur-md hover:bg-primary/10 hover:border-primary/40 transition-all text-center group shadow-2xs"
          >
            <Mic className="size-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-foreground font-display">Meetings</span>
          </Link>

          <Link
            to="/productivity"
            className="flex flex-col items-center gap-2.5 p-4.5 rounded-2xl border border-border/60 bg-secondary/40 backdrop-blur-md hover:bg-primary/10 hover:border-primary/40 transition-all text-center group shadow-2xs"
          >
            <Activity className="size-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-foreground font-display">Productivity</span>
          </Link>

          <Link
            to="/ai-insights"
            className="flex flex-col items-center gap-2.5 p-4.5 rounded-2xl border border-border/60 bg-secondary/40 backdrop-blur-md hover:bg-primary/10 hover:border-primary/40 transition-all text-center group shadow-2xs"
          >
            <Sparkles className="size-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-foreground font-display">AI Insights</span>
          </Link>

          <Link
            to="/device"
            className="flex flex-col items-center gap-2.5 p-4.5 rounded-2xl border border-border/60 bg-secondary/40 backdrop-blur-md hover:bg-primary/10 hover:border-primary/40 transition-all text-center group shadow-2xs"
          >
            <Cpu className="size-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-foreground font-display">Device Status</span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-border/40 text-xs text-muted-foreground font-medium">
        <p>CUBIQ Microprocessor Project &copy; {new Date().getFullYear()}</p>
        <p>Designed & Developed for Smart Productivity</p>
      </footer>
    </div>
  );
}
