import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface AppLayoutProps {
  children: ReactNode;
}

const ROUTE_LABELS: Record<string, string> = {
  "/": "系统首页",
  "/employee": "员工档案助手",
  "/employee/employees": "员工档案",
  "/employee/employees/new": "新增员工",
  "/employee/alerts": "预警中心",
  "/employee/sync": "钉钉同步",
  "/attendance": "考勤助手",
  "/attendance/overview": "今日概览",
  "/attendance/detail": "考勤明细",
  "/attendance/overtime": "加班与调休",
  "/attendance/rules": "规则配置",
  "/recruitment": "招聘助手",
  "/recruitment/jobs": "岗位与 JD",
  "/recruitment/jobs/new": "新建岗位",
  "/recruitment/resumes": "简历库",
  "/recruitment/candidates": "候选人台账",
  "/performance": "绩效助手",
  "/performance/assessments/new": "新建考核",
  "/performance/indicators": "指标库管理",
  "/training": "培训助手",
  "/training/question-bank": "题库管理",
  "/training/exam-center": "考试中心",
  "/training/on-job": "在岗培训",
  "/training/records": "培训记录",
};

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  const crumbs = segments.map((_, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    return { href, label: ROUTE_LABELS[href] ?? segments[index] };
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-4 border-b border-border bg-background px-4 sticky top-0 z-10">
            <SidebarTrigger />
            <div className="hidden md:block min-w-0">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/">人事AI员工</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {crumbs.map((crumb, index) => (
                    <BreadcrumbItem key={crumb.href}>
                      <BreadcrumbSeparator />
                      {index === crumbs.length - 1 ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={crumb.href}>{crumb.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="relative flex-1 max-w-md ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="搜索员工、岗位、培训…" className="pl-9 bg-muted/50 border-0" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                AI
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
