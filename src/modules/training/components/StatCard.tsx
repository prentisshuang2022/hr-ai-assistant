import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  tone?: "primary" | "success" | "warning" | "info" | "purple";
  trend?: { value: string; direction: "up" | "down"; positive?: boolean };
}

const toneMap = {
  primary: "bg-primary-soft text-primary",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  info: "bg-info-soft text-info",
  purple: "bg-purple-soft text-purple",
};

export function StatCard({ label, value, unit, icon: Icon, tone = "primary", trend }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card hover:shadow-elevated transition-shadow">
      <div className="flex items-start justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className={`size-9 rounded-lg grid place-items-center ${toneMap[tone]}`}>
          <Icon className="size-4" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-foreground tracking-tight">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-border flex items-center gap-1.5 text-xs">
          {trend.direction === "up" ? (
            <TrendingUp className={`size-3.5 ${trend.positive === false ? "text-destructive" : "text-success"}`} />
          ) : (
            <TrendingDown className={`size-3.5 ${trend.positive === false ? "text-success" : "text-destructive"}`} />
          )}
          <span className={trend.positive === false ? "text-destructive" : "text-success"}>{trend.value}</span>
        </div>
      )}
    </div>
  );
}
