import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ComponentHealth } from "@/lib/cubiq/types";

export function CubiqLogo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className="grid h-9 w-9 place-items-center rounded-[0.7rem] bg-primary shadow-raised"
      >
        <span className="relative block h-4 w-4">
          <span className="absolute inset-0 rounded-[3px] border-2 border-primary-foreground/90" />
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-[2px] bg-primary-foreground/70" />
        </span>
      </span>
      <span className="font-display text-lg font-extrabold tracking-[0.14em] text-foreground">
        CUBIQ
      </span>
    </span>
  );
}

const healthStyles: Record<ComponentHealth, { dot: string; chip: string; text: string }> = {
  online: { dot: "bg-success", chip: "bg-success-soft text-success", text: "Online" },
  ready: { dot: "bg-success", chip: "bg-success-soft text-success", text: "Ready" },
  processing: { dot: "bg-warning", chip: "bg-warning-soft text-warning-foreground", text: "Processing" },
  offline: { dot: "bg-destructive", chip: "bg-danger-soft text-destructive", text: "Offline" },
  inactive: { dot: "bg-muted-foreground/50", chip: "bg-muted text-muted-foreground", text: "Inactive" },
};

export function StatusBadge({
  health,
  label,
  pulse = false,
  className,
}: {
  health: ComponentHealth;
  label?: string;
  pulse?: boolean;
  className?: string;
}) {
  const style = healthStyles[health];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        style.chip,
        className,
      )}
    >
      <span
        aria-hidden
        className={cn("h-1.5 w-1.5 rounded-full", style.dot, pulse && "animate-pulse-dot")}
      />
      {label ?? style.text}
    </span>
  );
}

export function StatusRow({
  name,
  health,
  value,
}: {
  name: string;
  health: ComponentHealth;
  value?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/70 py-2.5 last:border-0">
      <span className="text-sm text-muted-foreground">{name}</span>
      {value ? <StatusBadge health={health} label={value} /> : <StatusBadge health={health} />}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">{title}</h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm font-medium text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </header>
  );
}

export function SectionCard({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("surface p-5 sm:p-6", className)}>
      {title ? (
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="label-caps">{title}</h2>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-14 text-center">
      {icon ? (
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground">
          {icon}
        </div>
      ) : null}
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function AiBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-accent-foreground",
        className,
      )}
    >
      AI-generated
    </span>
  );
}
