import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { User, Shield, Camera, FileText, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader, SectionCard } from "@/components/cubiq/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/lib/cubiq/auth-context";
import { useDevice } from "@/lib/cubiq/device-store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings & Profile — CUBIQ" },
      { name: "description", content: "Manage your user profile, Firebase account details, device settings, and AI processing." },
      { property: "og:title", content: "Settings & Profile — CUBIQ" },
      { property: "og:description", content: "Manage your user profile, Firebase account details, device settings, and AI processing." },
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
  const { user, updateUserProfile, isFirebaseActive } = useAuth();
  const { device } = useDevice();

  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [bio, setBio] = useState(user?.bio || "Hardware & Software Systems Developer");
  const [role, setRole] = useState(user?.role || "Developer / Operator");
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateUserProfile({
      displayName: name,
      photoURL,
      bio,
      role,
    });
    setSaving(false);
  };

  return (
    <>
      <PageHeader title="Settings & Profile" description="Manage your user profile, Firebase account, and device preferences." />

      {/* User Profile Card Section */}
      <SectionCard title="User Profile">
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-secondary/40 border border-border/50 backdrop-blur-md">
            <div className="relative group shrink-0">
              <img
                src={photoURL || "/developer-nahian.jpg"}
                alt={name || "User Avatar"}
                className="size-20 rounded-full object-cover border-2 border-primary shadow-md"
                onError={(e) => {
                  // Fallback avatar if URL fails
                  (e.target as HTMLImageElement).src = "/developer-nahian.jpg";
                }}
              />
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="size-6 text-white" />
              </div>
            </div>

            <div className="flex flex-col text-center sm:text-left min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="font-display text-xl font-extrabold text-foreground">{name || "CUBIQ Member"}</h3>
                <span className="inline-flex items-center gap-1 text-[0.6875rem] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="size-3" /> {role}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-1 truncate">
                User ID (UID): <span className="text-foreground font-semibold">{user?.uid || "N/A"}</span>
              </p>
              <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate">
                Email: <span className="text-foreground font-semibold">{user?.email || "N/A"}</span>
              </p>
              <p className="text-xs text-muted-foreground font-medium mt-1.5 line-clamp-2">
                {bio}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="displayName" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <User className="size-3.5 text-primary" /> Full Name
              </Label>
              <Input
                id="displayName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your display name..."
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="photoURL" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Camera className="size-3.5 text-primary" /> Photo URL / Avatar
              </Label>
              <Input
                id="photoURL"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="/developer-nahian.jpg or https://..."
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="bio" className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <FileText className="size-3.5 text-primary" /> Biography / Bio
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a short biography or description..."
              className="rounded-xl min-h-[80px]"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Shield className="size-3.5 text-emerald-500" />
              {isFirebaseActive ? "Profile syncs with Firebase Auth & Cloud Firestore" : "Local Dummy Profile Mode Active"}
            </span>
            <Button type="submit" disabled={saving} size="sm" className="rounded-xl font-bold px-6">
              {saving ? "Saving Profile..." : "Save Profile to Firebase"}
            </Button>
          </div>
        </form>
      </SectionCard>

      {/* Device Configuration */}
      <SectionCard title="Device Preferences">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="deviceName" className="text-xs font-bold text-foreground">Device Name</Label>
            <Input id="deviceName" defaultValue={device.name} className="rounded-xl" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="focusLength" className="text-xs font-bold text-foreground">Focus Length (minutes)</Label>
            <Input id="focusLength" type="number" defaultValue={25} min={5} max={120} className="rounded-xl" />
          </div>
        </div>
      </SectionCard>

      {/* Automation Preferences */}
      <SectionCard title="Automation Preferences">
        <div className="flex flex-col gap-4">
          {toggles.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-3">
              <Label htmlFor={t.id} className="text-sm font-medium text-foreground cursor-pointer">{t.label}</Label>
              <Switch id={t.id} defaultChecked={t.on} />
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button onClick={() => toast.success("All settings saved successfully")} className="rounded-xl font-bold px-8">
          Save All Settings
        </Button>
      </div>
    </>
  );
}
