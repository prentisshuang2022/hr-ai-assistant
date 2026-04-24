import { AppShell } from "@/shared/AppShell";
import { jobs, candidates, jobStatusColor } from "@/modules/recruitment/data/recruit";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Users,
  FileText,
  Sparkles,
  TrendingUp,
  Plus,
  Upload,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

const RecruitDashboard = () => {
  const openJobs = jobs.filter((j) => j.status === "招聘中");
  const totalCandidates = candidates.length;
  const newToday = candidates.filter((c) => c.uploadedAt >= "2025-04-19").length;
  const interviewing = candidates.filter((c) => c.status === "待面试").length;

  const stats = [
    { label: "在招岗位", value: openJobs.length, sub: `共 ${jobs.length} 个`, icon: Briefcase, tone: "primary" },
    { label: "活跃候选人", value: totalCandidates, sub: `本周新增 ${newToday}`, icon: Users, tone: "info" },
    { label: "待面试", value: interviewing, sub: "需要尽快安排", icon: Clock, tone: "warning" },
    { label: "AI 解析简历", value: 142, sub: "本月已处理", icon: Sparkles, tone: "success" },
  ];

  return (
    <AppShell breadcrumbs={[{ label: "招聘管理" }, { label: "招聘助理首页" }]}>
      {/* Hero */}
      <div className="rounded-2xl p-8 mb-6 text-primary-foreground relative overflow-hidden" style={{ background: "var(--gradient-brand)" }}>
        <div className="relative z-10 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="text-sm opacity-90 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> AI 招聘助理
            </div>
            <h1 className="text-3xl font-bold mb-2">下午好，HR 管理员 👋</h1>
            <p className="opacity-90">今天有 {newToday} 份新简历待复筛，{interviewing} 位候选人等待安排面试</p>
          </div>
          <div className="flex gap-3">
            <Button asChild size="lg" variant="secondary" className="bg-white/15 hover:bg-white/25 text-primary-foreground border-0 backdrop-blur">
              <Link to="/recruitment/jobs/new"><Plus className="w-4 h-4 mr-2" />新建岗位</Link>
            </Button>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/95">
              <Link to="/recruitment/resumes"><Upload className="w-4 h-4 mr-2" />上传简历</Link>
            </Button>
          </div>
        </div>
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -right-8 -bottom-20 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-2xl border border-border p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-start justify-between mb-3">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-${s.tone}-soft text-${s.tone}`}>
                <s.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job overview */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-[var(--shadow-card)]">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">岗位总览</h2>
              <p className="text-sm text-muted-foreground mt-0.5">实时进度与候选人储备</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/recruitment/jobs">查看全部 <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>
          <div className="divide-y divide-border">
            {jobs.slice(0, 5).map((job) => {
              const progress = (job.hired / job.headcount) * 100;
              return (
                <Link
                  key={job.id}
                  to={`/recruitment/jobs/${job.id}/candidates`}
                  className="p-5 flex items-center gap-5 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground">{job.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${jobStatusColor[job.status]}`}>{job.status}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{job.department} · {job.company} · {job.location}</div>
                  </div>
                  <div className="hidden md:block w-32">
                    <div className="text-xs text-muted-foreground mb-1.5 flex justify-between">
                      <span>进度</span>
                      <span className="font-medium text-foreground">{job.hired}/{job.headcount}</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-bold text-foreground">{job.candidates}</div>
                    <div className="text-xs text-muted-foreground">候选人 {job.newResumes > 0 && <span className="text-primary">+{job.newResumes}</span>}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick actions */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card)] p-6">
            <h2 className="text-lg font-semibold mb-4">快捷入口</h2>
            <div className="space-y-3">
              {[
                { icon: FileText, label: "AI 生成 JD", desc: "一句话生成专业职位描述", to: "/recruitment/jobs/new", tone: "primary" },
                { icon: Upload, label: "上传简历", desc: "批量解析并入库", to: "/recruitment/resumes", tone: "info" },
                { icon: Users, label: "候选人台账", desc: "全量候选人状态管理", to: "/recruitment/candidates", tone: "success" },
              ].map((a) => (
                <Link
                  key={a.label}
                  to={a.to}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary hover:bg-primary-soft transition-all group"
                >
                  <div className={`w-10 h-10 rounded-lg bg-${a.tone}-soft text-${a.tone} flex items-center justify-center shrink-0`}>
                    <a.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground text-sm">{a.label}</div>
                    <div className="text-xs text-muted-foreground truncate">{a.desc}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">本周招聘动态</h2>
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
            <div className="space-y-4">
              {[
                { dot: "primary", text: "陈思远 已进入技术面阶段", time: "2 小时前" },
                { dot: "success", text: "财务分析专员 招聘已完成", time: "昨天" },
                { dot: "info", text: "AI 新解析 6 份简历入库", time: "今天 09:12" },
                { dot: "warning", text: "市场推广经理 急需补人", time: "1 天前" },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={`w-2 h-2 rounded-full bg-${a.dot} mt-1.5 shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-foreground">{a.text}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default RecruitDashboard;
