import { AppShell } from "@/shared/AppShell";
import { candidates, jobs, statusColor, CandidateStatus } from "@/modules/recruitment/data/recruit";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const STATUS_TABS: (CandidateStatus | "全部")[] = ["全部", "待复筛", "待沟通", "待面试", "已入库", "已淘汰"];

const CandidateLedger = () => {
  const [tab, setTab] = useState<(typeof STATUS_TABS)[number]>("全部");
  const [q, setQ] = useState("");

  const list = candidates
    .filter((c) => tab === "全部" || c.status === tab)
    .filter((c) => !q || c.name.includes(q) || c.currentCompany.includes(q));

  const counts = STATUS_TABS.reduce((acc, t) => {
    acc[t] = t === "全部" ? candidates.length : candidates.filter((c) => c.status === t).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <AppShell breadcrumbs={[{ label: "招聘管理" }, { label: "候选人台账" }]}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">候选人台账</h1>
        <p className="text-sm text-muted-foreground mt-2">
          全量候选人状态管理 · 共 <span className="font-semibold text-foreground">{candidates.length}</span> 人
        </p>
      </div>

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
              {t} <span className="opacity-70">({counts[t]})</span>
            </button>
          ))}
        </div>
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索姓名 / 公司" className="pl-9 bg-secondary border-0 h-10" />
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-muted-foreground bg-secondary/40">
              <th className="text-left font-medium px-5 py-3">候选人</th>
              <th className="text-left font-medium px-5 py-3">应聘岗位</th>
              <th className="text-left font-medium px-5 py-3">现任职位</th>
              <th className="text-left font-medium px-5 py-3">学历</th>
              <th className="text-center font-medium px-5 py-3">匹配度</th>
              <th className="text-left font-medium px-5 py-3">状态</th>
              <th className="text-left font-medium px-5 py-3">来源</th>
              <th className="text-left font-medium px-5 py-3">入库时间</th>
              <th className="text-left font-medium px-5 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => {
              const job = jobs.find((j) => j.id === c.jobId);
              return (
                <tr key={c.id} className="border-t border-border hover:bg-secondary/30">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-soft text-primary flex items-center justify-center font-semibold text-sm">
                        {c.name[0]}
                      </div>
                      <div>
                        <div className="font-medium text-foreground text-sm">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.gender} · {c.age}岁</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-foreground">{job?.title}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{c.currentTitle}<br /><span className="text-xs">@ {c.currentCompany}</span></td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{c.education}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`font-bold ${c.matchScore >= 85 ? "text-success" : c.matchScore >= 70 ? "text-primary" : "text-muted-foreground"}`}>{c.matchScore}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{c.source}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{c.uploadedAt}</td>
                  <td className="px-5 py-3">
                    <Link to={`/recruitment/candidates/${c.id}`} className="text-primary text-sm font-medium hover:underline">详情</Link>
                  </td>
                </tr>
              );
            })}
            {list.length === 0 && (
              <tr><td colSpan={9} className="text-center py-12 text-muted-foreground text-sm">暂无候选人</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
};

export default CandidateLedger;
