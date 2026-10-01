import { createFileRoute } from "@tanstack/react-router";

import { DeviceVisual } from "@/components/cubiq/device-visual";
import { PageHeader, SectionCard, StatusRow } from "@/components/cubiq/primitives";
import { ProtectedRoute } from "@/components/cubiq/protected-route";
import { Button } from "@/components/ui/button";
import { modeLabel, orientationLabel, useDevice } from "@/lib/cubiq/device-store";

export const Route = createFileRoute("/device")({
  head: () => ({
    meta: [
      { title: "Device Status — CUBIQ" },
      { name: "description", content: "Hardware health of your CUBIQ: battery, Wi-Fi, sensors and microphone." },
      { property: "og:title", content: "Device Status — CUBIQ" },
      { property: "og:description", content: "Hardware health of your CUBIQ: battery, Wi-Fi, sensors and microphone." },
    ],
  }),
  component: DevicePage,
});

function DevicePage() {
  const { device, events, setConnected } = useDevice();
  return (
    <ProtectedRoute>
      <PageHeader
        title="Device Status"
        description={`${device.name} · last seen ${device.lastSeen}`}
        action={
          <Button variant="outline" onClick={() => setConnected(!device.connected)}>
            {device.connected ? "Disconnect" : "Reconnect"}
          </Button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Cube">
          <DeviceVisual />
        </SectionCard>
        <SectionCard title="Components">
          <StatusRow name="Battery" health={device.battery > 20 ? "online" : "offline"} value={`${device.battery}%`} />
          <StatusRow name="Wi-Fi" health={device.wifiStatus} />
          <StatusRow name="ESP32 controller" health={device.espStatus} />
          <StatusRow name="Raspberry Pi" health={device.raspberryPiStatus} />
          <StatusRow name="Microphone" health={device.microphoneStatus} />
          <StatusRow name="Motion sensor" health={device.mpuStatus} />
          <StatusRow name="Orientation" health="ready" value={orientationLabel[device.orientation]} />
          <StatusRow name="Mode" health="ready" value={modeLabel[device.mode]} />
        </SectionCard>
      </div>
      <SectionCard title="Event log">
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">No events yet this session.</p>
        ) : (
          <ul className="divide-y divide-border">
            {events.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="font-mono text-xs text-accent-foreground">{e.type}</span>
                <span className="flex-1 text-muted-foreground">{e.detail}</span>
                <span className="text-xs text-muted-foreground">{e.at}</span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </ProtectedRoute>
  );
}
