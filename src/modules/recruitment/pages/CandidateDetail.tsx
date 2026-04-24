import { AppShell } from "@/shared/AppShell";
import { useParams, Link } from "react-router-dom";
import { candidates, jobs, statusColor, CandidateStatus } from "@/modules/recruitment/data/recruit";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Phone,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  Send,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_OPTIONS: CandidateStatus[] = ["待复筛", "待沟通", "待面试", "已入库", "已淘汰"];

const CandidateDetail = () => {
  const { id } = useParams<{ id: string }>();
  const candidate = candidates.find((c) => c.id === id);
  const job = candidate ? jobs.find((j) => j.id === candidate.jobId) : null;
  const [status, setStatus] = useState<CandidateStatus>(candidate?.status || "待复筛");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState(candidate?.notes || []);

  if (!candidate || !job) {
    return (
      <AppShell breadcrumbs={[{ label: "招聘管理" }]}>
        <div className="p-12 text-center text-muted-foreground">候选人不存在</div>
      </AppShell>
    );
  }

  const addNote = () => {
    if (!note.trim()) return;
    setNotes([{ author: "HR 管理员", at: new Date().toLocaleString("zh-CN"), text: note }, ...notes]);
    setNote("");
    toast.success("备注已添加");
  };

  const updateStatus = (s: CandidateStatus) => {
    setStatus(s);
    toast.success(`状态已更新为：${s}`);
  };

  return (
    <AppShell
      breadcrumbs={[
        { label: "招聘管理" },
        { label: "岗位与 JD", to: "/recruit/jobs" },
        { label: job.title, to: `/recruit/jobs/${job.id}/candidates` },
        { label: candidate.name },
      ]}
    >
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2">
          <Link to={`/recruitment/jobs/${job.id}/candidates`}><ArrowLeft className="w-4 h-4 mr-1" />返回候选人列表</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile card */}
          <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card)] p-6">
            <div className="flex items-start gap-5 flex-wrap">
              <div className="w-20 h-20 rounded-2xl bg-primary-soft text-primary flex items-center justify-center font-bold text-2xl shrink-0">
                {candidate.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h1 className="text-2xl font-bold text-foreground">{candidate.name}</h1>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${statusColor[status]}`}>{status}</span>
                  <span className="text-xs text-muted-foreground">{candidate.id}</span>
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  {candidate.gender} · {candidate.age}岁 · {candidate.yearsExp}年经验 · 应聘 {job.title}
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{candidate.phone}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{candidate.city}</span>
                  <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5" />{candidate.education}</span>
                  <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" />{candidate.currentTitle} @ {candidate.currentCompany}</span>
                </div>
              </div>
              <div className="text-center px-5 py-3 rounded-xl bg-primary-soft">
                <div className="text-3xl font-bold text-primary leading-none">{candidate.matchScore}</div>
                <div className="text-[11px] text-primary mt-1">JD 匹配度</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <SummaryBlock title="亮点" items={candidate.highlights} icon={CheckCircle2} tone="success" />
              <SummaryBlock title="风险点" items={candidate.risks} icon={AlertCircle} tone="warning" />
              <SummaryBlock title="待确认项" items={candidate.toConfirm} icon={HelpCircle} tone="info" />
            </div>

            <div className="mt-6 pt-5 border-t border-border">
              <div className="text-sm font-medium text-foreground mb-2">技能标签</div>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((s) => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-md bg-secondary text-foreground">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card)] p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><Briefcase className="w-4 h-4 text-primary" />工作经历</h2>
            <div className="space-y-5">
              {candidate.experiences.map((e, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5" />
                    {i < candidate.experiences.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="font-medium text-foreground">{e.title} · {e.company}</div>
                      <span className="text-xs text-muted-foreground">{e.period}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{e.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Interview Suggestions */}
          <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card)] p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />沟通 / 面试辅助
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary-soft text-primary">AI 生成</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <QuestionBlock title="HR 面关注点" items={candidate.hrQuestions} tone="primary" />
              <QuestionBlock title="业务面关注点" items={candidate.bizQuestions} tone="info" />
              <QuestionBlock title="建议沟通问题" items={candidate.toConfirm} tone="warning" />
              <QuestionBlock title="面试追问点" items={candidate.followUps} tone="success" />
            </div>
          </div>

          {/* Notes */}
          <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card)] p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-primary" />沟通记录</h2>
            <div className="flex gap-3 mb-5">
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="添加沟通备注、面试反馈..." rows={2} className="flex-1" />
              <Button onClick={addNote} className="self-end"><Send className="w-4 h-4 mr-1" />添加</Button>
            </div>
            <div className="space-y-4">
              {notes.length === 0 && <div className="text-sm text-muted-foreground text-center py-6">暂无备注，开始记录吧</div>}
              {notes.map((n, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold shrink-0">
                    {n.author[0]}
                  </div>
                  <div className="flex-1 bg-secondary/50 rounded-xl px-4 py-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{n.author}</span>
                      <span className="text-xs text-muted-foreground">{n.at}</span>
                    </div>
                    <div className="text-sm text-foreground">{n.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          {/* Status flow */}
          <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card)] p-6">
            <h2 className="font-semibold mb-4">状态流转</h2>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all ${
                    status === s
                      ? "border-primary bg-primary-soft text-primary font-medium"
                      : "border-border hover:border-primary/40 text-foreground"
                  }`}
                >
                  <span>{s}</span>
                  {status === s && <CheckCircle2 className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Job info */}
          <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card)] p-6">
            <h2 className="font-semibold mb-4">关联岗位</h2>
            <div className="text-sm">
              <div className="font-medium text-foreground mb-1">{job.title}</div>
              <div className="text-xs text-muted-foreground mb-3">{job.department} · {job.company}</div>
              <div className="text-xs text-muted-foreground space-y-1.5 pb-3 border-b border-border">
                <div className="flex justify-between"><span>需求人数</span><span className="text-foreground font-medium">{job.headcount}</span></div>
                <div className="flex justify-between"><span>已入职</span><span className="text-foreground font-medium">{job.hired}</span></div>
                <div className="flex justify-between"><span>候选人</span><span className="text-foreground font-medium">{job.candidates}</span></div>
                <div className="flex justify-between"><span>负责人</span><span className="text-foreground font-medium">{job.owner}</span></div>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full mt-4">
                <Link to={`/recruitment/jobs/${job.id}/candidates`}>查看同岗位候选人</Link>
              </Button>
            </div>
          </div>

          {/* Source */}
          <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card)] p-6">
            <h2 className="font-semibold mb-4">简历来源</h2>
            <div className="text-sm text-muted-foreground space-y-2">
              <div className="flex justify-between"><span>来源渠道</span><span className="text-foreground">{candidate.source}</span></div>
              <div className="flex justify-between"><span>入库时间</span><span className="text-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{candidate.uploadedAt}</span></div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

function SummaryBlock({ title, items, icon: Icon, tone }: { title: string; items: string[]; icon: any; tone: "success" | "warning" | "info" }) {
  return (
    <div className={`rounded-xl p-4 bg-${tone}-soft`}>
      <div className={`flex items-center gap-1.5 text-sm font-semibold text-${tone} mb-2`}>
        <Icon className="w-4 h-4" />{title}
        <span className="ml-auto text-xs font-normal opacity-70">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <div className="text-xs text-muted-foreground">无</div>
      ) : (
        <ul className="space-y-1.5">
          {items.map((it) => (
            <li key={it} className="text-xs text-foreground/80 leading-relaxed">· {it}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function QuestionBlock({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className={`text-sm font-semibold text-${tone} mb-3`}>{title}</div>
      {items.length === 0 ? (
        <div className="text-xs text-muted-foreground">暂无建议</div>
      ) : (
        <ol className="space-y-2 text-sm text-foreground/85 list-decimal list-inside marker:text-muted-foreground">
          {items.map((q) => <li key={q} className="leading-relaxed">{q}</li>)}
        </ol>
      )}
    </div>
  );
}

export default CandidateDetail;
