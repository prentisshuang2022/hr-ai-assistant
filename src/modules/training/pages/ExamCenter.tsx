import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/modules/training/components/PageHeader";
import { SectionCard } from "@/modules/training/components/SectionCard";
import { Button } from "@/components/ui/button";
import {
  Calendar, Users, PlayCircle, Clock, CheckCircle2,
  ArrowRight, Send, FileSpreadsheet, ClipboardCheck, Loader2,
} from "lucide-react";
import { toast } from "sonner";

type Step = 1 | 2 | 3 | 4;

export default function ExamCenter() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [grading, setGrading] = useState(false);

  // Step 1: form
  const [name, setName] = useState("2025 Q2 安全生产复训");
  const [paper, setPaper] = useState("安全生产基础知识 · 试卷");
  const [start, setStart] = useState("2025-04-28T14:00");
  const [duration, setDuration] = useState("60");
  const [target, setTarget] = useState("生产部全员（86 人）");

  // Step 2: live data (mock progressive)
  const total = 86;
  const [submitted, setSubmitted] = useState(0);

  const publish = () => {
    toast.success(`已发布：${name}`);
    setStep(2);
    // simulate joining
    setSubmitted(0);
    let n = 0;
    const t = setInterval(() => {
      n += Math.floor(Math.random() * 9) + 4;
      if (n >= total) {
        n = total;
        clearInterval(t);
      }
      setSubmitted(n);
    }, 600);
  };

  const startGrading = () => {
    setStep(3);
    setGrading(true);
    toast.info("AI 正在自动评分…");
    setTimeout(() => {
      setGrading(false);
      toast.success("评分完成，成绩单已生成");
      setStep(4);
    }, 1800);
  };

  const reset = () => {
    setStep(1);
    setSubmitted(0);
  };

  const pct = Math.round((submitted / total) * 100);

  // mock results
  const passed = Math.round(submitted * 0.86);
  const failed = submitted - passed;
  const avg = 87.4;

  return (
    <div className="space-y-6">
      <PageHeader
        title="考试中心"
        subtitle="发布考试 · 在线作答 · AI 自动评分 · 出成绩单"
      />

      {/* Stepper */}
      <div className="flex items-center gap-3">
        {[
          { n: 1, label: "发布考试", icon: Send },
          { n: 2, label: "在线考试", icon: PlayCircle },
          { n: 3, label: "AI 自动评分", icon: ClipboardCheck },
          { n: 4, label: "出成绩单", icon: FileSpreadsheet },
        ].map((s, i) => {
          const active = step === s.n;
          const done = step > s.n;
          return (
            <div key={s.n} className="flex items-center gap-3 flex-1">
              <div
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border flex-1 transition-colors ${
                  active
                    ? "border-primary bg-primary-soft"
                    : done
                    ? "border-success/40 bg-success-soft"
                    : "border-border bg-card"
                }`}
              >
                <div
                  className={`size-8 rounded-lg grid place-items-center text-sm font-semibold ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : done
                      ? "bg-success text-success-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {done ? <CheckCircle2 className="size-4" /> : s.n}
                </div>
                <div className="flex-1">
                  <div
                    className={`text-sm font-medium ${
                      active ? "text-primary" : done ? "text-success" : "text-foreground"
                    }`}
                  >
                    {s.label}
                  </div>
                </div>
                <s.icon
                  className={`size-4 ${
                    active ? "text-primary" : done ? "text-success" : "text-muted-foreground"
                  }`}
                />
              </div>
              {i < 3 && <ArrowRight className="size-4 text-muted-foreground shrink-0" />}
            </div>
          );
        })}
      </div>

      {/* Step 1: publish */}
      {step === 1 && (
        <SectionCard
          title="发布考试"
          subtitle="选择试卷 · 设定时间与对象，一键发布"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Field label="考试名称">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </Field>
            <Field label="试卷">
              <select
                value={paper}
                onChange={(e) => setPaper(e.target.value)}
                className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
              >
                <option>安全生产基础知识 · 试卷</option>
                <option>数据安全月度卷 - 4 月</option>
                <option>新员工合规试卷 v2</option>
              </select>
            </Field>
            <Field label="开始时间">
              <input
                type="datetime-local"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
              />
            </Field>
            <Field label="考试时长（分钟）">
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
              />
            </Field>
            <Field label="参与对象">
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
              >
                <option>生产部全员（86 人）</option>
                <option>财务部全员（24 人）</option>
                <option>全公司（248 人）</option>
              </select>
            </Field>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={publish} className="bg-primary hover:bg-primary/90">
              <Send className="size-4 mr-1.5" />发布考试
            </Button>
          </div>
        </SectionCard>
      )}

      {/* Step 2: ongoing */}
      {step === 2 && (
        <SectionCard
          title="在线考试进行中"
          subtitle={`${name} · ${target}`}
          actions={
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-info-soft text-info">
              <span className="size-1.5 rounded-full bg-info animate-pulse" />进行中
            </span>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricBox icon={Users} label="已交卷" value={`${submitted}`} unit={`/ ${total}`} tone="primary" />
            <MetricBox icon={Clock} label="剩余时长" value={duration} unit="分钟" tone="info" />
            <MetricBox icon={Calendar} label="开始时间" value={start.replace("T", " ")} tone="warning" />
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">作答进度</span>
              <span className="font-medium text-foreground">{pct}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={reset}>取消考试</Button>
            <Button
              onClick={startGrading}
              disabled={submitted < total}
              className="bg-primary hover:bg-primary/90"
            >
              {submitted < total ? `等待全员交卷（${submitted}/${total}）` : (
                <>结束考试，开始 AI 评分<ArrowRight className="size-4 ml-1.5" /></>
              )}
            </Button>
          </div>
        </SectionCard>
      )}

      {/* Step 3: grading */}
      {step === 3 && (
        <SectionCard title="AI 自动评分" subtitle="客观题自动判分 · 主观题智能打分">
          <div className="py-12 grid place-items-center text-center">
            <div className="size-16 rounded-2xl bg-primary-soft grid place-items-center mb-4">
              {grading ? (
                <Loader2 className="size-8 text-primary animate-spin" />
              ) : (
                <CheckCircle2 className="size-8 text-success" />
              )}
            </div>
            <div className="text-base font-semibold text-foreground">
              {grading ? "AI 正在评阅 " + total + " 份答卷…" : "评分完成"}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {grading ? "预计 1-2 分钟，可离开页面，完成后将通知" : "成绩单已生成"}
            </div>
          </div>
        </SectionCard>
      )}

      {/* Step 4: results */}
      {step === 4 && (
        <SectionCard
          title="成绩单"
          subtitle={`${name} · 已生成 ${total} 份成绩`}
          actions={
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="size-4 mr-1.5" />导出 Excel
            </Button>
          }
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricBox icon={Users} label="参考人数" value={`${total}`} unit="人" tone="primary" />
            <MetricBox icon={CheckCircle2} label="合格" value={`${passed}`} unit="人" tone="success" />
            <MetricBox icon={Clock} label="不合格" value={`${failed}`} unit="人" tone="warning" />
            <MetricBox icon={FileSpreadsheet} label="平均分" value={`${avg}`} tone="info" />
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr className="text-left">
                  <th className="font-medium px-4 py-3">姓名</th>
                  <th className="font-medium px-4 py-3">部门</th>
                  <th className="font-medium px-4 py-3">交卷时间</th>
                  <th className="font-medium px-4 py-3">分数</th>
                  <th className="font-medium px-4 py-3">结果</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "张伟", dept: "生产一部", time: "14:32", score: 92, pass: true },
                  { name: "李娜", dept: "生产一部", time: "14:35", score: 88, pass: true },
                  { name: "王强", dept: "生产二部", time: "14:38", score: 76, pass: true },
                  { name: "赵敏", dept: "生产二部", time: "14:40", score: 58, pass: false },
                  { name: "陈杰", dept: "生产三部", time: "14:42", score: 95, pass: true },
                ].map((r) => (
                  <tr key={r.name} className="border-t border-border hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.dept}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.time}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">{r.score}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${
                          r.pass ? "bg-success-soft text-success" : "bg-warning-soft text-warning"
                        }`}
                      >
                        {r.pass ? "合格" : "不合格"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={reset}>再发布一场</Button>
            <Button
              onClick={() => navigate("/training/records")}
              className="bg-primary hover:bg-primary/90"
            >
              归档至成绩留档<ArrowRight className="size-4 ml-1.5" />
            </Button>
          </div>
        </SectionCard>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function MetricBox({
  icon: Icon,
  label,
  value,
  unit,
  tone = "primary",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  unit?: string;
  tone?: "primary" | "info" | "success" | "warning";
}) {
  const toneCls = {
    primary: "bg-primary-soft text-primary",
    info: "bg-info-soft text-info",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
  }[tone];
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <div className={`size-8 rounded-lg grid place-items-center ${toneCls}`}>
          <Icon className="size-4" />
        </div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-xl font-semibold text-foreground">{value}</span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}
