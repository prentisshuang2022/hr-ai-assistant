import { useMemo, useState } from "react";
import { PageHeader } from "@/modules/training/components/PageHeader";
import { SectionCard } from "@/modules/training/components/SectionCard";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  Archive, FileDown, Search, ArrowRight, CheckCircle2,
  ClipboardCheck, Workflow, FolderArchive, Loader2, Eye, User,
  Sparkles, FileText, TrendingUp, Calendar, Building2, BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";

type Step = 1 | 2 | 3 | 4;
type SourceKey = "exam" | "onjob";
type ViewMode = "record" | "employee";

type ExamSource = {
  id: string;
  name: string;
  date: string;
  count: number;
  pass: number;
  avg: number;
};

type OnJobSource = {
  id: string;
  trainee: string;
  post: string;
  nodes: number;
  records: number;
  finished: string;
};

type ArchiveRow = {
  name: string;
  emp: string;
  dept: string;
  source: string;
  type: "考试" | "在岗";
  score: string;
  level: "优秀" | "良好" | "合格" | "不合格";
  time: string;
};

const examSources: ExamSource[] = [
  { id: "EX-2025-042", name: "2025 Q2 安全生产复训", date: "2025-04-22", count: 86, pass: 81, avg: 87.4 },
  { id: "EX-2025-041", name: "数据安全意识月度考试", date: "2025-04-19", count: 142, pass: 128, avg: 84.2 },
  { id: "EX-2025-040", name: "新员工入职合规培训", date: "2025-04-20", count: 12, pass: 12, avg: 92.1 },
];

const onjobSources: OnJobSource[] = [
  { id: "OJ-2025-018", trainee: "李明轩", post: "客服岗", nodes: 4, records: 12, finished: "2025-04-21" },
  { id: "OJ-2025-017", trainee: "王思雨", post: "销售岗", nodes: 5, records: 18, finished: "2025-04-19" },
];

const archived: ArchiveRow[] = [
  { name: "周心怡", emp: "E2024031", dept: "生产部", source: "2025 Q2 安全生产复训", type: "考试", score: "96", level: "优秀", time: "2025-04-22 15:24" },
  { name: "周心怡", emp: "E2024031", dept: "生产部", source: "2025 Q1 安全生产复训", type: "考试", score: "89", level: "良好", time: "2025-01-18 10:12" },
  { name: "周心怡", emp: "E2024031", dept: "生产部", source: "数据安全意识月度", type: "考试", score: "82", level: "良好", time: "2024-11-20 14:00" },
  { name: "张晓东", emp: "E2024018", dept: "生产部", source: "2025 Q2 安全生产复训", type: "考试", score: "88", level: "良好", time: "2025-04-22 15:18" },
  { name: "张晓东", emp: "E2024018", dept: "生产部", source: "2025 Q1 安全生产复训", type: "考试", score: "76", level: "合格", time: "2025-01-18 10:08" },
  { name: "李明轩", emp: "E2025008", dept: "客服部", source: "客服岗在岗培训", type: "在岗", score: "通过", level: "合格", time: "2025-04-21 18:00" },
  { name: "李明轩", emp: "E2025008", dept: "客服部", source: "新员工入职合规培训", type: "考试", score: "85", level: "良好", time: "2025-03-12 09:30" },
  { name: "马一凡", emp: "E2025002", dept: "综合管理部", source: "新员工入职合规培训", type: "考试", score: "92", level: "优秀", time: "2025-04-20 11:02" },
  { name: "刘敏", emp: "E2023045", dept: "财务部", source: "数据安全意识月度", type: "考试", score: "78", level: "合格", time: "2025-04-19 16:48" },
  { name: "刘敏", emp: "E2023045", dept: "财务部", source: "2024 Q4 财务合规", type: "考试", score: "91", level: "优秀", time: "2024-12-10 15:20" },
  { name: "黄子轩", emp: "E2024027", dept: "技术部", source: "数据安全意识月度", type: "考试", score: "65", level: "不合格", time: "2025-04-19 14:30" },
];

