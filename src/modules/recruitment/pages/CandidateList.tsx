import { AppShell } from "@/shared/AppShell";
import { useParams, Link } from "react-router-dom";
import { jobs, candidates, statusColor, CandidateStatus } from "@/modules/recruitment/data/recruit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

const STATUS_TABS: (CandidateStatus | "全部")[] = ["全部", "待复筛", "待沟通", "待面试", "已入库", "已淘汰"];

const CandidateList = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [tab, setTab] = useState<(typeof STATUS_TABS)[number]>("全部");
  const [q, setQ] = useState("");

  const job = jobs.find((j) => j.id === jobId);
  const list = candidates
    .filter((c) => c.jobId === jobId)
    .filter((c) => tab === "全部" || c.status === tab)
    .filter((c) => !q || c.name.includes(q) || c.currentCompany.includes(q));

  if (!job) {
    return (
      <AppShell breadcrumbs={[{ label: "招聘管理" }]}>
        <div className="p-12 text-center text-muted-foreground">岗位不存在</div>
      </AppShell>
    );
  }

  const counts = STATUS_TABS.reduce((acc, t) => {
    acc[t] = t === "全部" ? candidates.filter((c) => c.jobId === jobId).length : candidates.filter((c) => c.jobId === jobId && c.status === t).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <AppShell breadcrumbs={[{ label: "招聘管理" }, { label: "岗位与 JD", to: "/recruit/jobs" }, { label: job.title }]}>
      {/* Job header */}
      <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card)] p-6 mb-6">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{job.title}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>{job.id}</span>
              <span>· {job.department}</span>
              <span>· {job.company} / {job.location}</span>
              <span>· 招聘负责人：{job.owner}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="text-center px-4">
              <div className="text-2xl font-bold text-foreground">{job.headcount}</div>
              <div className="text-xs text-muted-foreground">需求</div>
            </div>
            <div className="text-center px-4 border-l border-border">
              <div className="text-2xl font-bold text-success">{job.hired}</div>
              <div className="text-xs text-muted-foreground">已入职</div>
            </div>
            <div className="text-center px-4 border-l border-border">
              <div className="text-2xl font-bold text-primary">{job.candidates}</div>
              <div className="text-xs text-muted-foreground">候选人</div>
            </div>
          </div>
        </div>
        <details className="mt-5">
          <summary className="text-sm text-primary cursor-pointer hover:underline">查看 JD 详情</summary>
          <div className="mt-3 p-4 rounded-xl bg-secondary/60 text-sm text-foreground whitespace-pre-line">{job.jd}</div>
        </details>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card)] p-4 mb-5">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          {STATUS_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {t} <span className="opacity-70">({counts[t] || 0})</span>
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索姓名 / 公司" className="pl-9 bg-secondary border-0 h-10" />
          </div>
          <Button variant="outline"><Filter className="w-4 h-4 mr-2" />更多筛选</Button>
        </div>
      </div>

      {/* Candidate cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {list.map((c) => (
          <Link
            to={`/recruitment/candidates/${c.id}`}
            key={c.id}
            className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card)] p-5 hover:border-primary/40 hover:shadow-[var(--shadow-pop)] transition-all flex flex-col"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-soft text-primary flex items-center justify-center font-semibold shrink-0 text-lg">
                {c.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-foreground">{c.name}</span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${statusColor[c.status]}`}>{c.status}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{c.gender} · {c.age}岁 · {c.city} · {c.yearsExp}年经验</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-bold text-primary leading-none">{c.matchScore}</div>
                <div className="text-[10px] text-muted-foreground mt-1">匹配</div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground space-y-1 mb-3">
              <div>{c.currentTitle} @ {c.currentCompany}</div>
              <div>{c.education} · {c.major}</div>
            </div>

            <div className="space-y-1.5 mb-3">
              {c.highlights.slice(0, 2).map((h) => (
                <div key={h} className="text-[11px] text-success flex items-start gap-1.5">
                  <CheckCircle2 className="w-3 h-3 shrink-0 mt-0.5" /> <span className="line-clamp-1">{h}</span>
                </div>
              ))}
              {c.risks.slice(0, 1).map((r) => (
                <div key={r} className="text-[11px] text-warning flex items-start gap-1.5">
                  <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" /> <span className="line-clamp-1">{r}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
              <span className="text-[11px] text-muted-foreground">{c.source} · {c.uploadedAt}</span>
              <span className="text-xs text-primary font-medium flex items-center gap-1">查看卡片 <ArrowRight className="w-3 h-3" /></span>
            </div>
          </Link>
        ))}
        {list.length === 0 && (
          <div className="col-span-full bg-card rounded-2xl border border-border p-12 text-center text-muted-foreground text-sm">
            暂无符合条件的候选人
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default CandidateList;
