import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Bell,
  Search,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const menu = [
  { to: "/", label: "培训总览", end: true },
  { to: "/question-bank", label: "题库管理" },
  
  { to: "/exam-center", label: "考试中心", dot: true },
  { to: "/on-job", label: "在岗培训" },
  { to: "/records", label: "成绩留档" },
];

const labelMap: Record<string, string> = {
  "/": "培训总览",
  "/question-bank": "题库管理",
  
  "/exam-center": "考试中心",
  "/on-job": "在岗培训",
  "/records": "成绩留档",
};

export default function AppLayout() {
  const { pathname } = useLocation();
  const current = labelMap[pathname] ?? "培训助手";
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="flex items-center gap-3 px-5 h-20 border-b border-sidebar-border">
          <div className="size-10 rounded-xl bg-gradient-primary grid place-items-center shadow-elevated">
            <GraduationCap className="size-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-foreground">人事 AI 员工</div>
            <div className="text-xs text-muted-foreground">HR Intelligence</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <button
            onClick={() => setOpen((v) => !v)}
            className="w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-sidebar-foreground hover:bg-sidebar-accent/60 transition-colors"
          >
            <Sparkles className="size-4 text-primary" />
            <span className="flex-1 text-left">培训助手</span>
            <ChevronDown
              className={`size-4 text-muted-foreground transition-transform ${open ? "" : "-rotate-90"}`}
            />
          </button>

          {open && (
            <ul className="mt-1 space-y-1 pl-3 border-l border-sidebar-border ml-4">
              {menu.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                      }`
                    }
                  >
                    <span className="flex-1">{item.label}</span>
                    {item.dot && <span className="size-1.5 rounded-full bg-primary" />}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-20 flex items-center gap-4 border-b border-border bg-card px-6 md:px-8">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">培训助手</span>
            <ChevronRight className="size-3.5 text-muted-foreground" />
            <span className="font-medium text-foreground">{current}</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 h-10 w-80 rounded-lg border border-border bg-background/60 px-3">
              <Search className="size-4 text-muted-foreground" />
              <input
                placeholder="搜索员工 / 试卷 / 培训节点"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button className="relative size-10 rounded-lg border border-border grid place-items-center hover:bg-accent transition-colors">
              <Bell className="size-4 text-muted-foreground" />
              <span className="absolute top-2 right-2 size-1.5 rounded-full bg-destructive" />
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-border">
              <div className="size-9 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground text-sm font-semibold">
                HR
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="text-sm font-semibold text-foreground">HR 管理员</div>
                <div className="text-xs text-muted-foreground">综合管理部</div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
