import { useState } from "react";
import { PageHeader } from "@/modules/training/components/PageHeader";
import { SectionCard } from "@/modules/training/components/SectionCard";
import { Button } from "@/components/ui/button";
import {
  Upload, FileText, CheckCircle2, Loader2, ArrowRight,
  FileCheck2, ListChecks, FileOutput, X,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Step = 1 | 2 | 3;

type Material = { name: string; size: string };

type Question = {
  id: number;
  type: "单选" | "多选" | "判断";
  content: string;
  selected: boolean;
};

const mockQuestions: Question[] = [
  { id: 1, type: "单选", content: "下列哪项属于个人防护用品（PPE）的基本要求？", selected: true },
  { id: 2, type: "单选", content: "进入受限空间作业前，必须先进行的检测是？", selected: true },
  { id: 3, type: "多选", content: "以下属于安全生产责任制内容的有哪些？", selected: true },
  { id: 4, type: "判断", content: "动火作业可在确认无可燃物后直接进行，无需办理审批。", selected: true },
  { id: 5, type: "单选", content: "发生触电事故时，首要的应急处置措施是？", selected: true },
  { id: 6, type: "多选", content: "化学品泄漏处置应遵循的原则包括？", selected: true },
  { id: 7, type: "判断", content: "佩戴安全帽时下颌带可以不系紧。", selected: true },
  { id: 8, type: "单选", content: "高处作业的高度界定标准是？", selected: true },
];

export default function QuestionBank() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [building, setBuilding] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const addMockMaterial = () => {
    setMaterials((m) => [
      ...m,
      { name: `安全规范 v${m.length + 3}.pdf`, size: `${(1.2 + m.length * 0.4).toFixed(1)} MB` },
    ]);
  };

  const removeMaterial = (idx: number) => {
    setMaterials((m) => m.filter((_, i) => i !== idx));
  };

  const handleBuild = () => {
    if (materials.length === 0) {
      toast.error("请先上传培训材料");
      return;
    }
    setBuilding(true);
    toast.info("AI 正在解析材料并生成题目…");
    setTimeout(() => {
      setBuilding(false);
      setQuestions(mockQuestions);
      setStep(2);
      toast.success(`已基于 ${materials.length} 份材料生成 ${mockQuestions.length} 道题`);
    }, 1500);
  };

  const toggleQuestion = (id: number) => {
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, selected: !q.selected } : q)));
  };

  const handleComposePaper = () => {
    const selectedCount = questions.filter((q) => q.selected).length;
    if (selectedCount === 0) {
      toast.error("请至少选择一道题");
      return;
    }
    setStep(3);
    toast.success(`已组成包含 ${selectedCount} 道题的试卷`);
  };

  const reset = () => {
    setStep(1);
    setMaterials([]);
    setQuestions([]);
  };

  const selectedCount = questions.filter((q) => q.selected).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="题库管理"
        subtitle="上传培训材料 · AI 构建题库 · 一键形成试卷"
      />

      {/* Stepper */}
      <div className="flex items-center gap-3">
        {[
          { n: 1, label: "上传培训材料", icon: Upload },
          { n: 2, label: "AI 构建题库", icon: ListChecks },
          { n: 3, label: "形成试卷", icon: FileOutput },
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
              {i < 2 && <ArrowRight className="size-4 text-muted-foreground shrink-0" />}
            </div>
          );
        })}
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <SectionCard
          title="上传培训材料"
          subtitle="支持 PDF / Word / PPT / Markdown，单文件 ≤ 50MB"
        >
          <div
            onClick={addMockMaterial}
            className="cursor-pointer rounded-xl border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 transition-colors p-10 grid place-items-center text-center"
          >
            <Upload className="size-10 text-muted-foreground mb-3" />
            <div className="font-medium text-foreground">拖拽培训材料到此处，或点击上传</div>
            <div className="text-xs text-muted-foreground mt-1">
              AI 将基于上传材料抽取知识点并生成题目
            </div>
            <Button variant="outline" className="mt-4 pointer-events-none">选择文件</Button>
          </div>

          {materials.length > 0 && (
            <div className="mt-5 space-y-2">
              <div className="text-sm font-medium text-foreground">
                已上传 {materials.length} 份材料
              </div>
              <ul className="space-y-2">
                {materials.map((m, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5"
                  >
                    <div className="size-9 rounded-lg bg-primary-soft grid place-items-center">
                      <FileText className="size-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.size} · 已上传</div>
                    </div>
                    <FileCheck2 className="size-4 text-success" />
                    <button
                      onClick={() => removeMaterial(i)}
                      className="size-7 rounded-md grid place-items-center hover:bg-muted text-muted-foreground"
                    >
                      <X className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleBuild}
              disabled={building || materials.length === 0}
              className="bg-primary hover:bg-primary/90"
            >
              {building ? (
                <><Loader2 className="size-4 mr-1.5 animate-spin" />AI 解析中…</>
              ) : (
                <>下一步：AI 构建题库<ArrowRight className="size-4 ml-1.5" /></>
              )}
            </Button>
          </div>
        </SectionCard>
      )}

      {/* Step 2: Question bank */}
      {step === 2 && (
        <SectionCard
          title="AI 已生成题库"
          subtitle={`基于 ${materials.length} 份材料生成 ${questions.length} 道题，请勾选纳入试卷的题目`}
          actions={
            <div className="text-sm text-muted-foreground">
              已选 <span className="font-semibold text-primary">{selectedCount}</span> / {questions.length}
            </div>
          }
        >
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr className="text-left">
                  <th className="font-medium px-4 py-3 w-12"></th>
                  <th className="font-medium px-4 py-3 w-16">序号</th>
                  <th className="font-medium px-4 py-3 w-20">题型</th>
                  <th className="font-medium px-4 py-3">题目内容</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={q.selected}
                        onChange={() => toggleQuestion(q.id)}
                        className="size-4 accent-primary cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{q.id}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${
                          q.type === "单选"
                            ? "bg-info-soft text-info"
                            : q.type === "多选"
                            ? "bg-purple-soft text-purple"
                            : "bg-warning-soft text-warning"
                        }`}
                      >
                        {q.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground">{q.content}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              返回上一步
            </Button>
            <Button onClick={handleComposePaper} className="bg-primary hover:bg-primary/90">
              形成试卷<ArrowRight className="size-4 ml-1.5" />
            </Button>
          </div>
        </SectionCard>
      )}

      {/* Step 3: Paper */}
      {step === 3 && (
        <SectionCard title="试卷已生成" subtitle="可前往考试中心发布考试">
          <div className="rounded-xl border border-border bg-gradient-soft p-6">
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-xl bg-success-soft grid place-items-center">
                <FileOutput className="size-6 text-success" />
              </div>
              <div className="flex-1">
                <div className="text-base font-semibold text-foreground">
                  安全生产基础知识 · 试卷
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  共 {selectedCount} 道题 · 来源 {materials.length} 份培训材料 · 已存入试卷库
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div className="rounded-lg bg-card border border-border px-3 py-2">
                    <div className="text-xs text-muted-foreground">题目总数</div>
                    <div className="font-semibold text-foreground mt-0.5">{selectedCount} 题</div>
                  </div>
                  <div className="rounded-lg bg-card border border-border px-3 py-2">
                    <div className="text-xs text-muted-foreground">单选</div>
                    <div className="font-semibold text-foreground mt-0.5">
                      {questions.filter((q) => q.selected && q.type === "单选").length} 题
                    </div>
                  </div>
                  <div className="rounded-lg bg-card border border-border px-3 py-2">
                    <div className="text-xs text-muted-foreground">多选</div>
                    <div className="font-semibold text-foreground mt-0.5">
                      {questions.filter((q) => q.selected && q.type === "多选").length} 题
                    </div>
                  </div>
                  <div className="rounded-lg bg-card border border-border px-3 py-2">
                    <div className="text-xs text-muted-foreground">判断</div>
                    <div className="font-semibold text-foreground mt-0.5">
                      {questions.filter((q) => q.selected && q.type === "判断").length} 题
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={reset}>
              再来一份
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate("/training/exam-center")}
                className="bg-primary hover:bg-primary/90"
              >
                前往发布考试<ArrowRight className="size-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
