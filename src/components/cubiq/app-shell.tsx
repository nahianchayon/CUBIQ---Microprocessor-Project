import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Cpu,
  FileText,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Mic,
  Moon,
  Settings,
  Sparkles,
  Sun,
  Timer,
  User,
  UserPlus,
  X,
} from "lucide-react";

import { CubiqLogo, StatusBadge } from "@/components/cubiq/primitives";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/cubiq/auth-context";
import { useDevice, modeLabel } from "@/lib/cubiq/device-store";
import { cn } from "@/lib/utils";

const mainNav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/focus", label: "Focus", icon: Timer },
  { to: "/meetings", label: "Meetings", icon: Mic },
  { to: "/recordings", label: "Recordings", icon: Activity },
  { to: "/transcripts", label: "Transcripts", icon: FileText },
  { to: "/productivity", label: "Productivity", icon: BarChart3 },
  { to: "/ai-insights", label: "AI Insights", icon: Sparkles },
] as const;

const deviceNav = [
  { to: "/device", label: "Device Status", icon: Cpu },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

const mobileNav = [mainNav[0], mainNav[1], mainNav[2], mainNav[6], deviceNav[0]] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-6 px-3" aria-label="Main">
      <ul className="flex flex-col gap-1">
        {mainNav.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              onClick={onNavigate}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "bg-primary-soft text-accent-foreground" }}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <item.icon aria-hidden className="size-4" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <div>
        <p className="label-caps px-3 pb-2">Device</p>
        <ul className="flex flex-col gap-1">
          {deviceNav.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={onNavigate}
                activeProps={{ className: "bg-primary-soft text-accent-foreground" }}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <item.icon aria-hidden className="size-4" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function ConnectedDeviceFooter() {
  const { device } = useDevice();
  return (
    <div className="m-3 rounded-xl border border-border bg-secondary/60 p-3">
      <p className="label-caps">Connected device</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{device.name}</p>
      <StatusBadge
        className="mt-2"
        health={device.connected ? "online" : "offline"}
        label={device.connected ? "Online" : "Offline"}
        pulse={device.connected}
      />
    </div>
  );
}

function DeviceSimulator() {
  const { setOrientation, pressStart, pressStop, device, status } = useDevice();
  if (!import.meta.env.DEV) return null;
  return (
    <div className="m-3 rounded-xl border border-dashed border-border p-3">
      <p className="label-caps">Simulate device</p>
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        <Button size="sm" variant="outline" className="text-xs" onClick={() => setOrientation("face-down")}>
          Idle
        </Button>
        <Button size="sm" variant="outline" className="text-xs" onClick={() => setOrientation("focus-up")}>
          Focus
        </Button>
        <Button size="sm" variant="outline" className="text-xs" onClick={() => setOrientation("meeting-up")}>
          Meeting
        </Button>
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-1.5">
        <Button size="sm" className="text-xs" onClick={pressStart} disabled={status === "running" || status === "recording"}>
          START
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="text-xs"
          onClick={pressStop}
          disabled={status !== "running" && status !== "recording"}
        >
          STOP
        </Button>
      </div>
      <p className="mt-2 text-[0.6875rem] text-muted-foreground">
        Mode: {modeLabel[device.mode]} — development only
      </p>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { device, status } = useDevice();
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return true;
  });

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (typeof document !== "undefined") {
        if (next) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <div className="px-5 py-5">
          <Link to="/" aria-label="CUBIQ home">
            <CubiqLogo />
          </Link>
          <p className="mt-2 text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
            Rotate · Place · Press · Work
          </p>
        </div>
        <NavLinks />
        <DeviceSimulator />
        <ConnectedDeviceFooter />
      </aside>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-foreground/40"
          />
          <div className="relative flex h-full w-72 flex-col bg-sidebar pb-4">
            <div className="flex items-center justify-between px-5 py-5">
              <CubiqLogo />
              <Button size="icon" variant="ghost" aria-label="Close navigation" onClick={() => setOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
            <DeviceSimulator />
            <ConnectedDeviceFooter />
          </div>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="lg:hidden"
              aria-label="Open navigation"
              onClick={() => setOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
            <span className="lg:hidden">
              <CubiqLogo />
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {status === "recording" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-danger-soft px-2.5 py-1 text-xs font-semibold text-destructive">
                <span aria-hidden className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-destructive" />
                RECORDING
              </span>
            ) : null}
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              RTDB Live
            </span>
            <StatusBadge
              health={device.connected ? "online" : "offline"}
              label={device.connected ? "Connected" : "Offline"}
              pulse={device.connected}
            />
            {/* Dark mode toggle */}
            <Button
              size="icon"
              variant="outline"
              onClick={toggleTheme}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
              className="size-8 rounded-lg border-border"
            >
              {isDark ? <Sun className="size-4 text-warning" /> : <Moon className="size-4 text-primary" />}
            </Button>
            {/* Auth Session / Log In / Sign Up controls */}
            {user ? (
              <div className="flex items-center gap-1.5 pl-1">
                <span className="hidden md:inline-block text-xs font-semibold text-foreground bg-secondary px-2.5 py-1 rounded-lg border border-border">
                  {user.displayName}
                </span>
                <Button size="sm" variant="ghost" className="h-8 text-xs font-semibold hover:bg-destructive/10 hover:text-destructive" onClick={logout} title="Sign Out">
                  <LogOut className="size-3.5 mr-1" /> Log Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 pl-1">
                <Link to="/login">
                  <Button size="sm" variant="outline" className="h-8 text-xs font-bold rounded-lg border-border">
                    <LogIn className="size-3.5 mr-1 text-primary" /> Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="h-8 text-xs font-bold rounded-lg bg-primary text-primary-foreground shadow-sm">
                    <UserPlus className="size-3.5 mr-1" /> Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 sm:px-6 sm:pb-10 lg:pt-8">
          <div className="animate-rise flex flex-col gap-6">{children}</div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur sm:hidden"
      >
        <ul className="grid grid-cols-5">
          {mobileNav.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "text-accent-foreground" }}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[0.625rem] font-medium text-muted-foreground",
                )}
              >
                <item.icon aria-hidden className="size-5" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
