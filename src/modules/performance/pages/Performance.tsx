import { useState } from "react";
import { PageHeader } from "@/modules/performance/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/modules/performance/components/common/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sparkles, BellRing, ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { toast } from "sonner";

const nodes = [
  { name: "员工自评", state: "done", who: "本人", date: "04-08" },
  { name: "上级评分", state: "current", who: "张经理", date: "进行中" },
  { name: "部门负责人", state: "todo", who: "李总监", date: "—" },
  { name: "HR 汇总", state: "todo", who: "HR 系统", date: "—" },
  { name: "总经理确认", state: "todo", who: "王总", date: "—" },
];

const myTasks = [
  { id: 1, name: "林峰 · 市场专员", node: "上级评分", due: "今日到期", overdue: false },
  { id: 2, name: "潘伟 · 物业主管", node: "上级评分", due: "已逾期 1 天", overdue: true },
  { id: 3, name: "袁帅 · 财务", node: "上级评分", due: "还剩 2 天", overdue: false },
  { id: 4, name: "赵磊 · 品质管理部", node: "部门负责人", due: "还剩 3 天", overdue: false },
  { id: 5, name: "邵华 · 生产主管", node: "上级评分", due: "已逾期 2 天", overdue: true },
];

const indicators = [
  { name: "销售目标达成率", weight: 30, self: 90, leader: 0 },
  { name: "新客户开发数量", weight: 25, self: 85, leader: 0 },
  { name: "客户满意度", weight: 20, self: 88, leader: 0 },
  { name: "团队协作能力", weight: 15, self: 92, leader: 0 },
  { name: "工作主动性", weight: 10, self: 90, leader: 0 },
];

