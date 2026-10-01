import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { PageHeader, SectionCard } from "@/components/cubiq/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDevice } from "@/lib/cubiq/device-store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — CUBIQ" },
      { name: "description", content: "Configure your CUBIQ device, focus length and AI processing." },
      { property: "og:title", content: "Settings — CUBIQ" },
      { property: "og:description", content: "Configure your CUBIQ device, focus length and AI processing." },
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
  return (
    <>
      <PageHeader title="Settings" description="Preferences for your device and app." />
      <SectionCard title="Device">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Device name</Label>
            <Input id="name" defaultValue={device.name} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="focus">Focus length (minutes)</Label>
            <Input id="focus" type="number" defaultValue={25} min={5} max={120} />
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Automation">
        <div className="flex flex-col gap-4">
          {toggles.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-3">
              <Label htmlFor={t.id}>{t.label}</Label>
              <Switch id={t.id} defaultChecked={t.on} />
            </div>
          ))}
        </div>
      </SectionCard>
      <div>
        <Button onClick={() => toast.success("Settings saved")}>Save settings</Button>
      </div>
    </>
  );
}
