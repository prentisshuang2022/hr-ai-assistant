import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface AppShellProps {
  breadcrumbs: { label: string; to?: string }[];
  children: ReactNode;
}

export function AppShell({ breadcrumbs, children }: AppShellProps) {
  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <BreadcrumbItem key={`${crumb.label}-${index}`}>
              {index > 0 && <BreadcrumbSeparator><ChevronRight /></BreadcrumbSeparator>}
              {index === breadcrumbs.length - 1 || !crumb.to ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={crumb.to}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      {children}
    </div>
  );
}
