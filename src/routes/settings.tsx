import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { User, Shield, Camera, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader, SectionCard } from "@/components/cubiq/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDevice } from "@/lib/cubiq/device-store";
import { useAuth } from "@/lib/cubiq/auth-context";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — CUBIQ" },
      { name: "description", content: "Configure your CUBIQ user profile, device settings, and AI preferences." },
      { property: "og:title", content: "Settings — CUBIQ" },
      { property: "og:description", content: "Configure your CUBIQ user profile, device settings, and AI preferences." },
    ],
  }),
  component: SettingsPage,
});

const toggles = [
  { id: "auto-transcribe", label: "Transcribe meetings automatically", on: true },
  { id: "auto-tasks", label: "Generate tasks from meetings", on: true },
  { id: "sound", label: "Play chime when a focus session ends", on: true },
  { id: "notify", label: "Desktop notifications", on: false },
];

function SettingsPage() {
  const { device } = useDevice();
  const { user, updateUserProfile, isFirebaseActive } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [bio, setBio] = useState(user?.bio || "CUBIQ Microprocessor Operator");
  const [role, setRole] = useState(user?.role || "Operator");
  const [savingProfile, setSavingProfile] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    await updateUserProfile({
      displayName,
      photoURL,
      bio,
      role,
    });
    setSavingProfile(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your user profile, hardware device, and system preferences." />

      {/* User Profile Card */}
      <SectionCard title="User Profile">
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-card/60 border border-border/60">
            <div className="relative size-16 rounded-full overflow-hidden border-2 border-primary/40 bg-muted flex items-center justify-center shrink-0 shadow-md">
              {photoURL || user?.photoURL ? (
                <img
                  src={photoURL || user?.photoURL}
                  alt={displayName}
                  className="size-full object-cover"
                />
              ) : (
                <User className="size-8 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-foreground text-base flex items-center gap-2">
                {displayName || "CUBIQ Member"}
                {isFirebaseActive && (
                  <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-semibold">
                    Firebase Live
                  </span>
                )}
              </h3>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <p className="text-[11px] font-mono text-muted-foreground/80">UID: {user?.uid}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="displayName" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <User className="size-3.5 text-primary" /> Full Name
              </Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Alex Johnson"
                className="rounded-xl bg-background border-border h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Shield className="size-3.5 text-primary" /> Role / Title
              </Label>
              <Input
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Microprocessor Developer"
                className="rounded-xl bg-background border-border h-10 text-sm"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="photoURL" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Camera className="size-3.5 text-primary" /> Profile Photo URL
              </Label>
              <Input
                id="photoURL"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://example.com/avatar.jpg or /developer-nahian.jpg"
                className="rounded-xl bg-background border-border h-10 text-sm font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="bio" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <FileText className="size-3.5 text-primary" /> Bio / Operator Notes
              </Label>
              <Input
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="CUBIQ Hardware Operator"
                className="rounded-xl bg-background border-border h-10 text-sm"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={savingProfile}
            className="rounded-xl font-bold bg-primary text-primary-foreground shadow-md h-10 px-5 text-xs"
          >
            {savingProfile ? "Saving Profile..." : "Save Profile Details"}
          </Button>
        </form>
      </SectionCard>

      <SectionCard title="Device Preferences">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="name" className="text-xs font-bold">Device Name</Label>
            <Input id="name" defaultValue={device.name} className="rounded-xl bg-background border-border h-10 text-sm" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="focus" className="text-xs font-bold">Focus Length (minutes)</Label>
            <Input id="focus" type="number" defaultValue={25} min={5} max={120} className="rounded-xl bg-background border-border h-10 text-sm" />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Automation">
        <div className="flex flex-col gap-4">
          {toggles.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-3">
              <Label htmlFor={t.id} className="text-xs font-medium">{t.label}</Label>
              <Switch id={t.id} defaultChecked={t.on} />
            </div>
          ))}
        </div>
      </SectionCard>

      <div>
        <Button
          type="button"
          onClick={() => toast.success("System preferences saved")}
          className="rounded-xl font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 text-xs px-5"
        >
          <CheckCircle2 className="size-4 mr-1.5" /> Save Preferences
        </Button>
      </div>
    </div>
  );
}