const levelTone: Record<string, string> = {
  "优秀": "bg-success-soft text-success",
  "良好": "bg-info-soft text-info",
  "合格": "bg-warning-soft text-warning",
  "不合格": "bg-destructive/10 text-destructive",
};

export default function Records() {
  const [step, setStep] = useState<Step>(4);
  const [sourceKey, setSourceKey] = useState<SourceKey>("exam");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [archiving, setArchiving] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("record");
  const [detail, setDetail] = useState<ArchiveRow | null>(null);
  const [empDetail, setEmpDetail] = useState<string | null>(null);

  const goPickSource = () => {
    setStep(1);
    setSelectedId(null);
  };

  const next = () => {
    if (!selectedId) {
      toast.error("请选择一个来源");
      return;
    }
    setStep(2);
  };

  const archive = () => {
    setArchiving(true);
    toast.info("正在归档…");
    setTimeout(() => {
      setArchiving(false);
      setStep(3);
      toast.success("已永久留档");
    }, 1200);
  };

  const filtered = archived.filter(
    (r) =>
      !keyword ||
      r.name.includes(keyword) ||
      r.emp.includes(keyword) ||
      r.source.includes(keyword)
  );

  // Aggregate by employee
  const employees = useMemo(() => {
    const map = new Map<string, {
      name: string; emp: string; dept: string;
      records: ArchiveRow[];
    }>();
    for (const r of filtered) {
      const cur = map.get(r.emp);
      if (cur) cur.records.push(r);
      else map.set(r.emp, { name: r.name, emp: r.emp, dept: r.dept, records: [r] });
    }
    return Array.from(map.values()).map((e) => {
      const numericScores = e.records
        .map((r) => Number(r.score))
        .filter((n) => !isNaN(n));
      const avg = numericScores.length
        ? Math.round((numericScores.reduce((a, b) => a + b, 0) / numericScores.length) * 10) / 10
        : null;
      const passCount = e.records.filter((r) => r.level !== "不合格").length;
      const passRate = Math.round((passCount / e.records.length) * 100);
      const latest = e.records
        .slice()
        .sort((a, b) => b.time.localeCompare(a.time))[0];
      return { ...e, avg, passRate, total: e.records.length, latest };
    });
  }, [filtered]);

  const selectedEmployee = useMemo(
    () => employees.find((e) => e.emp === empDetail) ?? null,
    [employees, empDetail]
  );

  const selectedExam = examSources.find((e) => e.id === selectedId);
  const selectedOnjob = onjobSources.find((o) => o.id === selectedId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="成绩留档"
        subtitle="选择来源 · 归档预览 · 永久留档 · 查询导出"
        actions={
          step === 4 ? (
            <Button onClick={goPickSource} className="bg-primary hover:bg-primary/90">
              <Archive className="size-4 mr-1.5" />新增归档
            </Button>
          ) : null
        }
      />

      {/* Stepper */}
      <div className="flex items-center gap-3">
        {[
          { n: 1, label: "选择来源", icon: ClipboardCheck },
          { n: 2, label: "归档预览", icon: Eye },
          { n: 3, label: "永久留档", icon: FolderArchive },
          { n: 4, label: "查询 / 导出", icon: Search },
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

      {/* Step 1: 选择来源 */}
      {step === 1 && (
        <SectionCard
          title="选择待归档来源"
          subtitle="支持考试中心成绩单 / 在岗培训档案"
        >
          <div className="flex bg-muted rounded-lg p-0.5 text-sm w-fit mb-5">
            {[
              { k: "exam" as SourceKey, label: "离岗考试", icon: ClipboardCheck },
              { k: "onjob" as SourceKey, label: "在岗培训", icon: Workflow },
            ].map((t) => (
              <button
                key={t.k}
                onClick={() => {
                  setSourceKey(t.k);
                  setSelectedId(null);
                }}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md font-medium transition-colors ${
                  sourceKey === t.k
                    ? "bg-card text-foreground shadow-card"
                    : "text-muted-foreground"
                }`}
              >
                <t.icon className="size-4" />
                {t.label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {sourceKey === "exam" &&
              examSources.map((e) => {
                const checked = selectedId === e.id;
                return (
                  <label
                    key={e.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                      checked
                        ? "border-primary bg-primary-soft"
                        : "border-border bg-card hover:bg-muted/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="src"
                      checked={checked}
                      onChange={() => setSelectedId(e.id)}
                      className="size-4 accent-primary"
                    />
                    <div className="size-10 rounded-lg bg-info-soft text-info grid place-items-center shrink-0">
                      <ClipboardCheck className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground truncate">{e.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {e.id} · {e.date}
                      </div>
                    </div>
                    <div className="hidden sm:flex gap-6 text-sm">
                      <Mini label="参考" value={`${e.count}`} unit="人" />
                      <Mini label="合格" value={`${e.pass}`} unit="人" />
                      <Mini label="均分" value={`${e.avg}`} />
                    </div>
                  </label>
                );
              })}
            {sourceKey === "onjob" &&
              onjobSources.map((o) => {
                const checked = selectedId === o.id;
                return (
                  <label
                    key={o.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                      checked
                        ? "border-primary bg-primary-soft"
                        : "border-border bg-card hover:bg-muted/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="src"
                      checked={checked}
                      onChange={() => setSelectedId(o.id)}
                      className="size-4 accent-primary"
                    />
                    <div className="size-10 rounded-lg bg-purple-soft text-purple grid place-items-center shrink-0">
                      <Workflow className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground truncate">
                        {o.trainee} · {o.post}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {o.id} · 完成于 {o.finished}
                      </div>
                    </div>
                    <div className="hidden sm:flex gap-6 text-sm">
                      <Mini label="节点" value={`${o.nodes}`} unit="个" />
                      <Mini label="记录" value={`${o.records}`} unit="条" />
                    </div>
                  </label>
                );
              })}
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={() => setStep(4)}>取消</Button>
            <Button onClick={next} className="bg-primary hover:bg-primary/90">
              下一步：归档预览<ArrowRight className="size-4 ml-1.5" />
            </Button>
          </div>
        </SectionCard>
      )}

      {/* Step 2: 归档预览 */}
      {step === 2 && (
        <SectionCard title="归档预览" subtitle="确认无误后即可永久留档">
          <div className="rounded-xl border border-border bg-gradient-soft p-5 mb-5">
            {selectedExam && (
              <>
                <div className="text-base font-semibold text-foreground">{selectedExam.name}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  来源编号 {selectedExam.id} · 考试日期 {selectedExam.date}
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Mini label="参考人数" value={`${selectedExam.count}`} unit="人" boxed />
                  <Mini label="合格人数" value={`${selectedExam.pass}`} unit="人" boxed />
                  <Mini
                    label="合格率"
                    value={`${Math.round((selectedExam.pass / selectedExam.count) * 100)}`}
                    unit="%"
                    boxed
                  />
                  <Mini label="平均分" value={`${selectedExam.avg}`} boxed />
                </div>
              </>
            )}
            {selectedOnjob && (
              <>
                <div className="text-base font-semibold text-foreground">
                  {selectedOnjob.trainee} · {selectedOnjob.post}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  来源编号 {selectedOnjob.id} · 完成日期 {selectedOnjob.finished}
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Mini label="完成节点" value={`${selectedOnjob.nodes}`} unit="个" boxed />
                  <Mini label="培训记录" value={`${selectedOnjob.records}`} unit="条" boxed />
                  <Mini label="档案状态" value="待归档" boxed />
                </div>
              </>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            归档后将永久写入员工培训档案，可追溯、可查询、可导出。
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>返回选择</Button>
            <Button
              onClick={archive}
              disabled={archiving}
              className="bg-primary hover:bg-primary/90"
            >
              {archiving ? (
                <><Loader2 className="size-4 mr-1.5 animate-spin" />归档中…</>
              ) : (
                <><FolderArchive className="size-4 mr-1.5" />确认永久留档</>
              )}
            </Button>
          </div>
        </SectionCard>
      )}

      {/* Step 3: 留档完成 */}
      {step === 3 && (
        <SectionCard title="留档完成" subtitle="档案已写入员工培训记录">
          <div className="py-8 grid place-items-center text-center">
            <div className="size-16 rounded-2xl bg-success-soft grid place-items-center mb-4">
              <CheckCircle2 className="size-8 text-success" />
            </div>
            <div className="text-base font-semibold text-foreground">
              已永久留档
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              可在档案库查询并导出
            </div>
            <div className="mt-6 flex gap-2">
              <Button variant="outline" onClick={goPickSource}>继续归档</Button>
              <Button onClick={() => setStep(4)} className="bg-primary hover:bg-primary/90">
                查看档案库<ArrowRight className="size-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Step 4: 档案库 */}
      {step === 4 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <KpiBox icon={Archive} label="累计成绩档案" value="3,842" unit="条" tone="primary" />
            <KpiBox icon={User} label="覆盖员工" value="248" unit="人" tone="info" />
            <KpiBox icon={CheckCircle2} label="平均合格率" value="92.4" unit="%" tone="success" />
            <KpiBox icon={FolderArchive} label="本月新增" value="126" unit="条" tone="warning" />
          </div>

          <SectionCard
            title="成绩档案库"
            subtitle="自动归档 · 永久可追溯"
            actions={
              <div className="flex items-center gap-2">
                <div className="flex bg-muted rounded-lg p-0.5 text-sm">
                  {[
                    { k: "record" as ViewMode, label: "按记录", icon: FileText },
                    { k: "employee" as ViewMode, label: "按员工", icon: User },
                  ].map((t) => (
                    <button
                      key={t.k}
                      onClick={() => setViewMode(t.k)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                        viewMode === t.k
                          ? "bg-card text-foreground shadow-card"
                          : "text-muted-foreground"
                      }`}
                    >
                      <t.icon className="size-3.5" />
                      {t.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 h-9 w-56 rounded-lg border border-border px-3 bg-background">
                  <Search className="size-4 text-muted-foreground" />
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="搜索员工 / 工号 / 考试"
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <FileDown className="size-4 mr-1.5" />导出
                </Button>
              </div>
            }
          >
            {viewMode === "record" && (
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr className="text-left">
                      <th className="font-medium px-4 py-3">员工</th>
                      <th className="font-medium px-4 py-3">工号</th>
                      <th className="font-medium px-4 py-3">部门</th>
                      <th className="font-medium px-4 py-3">来源</th>
                      <th className="font-medium px-4 py-3">类型</th>
                      <th className="font-medium px-4 py-3">成绩</th>
                      <th className="font-medium px-4 py-3">等级</th>
                      <th className="font-medium px-4 py-3">归档时间</th>
                      <th className="font-medium px-4 py-3 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r, idx) => (
                      <tr
                        key={r.emp + r.source + idx}
                        className="border-t border-border hover:bg-muted/30 cursor-pointer"
                        onClick={() => setDetail(r)}
                      >
                        <td className="px-4 py-3 font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            <div className="size-8 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground text-xs font-semibold">
                              {r.name[0]}
                            </div>
                            {r.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{r.emp}</td>
                        <td className="px-4 py-3 text-muted-foreground">{r.dept}</td>
                        <td className="px-4 py-3 text-foreground">{r.source}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${
                              r.type === "考试"
                                ? "bg-info-soft text-info"
                                : "bg-purple-soft text-purple"
                            }`}
                          >
                            {r.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-foreground">{r.score}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${levelTone[r.level]}`}
                          >
                            {r.level}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{r.time}</td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDetail(r);
                            }}
                          >
                            <Eye className="size-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                          未找到匹配的档案
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {viewMode === "employee" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {employees.map((e) => (
                  <button
                    key={e.emp}
                    onClick={() => setEmpDetail(e.emp)}
                    className="text-left rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-card transition-all p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-11 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-semibold">
                        {e.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground">{e.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {e.emp} · {e.dept}
                        </div>
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground" />
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <Mini label="档案数" value={`${e.total}`} unit="条" boxed />
                      <Mini label="平均分" value={e.avg !== null ? `${e.avg}` : "—"} boxed />
                      <Mini label="合格率" value={`${e.passRate}`} unit="%" boxed />
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="size-3.5" />
                      最近归档：{e.latest.time}
                    </div>
                  </button>
                ))}
                {employees.length === 0 && (
                  <div className="col-span-full py-8 text-center text-muted-foreground text-sm">
                    未找到匹配的员工
                  </div>
                )}
              </div>
            )}
          </SectionCard>
        </>
      )}

      {/* 档案详情抽屉 */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <FileText className="size-5 text-primary" />
                  档案详情
                </SheetTitle>
                <SheetDescription>
                  {detail.source} · {detail.time}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-5">
                <div className="rounded-xl bg-gradient-soft border border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-semibold">
                      {detail.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{detail.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {detail.emp} · {detail.dept}
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-2xl font-bold text-foreground">{detail.score}</div>
                      <span
                        className={`inline-flex mt-1 px-2 py-0.5 rounded-md text-xs font-medium ${levelTone[detail.level]}`}
                      >
                        {detail.level}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <DetailRow icon={ClipboardCheck} label="档案类型" value={detail.type === "考试" ? "离岗考试" : "在岗培训"} />
                  <DetailRow icon={Building2} label="所属部门" value={detail.dept} />
                  <DetailRow icon={BadgeCheck} label="等级" value={detail.level} />
                  <DetailRow icon={Calendar} label="归档时间" value={detail.time} />
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {detail.type === "考试" ? "原始试卷" : "培训过程记录"}
                  </div>
                  <div className="rounded-lg border border-border bg-card p-3 space-y-2">
                    {detail.type === "考试" ? (
                      <>
                        <RecordLine label="单选题" value="20/22 正确" />
                        <RecordLine label="多选题" value="8/10 正确" />
                        <RecordLine label="判断题" value="9/10 正确" />
                        <RecordLine label="主观题" value="AI 评分 18/20" />
                      </>
                    ) : (
                      <>
                        <RecordLine label="入岗培训" value="✓ 完成 2025-03-21" />
                        <RecordLine label="实操观察" value="✓ 完成 2025-04-05" />
                        <RecordLine label="导师评价" value="✓ 完成 2025-04-15" />
                        <RecordLine label="考核评分" value="✓ 通过 2025-04-21" />
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-primary" />AI 评分依据
                  </div>
                  <div className="rounded-lg border border-primary/30 bg-primary-soft p-3 text-sm text-foreground leading-relaxed">
                    答题完整度高，关键风险点（应急处置、PPE 使用规范）回答准确；
                    主观题表述清晰、覆盖核心要点 4/5。建议加强"事故上报流程"
                    相关知识点的复训。
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1">
                    <FileDown className="size-4 mr-1.5" />导出 PDF
                  </Button>
                  <Button className="flex-1 bg-primary hover:bg-primary/90">
                    <FolderArchive className="size-4 mr-1.5" />查看完整档案
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* 员工聚合详情抽屉 */}
      <Sheet open={!!selectedEmployee} onOpenChange={(o) => !o && setEmpDetail(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selectedEmployee && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <User className="size-5 text-primary" />
                  个人培训档案
                </SheetTitle>
                <SheetDescription>
                  {selectedEmployee.name} · {selectedEmployee.emp} · {selectedEmployee.dept}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-5">
                <div className="grid grid-cols-3 gap-2">
                  <Mini label="档案总数" value={`${selectedEmployee.total}`} unit="条" boxed />
                  <Mini
                    label="平均分"
                    value={selectedEmployee.avg !== null ? `${selectedEmployee.avg}` : "—"}
                    boxed
                  />
                  <Mini label="合格率" value={`${selectedEmployee.passRate}`} unit="%" boxed />
                </div>

                {/* 成长曲线 */}
                <div>
                  <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                    <TrendingUp className="size-3.5 text-primary" />成绩成长曲线
                  </div>
                  <GrowthChart records={selectedEmployee.records} />
                </div>

                {/* 完整培训档案 */}
                <div>
                  <div className="text-xs text-muted-foreground mb-2">完整培训档案</div>
                  <div className="space-y-2">
                    {selectedEmployee.records
                      .slice()
                      .sort((a, b) => b.time.localeCompare(a.time))
                      .map((r, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setEmpDetail(null);
                            setTimeout(() => setDetail(r), 150);
                          }}
                          className="w-full text-left flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
                        >
                          <div
                            className={`size-9 rounded-lg grid place-items-center shrink-0 ${
                              r.type === "考试"
                                ? "bg-info-soft text-info"
                                : "bg-purple-soft text-purple"
                            }`}
                          >
                            {r.type === "考试" ? (
                              <ClipboardCheck className="size-4" />
                            ) : (
                              <Workflow className="size-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground truncate">
                              {r.source}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {r.time}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-foreground text-sm">{r.score}</div>
                            <span
                              className={`inline-flex mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium ${levelTone[r.level]}`}
                            >
                              {r.level}
                            </span>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1">
                    <FileDown className="size-4 mr-1.5" />导出个人档案
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function GrowthChart({ records }: { records: ArchiveRow[] }) {
  const points = records
    .map((r) => ({ time: r.time, score: Number(r.score) }))
    .filter((p) => !isNaN(p.score))
    .sort((a, b) => a.time.localeCompare(b.time));

  if (points.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        暂无可绘制的成绩数据
      </div>
    );
  }

  const w = 480;
  const h = 140;
  const pad = 24;
  const max = Math.max(...points.map((p) => p.score), 100);
  const min = Math.min(...points.map((p) => p.score), 60);
  const span = Math.max(max - min, 1);
  const stepX = points.length > 1 ? (w - pad * 2) / (points.length - 1) : 0;

  const coords = points.map((p, i) => ({
    x: pad + i * stepX,
    y: h - pad - ((p.score - min) / span) * (h - pad * 2),
    score: p.score,
    time: p.time,
  }));

  const path = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ");
  const area = `${path} L${coords[coords.length - 1].x},${h - pad} L${coords[0].x},${h - pad} Z`;

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
        <defs>
          <linearGradient id="growth-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#growth-grad)" />
        <path d={path} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
        {coords.map((c, i) => (
          <g key={i}>
            <circle cx={c.x} cy={c.y} r="3.5" fill="hsl(var(--primary))" />
            <text
              x={c.x}
              y={c.y - 8}
              textAnchor="middle"
              className="fill-foreground"
              fontSize="10"
              fontWeight="600"
            >
              {c.score}
            </text>
          </g>
        ))}
      </svg>
      <div className="flex justify-between text-[10px] text-muted-foreground mt-1 px-2">
        <span>{points[0].time.slice(0, 10)}</span>
        <span>{points[points.length - 1].time.slice(0, 10)}</span>
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </div>
      <div className="text-sm font-medium text-foreground mt-1">{value}</div>
    </div>
  );
}

function RecordLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function Mini({
  label,
  value,
  unit,
  boxed,
}: {
  label: string;
  value: string;
  unit?: string;
  boxed?: boolean;
}) {
  if (boxed) {
    return (
      <div className="rounded-lg bg-card border border-border px-3 py-2">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-semibold text-foreground mt-0.5">
          {value}
          {unit && <span className="text-xs text-muted-foreground ml-0.5">{unit}</span>}
        </div>
      </div>
    );
  }
  return (
    <div className="text-right">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-semibold text-foreground">
        {value}
        {unit && <span className="text-xs text-muted-foreground ml-0.5">{unit}</span>}
      </div>
    </div>
  );
}

function KpiBox({
  icon: Icon,
  label,
  value,
  unit,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  unit?: string;
  tone: "primary" | "info" | "success" | "warning";
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
