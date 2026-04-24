import { AppShell } from "@/shared/AppShell";
import { jobs, jobStatusColor } from "@/modules/recruitment/data/recruit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Briefcase, MapPin, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const JobsList = () => {
  const [q, setQ] = useState("");
  const filtered = jobs.filter(
    (j) => !q || j.title.includes(q) || j.department.includes(q) || j.company.includes(q),
  );

  return (
    <AppShell breadcrumbs={[{ label: "招聘管理" }, { label: "岗位与 JD" }]}>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">岗位与 JD 管理</h1>
          <p className="text-sm text-muted-foreground mt-2">
            共 <span className="font-semibold text-foreground">{jobs.length}</span> 个岗位 ·{" "}
            <span className="font-semibold text-foreground">{jobs.filter((j) => j.status === "招聘中").length}</span> 招聘中
          </p>
        </div>
        <Button asChild size="lg">
          <Link to="/recruitment/jobs/new"><Plus className="w-4 h-4 mr-2" />新建岗位 / 生成 JD</Link>
        </Button>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card)] p-4 mb-5">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索岗位 / 部门 / 公司" className="pl-9 bg-secondary border-0 h-10" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((job) => {
          const progress = (job.hired / job.headcount) * 100;
          return (
            <div key={job.id} className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card)] p-5 flex flex-col hover:border-primary/40 hover:shadow-[var(--shadow-pop)] transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground text-base truncate">{job.title}</h3>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap ${jobStatusColor[job.status]}`}>{job.status}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{job.id}</div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2"><Briefcase className="w-3.5 h-3.5" /> {job.department}</div>
                <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {job.company} · {job.location}</div>
                <div className="flex items-center gap-2"><User className="w-3.5 h-3.5" /> 招聘负责人：{job.owner}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-secondary/60 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">招聘进度</div>
                  <div className="font-semibold text-foreground">{job.hired} / {job.headcount}</div>
                  <div className="h-1 bg-background rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <div className="bg-secondary/60 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">候选人</div>
                  <div className="font-semibold text-foreground">
                    {job.candidates} {job.newResumes > 0 && <span className="text-primary text-xs ml-1">+{job.newResumes}</span>}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-2">本周新增</div>
                </div>
              </div>

              <Button asChild variant="outline" className="w-full mt-auto group">
                <Link to={`/recruitment/jobs/${job.id}/candidates`}>查看候选人 <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" /></Link>
              </Button>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
};

export default JobsList;
