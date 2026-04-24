import { AppShell } from "@/shared/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Wand2, Save, Copy, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const SAMPLE_JD = `【岗位职责】
1. 负责{{title}}相关核心业务的规划、推进与落地，对结果负责；
2. 与{{department}}及上下游部门协同，识别业务痛点并提出系统化解决方案；
3. 主导关键项目的需求拆解、资源协调与节奏把控，输出阶段性成果；
4. 建立专业方法论与最佳实践，沉淀团队能力，并指导初级成员成长；
5. 跟踪行业动态与对标企业实践，持续优化业务模型与执行效率。

【任职要求】
1. 本科及以上学历，相关专业背景，{{years}}年以上对应领域经验；
2. 具备扎实的专业基础与系统化思考能力，能够独立规划与推进复杂项目;
3. 优秀的沟通协作与跨部门推动能力，结果导向，抗压能力强；
4. 有大型企业 / 头部公司同类岗位经验者优先；
5. 认同公司文化，长期主义，愿意与团队共同成长。

【我们提供】
· 行业有竞争力的薪酬 + 项目奖金 + 长期激励
· 完善的职业发展通道与培训体系
· 弹性工作 + 14 天年假 + 商业医疗保险
· 扁平化、强协作、结果导向的团队氛围`;

const JobNew = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    department: "",
    company: "光电（鄂）",
    location: "武汉",
    headcount: 1,
    years: "3-5",
    requirement: "",
  });
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!form.title || !form.department) {
      toast.error("请先填写岗位名称与所属部门");
      return;
    }
    setLoading(true);
    setJd("");
    setTimeout(() => {
      const out = SAMPLE_JD.replace(/\{\{title\}\}/g, form.title)
        .replace(/\{\{department\}\}/g, form.department)
        .replace(/\{\{years\}\}/g, form.years) +
        (form.requirement ? `\n\n【业务部门补充要求】\n${form.requirement}` : "");
      setJd(out);
      setLoading(false);
      toast.success("AI 已生成 JD，请审阅后保存");
    }, 1200);
  };

  const copy = () => {
    navigator.clipboard.writeText(jd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const save = () => {
    if (!jd) return toast.error("请先生成 JD");
    toast.success("岗位与 JD 已保存");
    setTimeout(() => navigate("/recruit/jobs"), 600);
  };

  return (
    <AppShell breadcrumbs={[{ label: "招聘管理" }, { label: "岗位与 JD", to: "/recruit/jobs" }, { label: "新建岗位" }]}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">新建岗位 · AI 生成 JD</h1>
        <p className="text-sm text-muted-foreground mt-2">填写部门与岗位信息，AI 将自动产出标准化 JD，可二次编辑后保存</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-[var(--shadow-card)] p-6 space-y-5 self-start">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <div className="w-8 h-8 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
              <Wand2 className="w-4 h-4" />
            </div>
            <div className="font-semibold">岗位需求填写</div>
          </div>

          <div className="space-y-2">
            <Label>岗位名称 <span className="text-destructive">*</span></Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="如：高级前端工程师" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>所属部门 <span className="text-destructive">*</span></Label>
              <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="如：研发中心" />
            </div>
            <div className="space-y-2">
              <Label>子公司</Label>
              <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>工作地点</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>招聘人数</Label>
              <Input type="number" min={1} value={form.headcount} onChange={(e) => setForm({ ...form, headcount: +e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>经验年限</Label>
              <Input value={form.years} onChange={(e) => setForm({ ...form, years: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>业务部门需求描述</Label>
            <Textarea
              value={form.requirement}
              onChange={(e) => setForm({ ...form, requirement: e.target.value })}
              placeholder="例如：希望候选人有 SaaS B 端产品经验，能独立带 3-5 人小组，技术栈以 React 为主..."
              rows={5}
            />
            <p className="text-xs text-muted-foreground">越具体，AI 生成的 JD 越贴合业务实际需要</p>
          </div>

          <Button size="lg" className="w-full" onClick={generate} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            {loading ? "AI 正在生成..." : "AI 生成 JD"}
          </Button>
        </div>

        {/* Preview */}
        <div className="lg:col-span-3 bg-card rounded-2xl border border-border shadow-[var(--shadow-card)] flex flex-col min-h-[600px]">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-info-soft text-info flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold">AI 生成结果</div>
                <div className="text-xs text-muted-foreground">支持二次编辑</div>
              </div>
            </div>
            {jd && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copy}>
                  {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  复制
                </Button>
                <Button size="sm" onClick={save}><Save className="w-3.5 h-3.5 mr-1" />保存岗位</Button>
              </div>
            )}
          </div>

          <div className="p-5 flex-1 flex flex-col">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <div className="text-sm">AI 正在分析需求并生成专业 JD...</div>
              </div>
            ) : jd ? (
              <Textarea value={jd} onChange={(e) => setJd(e.target.value)} className="flex-1 font-mono text-sm leading-relaxed resize-none" />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3 border-2 border-dashed border-border rounded-xl">
                <Sparkles className="w-12 h-12 text-muted-foreground/40" />
                <div className="text-sm">填写左侧信息，点击「AI 生成 JD」</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default JobNew;
