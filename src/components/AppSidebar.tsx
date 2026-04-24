import { Users, Clock, UserPlus, TrendingUp, GraduationCap } from "lucide-react";
import logo from "@/assets/logo.png";
import { useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "员工档案助手",
    url: "/employee",
    icon: Users,
    children: [
      { title: "流动看板", url: "/employee" },
      { title: "员工档案", url: "/employee/employees" },
      { title: "新增员工", url: "/employee/employees/new" },
      { title: "预警中心", url: "/employee/alerts" },
      { title: "钉钉同步", url: "/employee/sync" },
    ],
  },
  {
    title: "考勤助手",
    url: "/attendance",
    icon: Clock,
    children: [
      { title: "今日概览", url: "/attendance/overview" },
      { title: "考勤明细", url: "/attendance/detail" },
      { title: "加班与调休", url: "/attendance/overtime" },
      { title: "规则配置", url: "/attendance/rules" },
    ],
  },
  {
    title: "招聘助手",
    url: "/recruitment",
    icon: UserPlus,
    children: [
      { title: "招聘工作台", url: "/recruitment" },
      { title: "岗位与JD", url: "/recruitment/jobs" },
      { title: "新建岗位", url: "/recruitment/jobs/new" },
      { title: "简历库", url: "/recruitment/resumes" },
      { title: "候选人台账", url: "/recruitment/candidates" },
    ],
  },
  {
    title: "绩效助手",
    url: "/performance",
    icon: TrendingUp,
    children: [
      { title: "绩效工作台", url: "/performance" },
      { title: "新建考核", url: "/performance/assessments/new" },
      { title: "指标库管理", url: "/performance/indicators" },
      { title: "员工绩效管理", url: "/performance/reviews" },
    ],
  },
  {
    title: "培训助手",
    url: "/training",
    icon: GraduationCap,
    children: [
      { title: "培训总览", url: "/training" },
      { title: "题库管理", url: "/training/question-bank" },
      { title: "考试中心", url: "/training/exam-center" },
      { title: "在岗培训", url: "/training/on-job" },
      { title: "培训记录", url: "/training/records" },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <img src={logo} alt="人事AI员工 Logo" className="h-9 w-9 shrink-0 rounded-lg object-contain" />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">人事AI员工</span>
              <span className="text-xs text-muted-foreground">统一 HR 智能工作台</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isModuleActive =
                  location.pathname === item.url || location.pathname.startsWith(`${item.url}/`) ||
                  (item.url === "/attendance" && location.pathname.startsWith("/attendance"));

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink
                        to={item.url}
                        className="hover:bg-sidebar-accent"
                        activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                    {!collapsed && isModuleActive && (
                      <div className="mt-1 ml-6 border-l border-sidebar-border pl-3">
                        <div className="space-y-1">
                          {item.children.map((child) => (
                            <NavLink
                              key={child.url}
                              to={child.url}
                              className={cn(
                                "flex min-h-8 items-center rounded-md px-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                              )}
                              activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            >
                              <span>{child.title}</span>
                            </NavLink>
                          ))}
                        </div>
                      </div>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