export default function Performance() {
  const [scores, setScores] = useState<Record<number, number>>({});
  const [comment, setComment] = useState("");

  const setScore = (idx: number, v: number) => {
    if (v < 0 || v > 100) {
      toast.error("分数必须在 0-100 之间");
      return;
    }
    setScores((s) => ({ ...s, [idx]: v }));
  };

  const total = indicators.reduce((acc, ind, i) => acc + ((scores[i] ?? 0) * ind.weight) / 100, 0);
  const coefficient = total ? (total / 100 * 1.2).toFixed(2) : "—";

  const submit = () => {
    if (Object.keys(scores).length < indicators.length) {
      toast.error("请完成全部指标评分后再提交");
      return;
    }
    toast.success(`已提交评分，绩效系数 ${coefficient} 已推送至薪酬模块`);
  };

  const remind = (name: string) => toast.success(`已向 ${name} 责任人发送催办提醒`);

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <PageHeader
        title="员工绩效管理"
        subtitle="2025 Q1 季度考核 · 市场营销部 · 当前节点：上级评分"
        actions={
          <>
            <Button variant="outline" className="gap-2" onClick={() => toast.success("已对全部逾期节点发起批量催办")}>
              <BellRing className="size-4" />批量催办
            </Button>
            <Button className="gap-2"><ShieldCheck className="size-4" />汇总分数</Button>
          </>
        }
      />

      {/* 流程节点 */}
      <Card className="p-6 shadow-none border mb-6">
        <div className="text-sm font-medium mb-4">考核流程进度</div>
        <div className="flex items-center">
          {nodes.map((n, i) => (
            <div key={n.name} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`size-11 rounded-full grid place-items-center ${
                    n.state === "done" ? "bg-success text-success-foreground"
                    : n.state === "current" ? "bg-primary text-primary-foreground ring-4 ring-primary-soft"
                    : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {n.state === "done" ? <CheckCircle2 className="size-5" />
                    : n.state === "current" ? <Clock className="size-5" />
                    : <span className="text-sm">{i + 1}</span>}
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{n.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{n.who} · {n.date}</div>
                </div>
              </div>
              {i < nodes.length - 1 && (
                <div className={`flex-1 h-px mx-3 mb-7 ${n.state === "done" ? "bg-success" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-6">
        {/* 待办列表 */}
        <Card className="col-span-1 shadow-none border overflow-hidden h-fit">
          <div className="p-5 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">我的待办评分</h3>
              <StatusBadge tone="warning">{myTasks.filter(t=>t.overdue).length} 项逾期</StatusBadge>
            </div>
          </div>
          <div className="divide-y">
            {myTasks.map((t) => (
              <div key={t.id} className="p-4 hover:bg-secondary/40 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{t.node}</div>
                  </div>
                  {t.overdue && <AlertTriangle className="size-4 text-warning shrink-0" />}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-xs ${t.overdue ? "text-destructive" : "text-muted-foreground"}`}>{t.due}</span>
                  <div className="flex gap-1">
                    {t.overdue && (
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => remind(t.name)}>
                        催办
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs gap-1">
                      去评分 <ArrowRight className="size-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 评分面板 */}
        <Card className="col-span-2 shadow-none border">
          <Tabs defaultValue="leader">
            <div className="px-6 pt-5 border-b">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-base font-semibold">林峰 · 市场专员</div>
                  <div className="text-xs text-muted-foreground mt-0.5">EMP0000 · 入职 2019-08-22</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">当前合计得分</div>
                  <div className="text-2xl font-semibold text-primary">{total ? total.toFixed(1) : "—"}</div>
                </div>
              </div>
              <TabsList className="bg-transparent p-0 h-auto gap-4 border-b-0">
                <TabsTrigger value="self" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-1 pb-3">员工自评</TabsTrigger>
                <TabsTrigger value="leader" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-1 pb-3">上级评分</TabsTrigger>
                <TabsTrigger value="ai" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-primary border-b-2 border-transparent rounded-none px-1 pb-3 gap-1">
                  <Sparkles className="size-3.5" />AI 评估
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="self" className="p-6 m-0">
              <div className="space-y-3">
                {indicators.map((ind, i) => (
                  <div key={ind.name} className="p-4 rounded-xl border">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{ind.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">权重 {ind.weight}%</div>
                      </div>
                      <div className="text-2xl font-semibold text-foreground">{ind.self}</div>
                    </div>
                    <Progress value={ind.self} className="h-1.5 mt-3" />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="leader" className="p-6 m-0">
              <div className="space-y-3">
                {indicators.map((ind, i) => (
                  <div key={ind.name} className="p-4 rounded-xl border">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{ind.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">权重 {ind.weight}% · 自评 {ind.self} 分</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          placeholder="0-100"
                          className="w-24 text-center"
                          value={scores[i] ?? ""}
                          onChange={(e) => setScore(i, Number(e.target.value))}
                        />
                        <span className="text-xs text-muted-foreground">分</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="space-y-2 pt-2">
                  <div className="text-sm font-medium">评语</div>
                  <Textarea rows={3} placeholder="给员工本季度的整体评语..." value={comment} onChange={(e) => setComment(e.target.value)} />
                </div>

                <div className="p-4 rounded-xl bg-success-soft/60 border border-success/15 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="size-5 text-success" />
                    <div className="text-sm">
                      <div className="font-medium">分数自动校验：通过</div>
                      <div className="text-xs text-muted-foreground mt-0.5">权重合计 100% · 各项均在 0-100 区间</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">绩效系数</div>
                    <div className="text-xl font-semibold text-success">{coefficient}</div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline">暂存</Button>
                  <Button onClick={submit} className="gap-2">提交评分 <ArrowRight className="size-4" /></Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="p-6 m-0 space-y-4">
              <div className="p-4 rounded-xl bg-primary-soft/50 border border-primary/15">
                <div className="flex items-start gap-3">
                  <Sparkles className="size-5 text-primary mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium">AI 综合评估参考</div>
                    <div className="text-muted-foreground mt-2 leading-relaxed">
                      该员工本季度核心销售目标完成率 <b className="text-foreground">112%</b>，超额达成；客户满意度位列部门 <b className="text-foreground">前 20%</b>；建议上级评分区间 <b className="text-foreground">86 - 92 分</b>，绩效等级 B+。注意：新客户开发数量同比下降 8%，可在评语中给出针对性辅导建议。
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Card className="p-4 border shadow-none">
                  <div className="text-xs text-muted-foreground">AI 推荐总分</div>
                  <div className="text-2xl font-semibold mt-1 text-primary">88.5</div>
                </Card>
                <Card className="p-4 border shadow-none">
                  <div className="text-xs text-muted-foreground">绩效等级</div>
                  <div className="text-2xl font-semibold mt-1">B+</div>
                </Card>
                <Card className="p-4 border shadow-none">
                  <div className="text-xs text-muted-foreground">推荐绩效系数</div>
                  <div className="text-2xl font-semibold mt-1 text-success">1.06</div>
                </Card>
              </div>
              <Button variant="outline" className="w-full gap-2" onClick={() => toast.success("已采纳 AI 推荐分数")}>
                <Sparkles className="size-4 text-primary" />一键采纳到上级评分
              </Button>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
