import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface HomeModuleCard {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  stats: { label: string; value: string }[];
  highlights: string[];
}

interface HomeModulesGridProps {
  modules: HomeModuleCard[];
}

export function HomeModulesGrid({ modules }: HomeModulesGridProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
      {modules.map((module) => {
        const Icon = module.icon;
        return (
          <Card key={module.to} className="border-border/60 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow">
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link to={module.to}>进入模块</Link>
                </Button>
              </div>
              <div>
                <CardTitle>{module.title}</CardTitle>
                <CardDescription className="mt-1">{module.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {module.stats.map((stat) => (
                  <div key={stat.label} className="rounded-lg bg-muted/50 p-3">
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                    <div className="mt-1 text-lg font-semibold text-foreground">{stat.value}</div>
                  </div>
                ))}
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {module.highlights.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
