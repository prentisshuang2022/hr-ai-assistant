import { PageHeader } from "@/modules/training/components/PageHeader";
import { StatCard } from "@/modules/training/components/StatCard";
import { SectionCard } from "@/modules/training/components/SectionCard";
import { Button } from "@/components/ui/button";
import {
  Users, BookOpen, ClipboardCheck, Award,
  AlertTriangle, FileWarning, ClockAlert, UserCheck,
  ArrowRight,
} from "lucide-react";

const trendData = [
  { m: "5月", a: 32, b: 28 }, { m: "6月", a: 45, b: 35 },
  { m: "7月", a: 38, b: 42 }, { m: "8月", a: 52, b: 40 },
  { m: "9月", a: 60, b: 48 }, { m: "10月", a: 55, b: 52 },
  { m: "11月", a: 68, b: 58 }, { m: "12月", a: 72, b: 65 },
  { m: "1月", a: 50, b: 45 }, { m: "2月", a: 65, b: 60 },
  { m: "3月", a: 78, b: 70 }, { m: "4月", a: 82, b: 75 },
];

const recentExams = [
  { name: "2025 Q2 安全生产培训考核", dept: "生产部", time: "2025-04-22", joined: 86, pass: "94%", status: "已结束" },
  { name: "新员工入职合规培训", dept: "综合管理部", time: "2025-04-20", joined: 12, pass: "100%", status: "已结束" },
  { name: "数据安全意识月度考试", dept: "全公司", time: "2025-04-25", joined: 0, pass: "—", status: "进行中" },
  { name: "财务系统操作认证", dept: "财务部", time: "2025-04-28", joined: 0, pass: "—", status: "未开始" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="培训总览"
        subtitle="截至 2025-04-23 · 数据每日 06:00 自动更新"
        actions={
          <>
            <Button variant="outline">导出报表</Button>
            <Button className="bg-primary hover:bg-primary/90">刷新数据</Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="参训总人数" value="248" unit="人" icon={Users} tone="primary" trend={{ value: "+18 本月新增", direction: "up" }} />
        <StatCard label="进行中考试" value="6" unit="场" icon={ClipboardCheck} tone="info" trend={{ value: "占比 12.5%", direction: "up" }} />
        <StatCard label="平均通过率" value="92.4" unit="%" icon={Award} tone="success" trend={{ value: "+2.1% 环比", direction: "up" }} />
        <StatCard label="在岗培训中" value="34" unit="人" icon={UserCheck} tone="purple" trend={{ value: "同比 +4.6%", direction: "up" }} />
      </div>

      {/* Alerts */}
      <div className="rounded-2xl border border-warning/30 bg-warning-soft/40 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <AlertTriangle className="size-4 text-warning" />
            培训关键预警
          </div>
          <button className="text-xs text-primary hover:underline">查看全部 →</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: ClockAlert, label: "考试逾期未参加", value: 8, tone: "text-destructive bg-destructive/10" },
            { icon: FileWarning, label: "试卷待审核", value: 3, tone: "text-warning bg-warning/10" },
            { icon: BookOpen, label: "题库待更新", value: 5, tone: "text-info bg-info/10" },
            { icon: UserCheck, label: "节点超时未推进", value: 2, tone: "text-purple bg-purple/10" },
          ].map((it) => (
            <div key={it.label} className="rounded-xl bg-card border border-border p-3 flex items-center gap-3">
              <div className={`size-9 rounded-lg grid place-items-center ${it.tone}`}>
                <it.icon className="size-4" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{it.label}</div>
                <div className="text-xl font-bold text-foreground leading-tight">{it.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard
          title="培训参与趋势"
          subtitle="近 12 个月参训 / 通过情况"
          className="lg:col-span-2"
          actions={
            <div className="flex bg-muted rounded-lg p-0.5 text-xs">
              <button className="px-3 py-1 rounded-md bg-card text-foreground font-medium shadow-card">月度</button>
              <button className="px-3 py-1 rounded-md text-muted-foreground">年度</button>
            </div>
          }
        >
          <div className="h-72 flex items-end gap-3 pt-6 px-2">
            {trendData.map((d) => (
              <div key={d.m} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end gap-1 h-56">
                  <div className="flex-1 bg-primary rounded-t-md transition-all hover:bg-primary-glow" style={{ height: `${d.a}%` }} />
                  <div className="flex-1 bg-primary/30 rounded-t-md" style={{ height: `${d.b}%` }} />
                </div>
                <span className="text-[11px] text-muted-foreground">{d.m}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 pt-3 text-xs text-muted-foreground border-t border-border mt-2">
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-primary" />参训人数</span>
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-primary/30" />通过人数</span>
          </div>
        </SectionCard>

        <SectionCard title="培训类型分布" subtitle="按场景统计本月数据">
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative size-44">
              <svg viewBox="0 0 36 36" className="size-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--primary))" strokeWidth="3.5" strokeDasharray="42 100" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--purple))" strokeWidth="3.5" strokeDasharray="28 100" strokeDashoffset="-42" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--success))" strokeWidth="3.5" strokeDasharray="18 100" strokeDashoffset="-70" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--warning))" strokeWidth="3.5" strokeDasharray="12 100" strokeDashoffset="-88" />
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">248</div>
                  <div className="text-xs text-muted-foreground">总人次</div>
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
              {[
                { c: "bg-primary", l: "离岗培训", v: "42%" },
                { c: "bg-purple", l: "在岗培训", v: "28%" },
                { c: "bg-success", l: "新员工", v: "18%" },
                { c: "bg-warning", l: "专项考试", v: "12%" },
              ].map((it) => (
                <div key={it.l} className="flex items-center gap-2">
                  <span className={`size-2.5 rounded-sm ${it.c}`} />
                  <span className="text-muted-foreground">{it.l}</span>
                  <span className="ml-auto font-medium text-foreground">{it.v}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Recent exams */}
      <SectionCard
        title="近期考试"
        subtitle="最近 30 天发布的离岗培训考试"
        actions={<Button variant="ghost" size="sm" className="text-primary">前往考试中心 <ArrowRight className="size-3.5 ml-1" /></Button>}
      >
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr className="text-left">
                <th className="font-medium px-4 py-3">考试名称</th>
                <th className="font-medium px-4 py-3">部门</th>
                <th className="font-medium px-4 py-3">时间</th>
                <th className="font-medium px-4 py-3">参与</th>
                <th className="font-medium px-4 py-3">通过率</th>
                <th className="font-medium px-4 py-3">状态</th>
              </tr>
            </thead>
            <tbody>
              {recentExams.map((e) => (
                <tr key={e.name} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{e.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.dept}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.time}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.joined} 人</td>
                  <td className="px-4 py-3 font-medium text-foreground">{e.pass}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                      e.status === "进行中" ? "bg-info-soft text-info" :
                      e.status === "未开始" ? "bg-muted text-muted-foreground" :
                      "bg-success-soft text-success"
                    }`}>{e.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
