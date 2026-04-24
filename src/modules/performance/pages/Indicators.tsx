import { useState } from "react";
import { PageHeader } from "@/modules/performance/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/modules/performance/components/common/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Sparkles, Pencil, Pause, Play } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Indicator = {
  id: string;
  name: string;
  position: string;
  type: "量化" | "定性";
  weight: number;
  rule: string;
  status: "启用" | "停用";
  source: "知识库" | "AI 生成" | "自建";
};

const seed: Indicator[] = [
  { id: "I001", name: "销售目标达成率", position: "市场经理", type: "量化", weight: 30, rule: "≥100% 满分；每低 5% 扣 10 分", status: "启用", source: "知识库" },
  { id: "I002", name: "新客户开发数量", position: "市场专员", type: "量化", weight: 25, rule: "每月 ≥8 家满分", status: "启用", source: "AI 生成" },
  { id: "I003", name: "客户满意度", position: "全员", type: "量化", weight: 20, rule: "NPS ≥ 50 满分", status: "启用", source: "知识库" },
  { id: "I004", name: "生产合格率", position: "生产主管", type: "量化", weight: 35, rule: "≥99% 满分；<95% 不及格", status: "启用", source: "知识库" },
  { id: "I005", name: "团队协作能力", position: "全员", type: "定性", weight: 15, rule: "360 评分均值", status: "启用", source: "知识库" },
  { id: "I006", name: "项目按期交付", position: "工艺工程师", type: "量化", weight: 25, rule: "按期率 ≥95%", status: "停用", source: "自建" },
  { id: "I007", name: "成本节约率", position: "采购专员", type: "量化", weight: 30, rule: "节约 ≥3% 满分", status: "启用", source: "AI 生成" },
];

export default function Indicators() {
  const [list, setList] = useState(seed);
  const [q, setQ] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPos, setAiPos] = useState("");
  const [aiResult, setAiResult] = useState<{ name: string; rule: string }[]>([]);

  const filtered = list.filter((i) => i.name.includes(q) || i.position.includes(q));

  const toggleStatus = (id: string) => {
    setList((l) =>
      l.map((x) => (x.id === id ? { ...x, status: x.status === "启用" ? "停用" : "启用" } : x))
    );
    toast.success("状态已更新");
  };

  const generateAI = () => {
    if (!aiPos.trim()) return;
    setAiResult([
      { name: `${aiPos} - 核心目标完成率`, rule: "≥100% 得满分，按线性扣分" },
      { name: `${aiPos} - 工作质量评分`, rule: "上级评分均值 ≥4.5 满分" },
      { name: `${aiPos} - 协同沟通效率`, rule: "跨部门评分 ≥4.0 合格" },
      { name: `${aiPos} - 创新与改进`, rule: "季度内 ≥1 项有效改进" },
    ]);
    toast.success("AI 已为该岗位生成 4 项推荐指标");
  };

  const adopt = () => {
    const added: Indicator[] = aiResult.map((r, idx) => ({
      id: `AI${Date.now()}${idx}`,
      name: r.name,
      position: aiPos,
      type: "量化",
      weight: 20,
      rule: r.rule,
      status: "启用",
      source: "AI 生成",
    }));
    setList((l) => [...added, ...l]);
    setAiOpen(false);
    setAiResult([]);
    setAiPos("");
    toast.success(`已采纳 ${added.length} 项指标到指标库`);
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <PageHeader
        title="指标库管理"
        subtitle={<>共 <b className="text-foreground">{list.length}</b> 项指标 · 启用 <b className="text-foreground">{list.filter(i=>i.status==="启用").length}</b> 项</>}
        actions={
          <>
            <Button variant="outline" className="gap-2" onClick={() => setAiOpen(true)}>
              <Sparkles className="size-4 text-primary" />AI 辅助生成
            </Button>
            <Button className="gap-2"><Plus className="size-4" />新增指标</Button>
          </>
        }
      />

      <Card className="p-5 shadow-none border mb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="搜索指标名称 / 岗位" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <select className="h-10 px-3 rounded-md border bg-card text-sm">
            <option>全部岗位</option><option>市场经理</option><option>生产主管</option>
          </select>
          <select className="h-10 px-3 rounded-md border bg-card text-sm">
            <option>全部类型</option><option>量化</option><option>定性</option>
          </select>
          <select className="h-10 px-3 rounded-md border bg-card text-sm">
            <option>全部状态</option><option>启用</option><option>停用</option>
          </select>
        </div>
      </Card>

      <Card className="shadow-none border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-muted-foreground">
            <tr className="text-left">
              <th className="px-5 py-3.5 font-medium">指标名称</th>
              <th className="px-5 py-3.5 font-medium">适用岗位</th>
              <th className="px-5 py-3.5 font-medium">类型</th>
              <th className="px-5 py-3.5 font-medium">权重</th>
              <th className="px-5 py-3.5 font-medium">评分规则</th>
              <th className="px-5 py-3.5 font-medium">来源</th>
              <th className="px-5 py-3.5 font-medium">状态</th>
              <th className="px-5 py-3.5 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((i) => (
              <tr key={i.id} className="border-t hover:bg-secondary/30 transition-colors">
                <td className="px-5 py-4 font-medium">{i.name}</td>
                <td className="px-5 py-4 text-muted-foreground">{i.position}</td>
                <td className="px-5 py-4"><StatusBadge tone={i.type === "量化" ? "info" : "muted"}>{i.type}</StatusBadge></td>
                <td className="px-5 py-4">{i.weight}%</td>
                <td className="px-5 py-4 text-muted-foreground max-w-xs truncate">{i.rule}</td>
                <td className="px-5 py-4">
                  {i.source === "AI 生成" ? (
                    <span className="inline-flex items-center gap-1 text-primary text-xs"><Sparkles className="size-3" />{i.source}</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">{i.source}</span>
                  )}
                </td>
                <td className="px-5 py-4"><StatusBadge tone={i.status === "启用" ? "success" : "muted"}>{i.status}</StatusBadge></td>
                <td className="px-5 py-4 text-right">
                  <div className="inline-flex gap-1">
                    <Button size="sm" variant="ghost" className="h-8 px-2"><Pencil className="size-4" /></Button>
                    <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => toggleStatus(i.id)}>
                      {i.status === "启用" ? <Pause className="size-4" /> : <Play className="size-4" />}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Dialog open={aiOpen} onOpenChange={setAiOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Sparkles className="size-5 text-primary" />AI 辅助生成岗位指标</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>岗位名称</Label>
              <Input placeholder="例如：高级产品经理" value={aiPos} onChange={(e) => setAiPos(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>岗位职责简述（可选）</Label>
              <Textarea placeholder="输入主要职责，AI 将基于 HR 知识库智能推荐量化指标..." rows={3} />
            </div>
            <Button onClick={generateAI} className="w-full gap-2">
              <Sparkles className="size-4" />开始生成
            </Button>
            {aiResult.length > 0 && (
              <div className="rounded-xl border divide-y">
                {aiResult.map((r) => (
                  <div key={r.name} className="p-3 flex items-start gap-3">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{r.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{r.rule}</div>
                    </div>
                    <StatusBadge tone="info">推荐</StatusBadge>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAiOpen(false)}>取消</Button>
            <Button onClick={adopt} disabled={!aiResult.length}>采纳全部</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
