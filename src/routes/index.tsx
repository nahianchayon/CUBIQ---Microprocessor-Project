import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Award,
  CheckCircle2,
  Cpu,
  Github,
  LayoutDashboard,
  LogIn,
  Mic,
  ShieldCheck,
  Sparkles,
  Timer,
  UserPlus,
  Users,
  Zap,
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
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-card via-card/90 to-background p-6 sm:p-10 lg:p-14 shadow-xl">
        <div className="absolute -top-24 -right-24 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 size-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.2fr_1fr] items-center">
          <div className="flex flex-col gap-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary w-max">
              <Sparkles className="size-3.5" />
              <span>Microprocessor & Cloud IoT Ecosystem</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
              Master Your Focus with <span className="text-primary">CUBIQ</span> Hardware
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Physical gesture-controlled microprocessor device synced with cloud AI session analytics, automated meeting transcriptions, and Realtime Firebase state management.
            </p>

            {/* Prominent Log In and Sign Up Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {user ? (
                <Button size="lg" asChild className="gap-2 font-semibold shadow-lg">
                  <Link to="/dashboard">
                    <LayoutDashboard className="size-5" />
                    Open Live Dashboard
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild className="gap-2 font-semibold shadow-lg px-8">
                    <Link to="/login">
                      <LogIn className="size-5" />
                      Log In
                    </Link>
                  </Button>

                  <Button size="lg" variant="outline" asChild className="gap-2 font-semibold px-8 border-primary/30 hover:bg-primary/5">
                    <Link to="/signup">
                      <UserPlus className="size-5 text-primary" />
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}

              <Button size="lg" variant="ghost" asChild className="gap-2">
                <Link to="/device">
                  <Cpu className="size-5 text-muted-foreground" />
                  Explore Device Specs
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            {/* Live Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/60">
              <div>
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-xs text-muted-foreground">Realtime Hardware Sync</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">Firebase</p>
                <p className="text-xs text-muted-foreground">Cloud Auth & Storage</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-500">Online</p>
                <p className="text-xs text-muted-foreground">RTDB Status</p>
              </div>
            </div>
          </div>

          {/* Interactive Hardware Feature Preview */}
          <div className="relative flex flex-col gap-4 rounded-2xl border border-border bg-card/80 p-6 shadow-inner backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="size-5 text-primary animate-pulse" />
                <span className="font-semibold text-sm">CUBIQ Hardware Simulator</span>
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
                className="text-xs"
                onClick={() => setOrientation("face-down")}
              >
                Idle (Face Down)
              </Button>
              <Button
                size="sm"
                variant={device.mode === "focus" ? "default" : "outline"}
                className="text-xs"
                onClick={() => setOrientation("focus-up")}
              >
                Focus Mode
              </Button>
              <Button
                size="sm"
                variant={device.mode === "meeting" ? "default" : "outline"}
                className="text-xs"
                onClick={() => setOrientation("meeting-up")}
              >
                Meeting Mode
              </Button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-muted-foreground">
              <span>Status: <strong className="text-foreground capitalize">{status}</strong></span>
              {status === "running" || status === "recording" ? (
                <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={pressStop}>
                  Stop Session
                </Button>
              ) : (
                <Button size="sm" variant="default" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={pressStart}>
                  Start Session
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PEOPLE WHO MADE IT HAPPEN - BIG & CENTERED IN THE MIDDLE */}
      <section className="flex flex-col items-center text-center gap-6 py-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
          <Users className="size-4" />
          <span>Project Team & Visionaries</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
          The People Who Made It Happen
        </h2>

        <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
          The dedicated team behind the CUBIQ Microprocessor Project — bringing together hardware engineering, software architecture, IoT cloud connectivity, and innovation.
        </p>

        {/* Big Centered Photo Showcase Container */}
        <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border-2 border-primary/30 bg-card p-3 sm:p-5 shadow-2xl">
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-primary via-accent to-emerald-500 opacity-25 blur-2xl pointer-events-none" />
          
          <img
            src="/team-people-who-made-it-happen.jpg"
            alt="The People Who Made It Happen - CUBIQ Project Team"
            className="relative w-full h-auto max-h-[650px] object-cover rounded-2xl border border-border shadow-xl"
          />

          <div className="mt-4 flex flex-col items-center gap-1.5 pb-2">
            <h3 className="text-lg font-bold text-foreground">
              CUBIQ Microprocessor Team
            </h3>
            <p className="text-xs sm:text-sm text-primary font-medium">
              Hardware Engineering · IoT Realtime Database Sync · System Architecture
            </p>
          </div>
        </div>
      </section>

      {/* 3. DEVELOPER PROFILE SECTION - NAHIAN RAHMAN CHAYON */}
      <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card p-6 sm:p-10 shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12">
          {/* Developer Photo */}
          <div className="relative shrink-0">
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-primary via-accent to-emerald-500 opacity-80 blur-md animate-pulse" />
            <img
              src="/developer-nahian.jpg"
              alt="Nahian Rahman Chayon - CUBIQ Developer"
              className="relative size-40 sm:size-48 lg:size-56 rounded-full object-cover border-4 border-background shadow-2xl"
            />
            <div className="absolute bottom-2 right-2 rounded-full bg-emerald-500 p-2 text-white shadow-lg border-2 border-background" title="Lead Architect">
              <ShieldCheck className="size-5" />
            </div>
          </div>

          {/* Developer Bio & Details */}
          <div className="flex flex-col gap-4 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary w-max mx-auto md:mx-0">
              <Award className="size-3.5" />
              <span>Developer & System Architect</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground">
              Nahian Rahman Chayon
            </h2>

            <p className="text-sm sm:text-base font-medium text-primary">
              Lead Microprocessor Engineer & Full-Stack System Architect
            </p>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Designed and developed the <strong>CUBIQ Microprocessor System</strong> — bridging physical hardware sensors with modern web technology, Firebase Realtime Database cloud synchronization, user authentication, and AI-driven productivity insights.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-medium text-foreground bg-secondary/50 p-2.5 rounded-xl border border-border">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>Microprocessor & Hardware Integration</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-foreground bg-secondary/50 p-2.5 rounded-xl border border-border">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>Firebase Realtime Database & Firestore</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-foreground bg-secondary/50 p-2.5 rounded-xl border border-border">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>React, TypeScript & Tailwind CSS UI</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-foreground bg-secondary/50 p-2.5 rounded-xl border border-border">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>AI Session Recording & Transcription</span>
              </div>
            </div>

            {/* Links / Contact CTA */}
            <div className="flex items-center justify-center md:justify-start gap-4 pt-4 border-t border-border">
              <Button variant="outline" size="sm" asChild className="gap-2">
                <a href="https://github.com/nahianchayon/CUBIQ---Microprocessor-Project" target="_blank" rel="noopener noreferrer">
                  <Github className="size-4" />
                  GitHub Repository
                </a>
              </Button>
              <Button size="sm" asChild className="gap-2">
                <Link to="/dashboard">
                  <Zap className="size-4" />
                  View Live Project
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE FEATURES GRID */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <SectionCard title="Hardware Telemetry" action={<Cpu className="size-5 text-primary" />}>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Realtime orientation sensing detects whether CUBIQ is facing down (Idle), standing (Focus), or tilted (Meeting), automatically updating cloud databases.
          </p>
          <div className="mt-4">
            <Button variant="link" className="px-0 text-xs text-primary" asChild>
              <Link to="/device">View Device Telemetry &rarr;</Link>
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="Firebase Cloud Auth & Data" action={<ShieldCheck className="size-5 text-primary" />}>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Secure user sign up, log in, and Firestore database integration ensures every user's focus metrics and meeting transcripts stay 100% private and persistent.
          </p>
          <div className="mt-4 flex gap-3">
            <Button variant="link" className="px-0 text-xs text-primary" asChild>
              <Link to="/login">Log In &rarr;</Link>
            </Button>
            <Button variant="link" className="px-0 text-xs text-primary" asChild>
              <Link to="/signup">Sign Up &rarr;</Link>
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="AI Meeting & Focus Insights" action={<Sparkles className="size-5 text-primary" />}>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Automatic audio recording during meeting mode generate structured AI transcripts, key action items, and focus productivity analytics.
          </p>
          <div className="mt-4">
            <Button variant="link" className="px-0 text-xs text-primary" asChild>
              <Link to="/ai-insights">Explore AI Insights &rarr;</Link>
            </Button>
          </div>
        </SectionCard>
      </section>

      {/* 5. SYSTEM NAVIGATION CARDS */}
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h3 className="text-xl font-bold text-foreground">Explore CUBIQ Web Application</h3>
            <p className="text-sm text-muted-foreground">Access all live system modules and features</p>
          </div>
          <div className="flex gap-2">
            {!user && (
              <>
                <Button size="sm" asChild>
                  <Link to="/login">Log In Now</Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/signup">Create Account</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-6">
          <Link
            to="/dashboard"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-secondary/30 hover:bg-primary/10 transition-colors text-center group"
          >
            <LayoutDashboard className="size-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-foreground">Dashboard</span>
          </Link>

          <Link
            to="/focus"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-secondary/30 hover:bg-primary/10 transition-colors text-center group"
          >
            <Timer className="size-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-foreground">Focus Mode</span>
          </Link>

          <Link
            to="/meetings"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-secondary/30 hover:bg-primary/10 transition-colors text-center group"
          >
            <Mic className="size-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-foreground">Meetings</span>
          </Link>

          <Link
            to="/productivity"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-secondary/30 hover:bg-primary/10 transition-colors text-center group"
          >
            <Activity className="size-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-foreground">Productivity</span>
          </Link>

          <Link
            to="/ai-insights"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-secondary/30 hover:bg-primary/10 transition-colors text-center group"
          >
            <Sparkles className="size-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-foreground">AI Insights</span>
          </Link>

          <Link
            to="/device"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border bg-secondary/30 hover:bg-primary/10 transition-colors text-center group"
          >
            <Cpu className="size-6 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-foreground">Device Status</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
