import { Card } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Users,
  UserMinus,
  UserPlus,
  ArrowRightLeft,
  AlertTriangle,
  FileWarning,
  IdCard,
  CloudOff,
  GraduationCap,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  getKpis,
  getMonthlyFlow,
  getDeptDistribution,
  getSubsidiaryDistribution,
  getResignTrend,
  getAlerts,
  SUBSIDIARIES,
} from "@/modules/employee/data/mockData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
];

function KpiCard({
  title,
  value,
  unit,
  delta,
  deltaLabel,
  icon: Icon,
  tone = "primary",
}: {
  title: string;
  value: string | number;
  unit?: string;
  delta?: string;
  deltaLabel?: string;
  icon: any;
  tone?: "primary" | "success" | "warning" | "info";
}) {
  const toneMap = {
    primary: "bg-primary-soft text-primary",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    info: "bg-info-soft text-info",
  };
  const isUp = delta?.startsWith("+") || (delta && !delta.startsWith("-"));
  return (
    <Card className="p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-lg)] transition-shadow border-border/60">
      <div className="flex items-start justify-between">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${toneMap[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        {unit && <div className="text-sm text-muted-foreground">{unit}</div>}
      </div>
      {delta && (
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span className={`flex items-center gap-0.5 font-medium ${isUp ? "text-success" : "text-destructive"}`}>
            {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {delta}
          </span>
          <span className="text-muted-foreground">{deltaLabel}</span>
        </div>
      )}
    </Card>
  );
}

export default function Dashboard() {
  const kpi = getKpis();
  const monthlyFlow = getMonthlyFlow();
  const deptData = getDeptDistribution();
  const subData = getSubsidiaryDistribution();
  const trend = getResignTrend();
  const alerts = getAlerts();

  // Aggregate flow chart by total
  const flowChart = monthlyFlow.map((m) => ({
    month: m.month.slice(5),
    入职: m.入职,
    离职: m.离职,
  }));

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">人员流动看板</h1>
          <p className="text-sm text-muted-foreground mt-1">
            截至 2025-04-23 · 数据每日 06:00 自动更新
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 h-9 text-sm rounded-md border border-border bg-card hover:bg-muted">
            导出报表
          </button>
          <button className="px-3 h-9 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary-hover">
            刷新数据
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="在职总人数" value={kpi.total} unit="人" delta={`+${kpi.newJoinThisMonth}`} deltaLabel="本月新增" icon={Users} tone="primary" />
        <KpiCard title="试用期人员" value={kpi.probation} unit="人" delta={`占比 ${((kpi.probation / kpi.total) * 100).toFixed(1)}%`} deltaLabel="" icon={UserPlus} tone="info" />
        <KpiCard title="月离职率" value={kpi.turnoverRate} unit="%" delta={`${Number(kpi.momTurnover) > 0 ? "+" : ""}${kpi.momTurnover}%`} deltaLabel="环比" icon={UserMinus} tone="warning" />
        <KpiCard title="本月调岗" value={kpi.transferThisMonth} unit="人" delta={`同比 ${kpi.yoyTurnover}%`} deltaLabel="" icon={ArrowRightLeft} tone="success" />
      </div>

      {/* Alerts strip */}
      <Card className="p-4 border-warning/30 bg-warning-soft/40">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <span className="font-medium text-sm">关键指标预警</span>
          <Link to="/employee/alerts" className="ml-auto text-xs text-primary hover:underline">查看全部 →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: FileWarning, label: "合同到期", count: alerts.contractExpiring.length, color: "text-warning" },
            { icon: IdCard, label: "身份证到期", count: alerts.idExpiring.length, color: "text-destructive" },
            { icon: CloudOff, label: "钉钉数据未上传", count: alerts.dingTalkMissing.length, color: "text-info" },
            { icon: GraduationCap, label: "学信网未认证", count: alerts.materialMissing.length, color: "text-chart-5" },
          ].map((a) => (
            <Link
              key={a.label}
              to="/employee/alerts"
              className="flex items-center gap-3 p-3 rounded-lg bg-card hover:shadow-[var(--shadow-card)] transition border border-transparent hover:border-border"
            >
              <a.icon className={`h-5 w-5 ${a.color}`} />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground">{a.label}</div>
                <div className="text-xl font-semibold">{a.count}</div>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Flow chart */}
        <Card className="p-5 lg:col-span-2 border-border/60">
          <div className="flex items-center justify-between mb-1">
            <div>
              <div className="font-semibold">人员流动趋势</div>
              <div className="text-xs text-muted-foreground mt-0.5">近 12 个月入职 / 离职情况</div>
            </div>
            <Tabs defaultValue="monthly" className="w-auto">
              <TabsList className="h-8">
                <TabsTrigger value="monthly" className="text-xs h-6">月度</TabsTrigger>
                <TabsTrigger value="yearly" className="text-xs h-6">年度</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="h-72 mt-3">
            <ResponsiveContainer>
              <BarChart data={flowChart} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="入职" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="离职" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Subsidiary distribution */}
        <Card className="p-5 border-border/60">
          <div className="font-semibold">合同归属分布</div>
          <div className="text-xs text-muted-foreground mt-0.5">按子公司统计</div>
          <div className="h-64 mt-3">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={subData}
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {subData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {subData.map((s, i) => (
              <div key={s.name} className="flex items-center gap-1.5 min-w-0">
                <span className="h-2 w-2 rounded-sm shrink-0" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                <span className="truncate text-muted-foreground">{s.name}</span>
                <span className="ml-auto font-medium tabular-nums">{s.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Resign trend YoY */}
        <Card className="p-5 lg:col-span-2 border-border/60">
          <div className="flex items-center justify-between mb-1">
            <div>
              <div className="font-semibold">离职趋势（同比）</div>
              <div className="text-xs text-muted-foreground mt-0.5">本年 vs 去年同期</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">年度累计离职率</div>
              <div className="text-lg font-semibold text-warning">{kpi.turnoverRate}%</div>
            </div>
          </div>
          <div className="h-64 mt-3">
            <ResponsiveContainer>
              <LineChart data={trend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} tickFormatter={(v) => v.slice(5)} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="本年" stroke="hsl(var(--chart-1))" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="去年同期" stroke="hsl(var(--chart-4))" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Department distribution */}
        <Card className="p-5 border-border/60">
          <div className="font-semibold">部门人员分布</div>
          <div className="text-xs text-muted-foreground mt-0.5">人数 &lt; 3 自动合并</div>
          <div className="h-64 mt-3">
            <ResponsiveContainer>
              <BarChart data={deptData} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={100} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Subsidiary flow detail */}
      <Card className="p-5 border-border/60">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-semibold">子公司流动明细</div>
            <div className="text-xs text-muted-foreground mt-0.5">本月入职 / 离职 / 调岗汇总</div>
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="text-left font-normal py-2.5 px-3">子公司</th>
                <th className="text-right font-normal py-2.5 px-3">在职</th>
                <th className="text-right font-normal py-2.5 px-3">本月入职</th>
                <th className="text-right font-normal py-2.5 px-3">本月离职</th>
                <th className="text-right font-normal py-2.5 px-3">本月调岗</th>
                <th className="text-right font-normal py-2.5 px-3">月离职率</th>
                <th className="text-right font-normal py-2.5 px-3">同比</th>
              </tr>
            </thead>
            <tbody>
              {SUBSIDIARIES.map((s) => {
                const total = subData.find((x) => x.name === s)?.value ?? 0;
                const inn = monthlyFlow[11][`${s}_入职`];
                const out = monthlyFlow[11][`${s}_离职`];
                const rate = total ? ((out / total) * 100).toFixed(2) : "0.00";
                const yoy = (Math.random() * 4 - 2).toFixed(1);
                const yoyUp = Number(yoy) > 0;
                return (
                  <tr key={s} className="border-b border-border/60 hover:bg-muted/40 transition-colors">
                    <td className="py-2.5 px-3 font-medium">{s}</td>
                    <td className="py-2.5 px-3 text-right tabular-nums">{total}</td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-success">+{inn}</td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-destructive">-{out}</td>
                    <td className="py-2.5 px-3 text-right tabular-nums">{Math.floor(Math.random() * 4)}</td>
                    <td className="py-2.5 px-3 text-right tabular-nums">{rate}%</td>
                    <td className={`py-2.5 px-3 text-right tabular-nums ${yoyUp ? "text-destructive" : "text-success"}`}>
                      {yoyUp ? "↑" : "↓"} {Math.abs(Number(yoy))}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
