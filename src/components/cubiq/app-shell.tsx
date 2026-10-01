import { useState, useEffect, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Cpu,
  FileText,
  Home,
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
  UserPlus,
  X,
} from "lucide-react";

import { CubiqLogo, StatusBadge } from "@/components/cubiq/primitives";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/cubiq/auth-context";
import { useDevice, modeLabel } from "@/lib/cubiq/device-store";
import { cn } from "@/lib/utils";

const mainNav = [
  { to: "/", label: "Homepage", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
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

const mobileNav = [mainNav[1], mainNav[2], mainNav[3], mainNav[7], deviceNav[0]] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();

  return (
    <nav className="flex flex-1 flex-col gap-6 px-3" aria-label="Main">
      <ul className="flex flex-col gap-1">
        {mainNav.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              onClick={onNavigate}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "bg-primary-soft text-accent-foreground font-semibold" }}
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
                activeProps={{ className: "bg-primary-soft text-accent-foreground font-semibold" }}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <item.icon aria-hidden className="size-4" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="label-caps px-3 pb-2">Account</p>
        <ul className="flex flex-col gap-1">
          {user ? (
            <li>
              <button
                type="button"
                onClick={() => {
                  logout();
                  if (onNavigate) onNavigate();
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                <LogOut className="size-4" />
                Log Out
              </button>
            </li>
          ) : null}
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

  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("cubiq-theme");
    if (saved === "light") {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("cubiq-theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("cubiq-theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Desktop sidebar - ONLY SHOWN WHEN USER IS LOGGED IN */}
      {user ? (
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
          <div className="px-5 py-5 flex items-center justify-between">
            <Link to="/" aria-label="CUBIQ home">
              <CubiqLogo />
            </Link>
          </div>
          <NavLinks />
          <DeviceSimulator />
          <ConnectedDeviceFooter />
        </aside>
      ) : null}

      {/* Mobile drawer - ONLY SHOWN WHEN USER IS LOGGED IN */}
      {user && open ? (
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

      <div className={cn(user ? "lg:pl-64" : "w-full")}>
        {/* Sticky Header Bar with Top Left Corner Darkmode Toggle */}
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            {/* Top-Left Corner Dark Mode Button */}
            <Button
              size="icon"
              variant="outline"
              aria-label="Toggle Dark Mode"
              onClick={toggleTheme}
              className="size-8 rounded-lg border-border bg-card text-foreground hover:bg-secondary shrink-0 shadow-xs"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="size-4 text-warning" /> : <Moon className="size-4 text-primary" />}
            </Button>

            {user ? (
              <Button
                size="icon"
                variant="ghost"
                className="lg:hidden size-8"
                aria-label="Open navigation"
                onClick={() => setOpen(true)}
              >
                <Menu className="size-5" />
              </Button>
            ) : null}

            <Link to="/" aria-label="CUBIQ home" className="ml-1">
              <CubiqLogo />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user && status === "recording" ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-danger-soft px-2.5 py-1 text-xs font-semibold text-destructive">
                <span aria-hidden className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-destructive" />
                RECORDING
              </span>
            ) : null}

            {user ? (
              <StatusBadge
                health={device.connected ? "online" : "offline"}
                label={device.connected ? "CUBIQ Live" : "Offline"}
                pulse={device.connected}
                className="hidden sm:inline-flex"
              />
            ) : null}

            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden md:inline-block text-xs text-muted-foreground font-medium truncate max-w-[140px]">
                  {user.email}
                </span>
                <Button size="sm" variant="outline" onClick={logout} className="gap-1.5 text-xs">
                  <LogOut className="size-3.5" />
                  Log Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" asChild className="text-xs font-semibold">
                  <Link to="/login">
                    <LogIn className="size-3.5 mr-1" />
                    Log In
                  </Link>
                </Button>
                <Button size="sm" asChild className="text-xs font-semibold shadow-sm">
                  <Link to="/signup">
                    <UserPlus className="size-3.5 mr-1" />
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 sm:px-6 sm:pb-10 lg:pt-8">
          <div className="animate-rise flex flex-col gap-6">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar - ONLY SHOWN WHEN USER IS LOGGED IN */}
      {user ? (
        <nav
          aria-label="Primary"
          className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur sm:hidden"
        >
          <ul className="grid grid-cols-5">
            {mobileNav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeProps={{ className: "text-accent-foreground font-semibold" }}
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
      ) : null}
    </div>
  );
}
