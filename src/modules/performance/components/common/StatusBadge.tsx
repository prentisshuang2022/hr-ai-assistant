import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "info" | "muted" | "destructive";

const tones: Record<Tone, string> = {
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  info: "bg-primary-soft text-primary",
  muted: "bg-secondary text-muted-foreground",
  destructive: "bg-destructive/10 text-destructive",
};

export function StatusBadge({ tone = "info", children, className }: { tone?: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium", tones[tone], className)}>
      {children}
    </span>
  );
}
