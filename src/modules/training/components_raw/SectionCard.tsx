import { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionCard({ title, subtitle, actions, children, className = "" }: SectionCardProps) {
  return (
    <section className={`rounded-2xl border border-border bg-card shadow-card ${className}`}>
      <header className="flex items-center justify-between gap-4 px-6 pt-5 pb-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {actions}
      </header>
      <div className="px-6 pb-6">{children}</div>
    </section>
  );
}
