import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  FileWarning,
  IdCard,
  CloudOff,
  GraduationCap,
  Bell,
  ArrowRight,
} from "lucide-react";
import { getAlerts, type Employee } from "@/modules/employee/data/mockData";

function AlertList({
  list,
  emptyText,
  metric,
}: {
  list: Employee[];
  emptyText: string;
  metric: (e: Employee) => { label: string; tone: "warn" | "danger" | "info" };
}) {
  if (list.length === 0) {
    return <div className="text-center py-12 text-sm text-muted-foreground">{emptyText}</div>;
  }
  const tones = {
    warn: "bg-warning-soft text-warning border-warning/20",
    danger: "bg-destructive-soft text-destructive border-destructive/20",
    info: "bg-info-soft text-info border-info/20",
  };
  return (
    <div className="divide-y divide-border">
      {list.slice(0, 30).map((e) => {
        const m = metric(e);
        return (
          <div key={e.id} className="flex items-center gap-3 py-3 px-2 hover:bg-muted/30 rounded-md transition-colors">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-info text-primary-foreground">
                {e.name.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{e.name} <span className="text-muted-foreground text-xs font-normal ml-1">{e.id}</span></div>
              <div className="text-xs text-muted-foreground">{e.subsidiary} · {e.department} · {e.position}</div>
            </div>
            <Badge variant="outline" className={`${tones[m.tone]} font-normal tabular-nums`}>{m.label}</Badge>
            <Link to={`/employee/employees/${e.id}`}>
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                处理 <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default function Alerts() {
  const a = getAlerts();
  const total = a.contractExpiring.length + a.idExpiring.length + a.dingTalkMissing.length + a.materialMissing.length;

  const cards = [
    { key: "contract", label: "合同到期", count: a.contractExpiring.length, icon: FileWarning, tone: "warning" as const },
    { key: "id", label: "身份证到期", count: a.idExpiring.length, icon: IdCard, tone: "destructive" as const },
    { key: "ding", label: "钉钉数据未上传", count: a.dingTalkMissing.length, icon: CloudOff, tone: "info" as const },
    { key: "material", label: "学信网未认证", count: a.materialMissing.length, icon: GraduationCap, tone: "primary" as const },
  ];
  const toneClass = {
    warning: "bg-warning-soft text-warning border-warning/30",
    destructive: "bg-destructive-soft text-destructive border-destructive/30",
    info: "bg-info-soft text-info border-info/30",
    primary: "bg-primary-soft text-primary border-primary/30",
  };

  return (
    <div className="p-6 space-y-4 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2.5">
            预警中心
            {total > 0 && <Badge variant="outline" className="bg-destructive-soft text-destructive border-destructive/20">{total} 待处理</Badge>}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            集中查看合同、证件、材料、同步状态等关键风险，及时处理
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Bell className="h-4 w-4" />配置预警规则
        </Button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card key={c.key} className={`p-5 border ${toneClass[c.tone]}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm opacity-90">{c.label}</div>
                <div className="text-3xl font-semibold mt-2 tabular-nums">{c.count}</div>
                <div className="text-xs opacity-70 mt-1">需处理</div>
              </div>
              <c.icon className="h-6 w-6 opacity-70" />
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Card className="border-border/60">
        <Tabs defaultValue="contract">
          <div className="border-b border-border px-4">
            <TabsList className="bg-transparent h-12 p-0 gap-2">
              <TabsTrigger value="contract" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12">
                合同到期 <Badge variant="outline" className="ml-2 font-normal">{a.contractExpiring.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="id" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12">
                身份证到期 <Badge variant="outline" className="ml-2 font-normal">{a.idExpiring.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="ding" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12">
                钉钉数据未上传 <Badge variant="outline" className="ml-2 font-normal">{a.dingTalkMissing.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="material" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12">
                学信网未认证 <Badge variant="outline" className="ml-2 font-normal">{a.materialMissing.length}</Badge>
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="p-4">
            <TabsContent value="contract">
              <AlertList list={a.contractExpiring} emptyText="暂无合同到期预警" metric={(e) => ({ label: `剩 ${e.contractDaysLeft} 天`, tone: e.contractDaysLeft <= 30 ? "danger" : "warn" })} />
            </TabsContent>
            <TabsContent value="id">
              <AlertList list={a.idExpiring} emptyText="暂无身份证到期预警" metric={(e) => ({ label: `剩 ${e.idDaysLeft} 天`, tone: e.idDaysLeft <= 30 ? "danger" : "warn" })} />
            </TabsContent>
            <TabsContent value="ding">
              <AlertList list={a.dingTalkMissing} emptyText="所有员工钉钉数据已同步" metric={() => ({ label: "未同步", tone: "info" })} />
            </TabsContent>
            <TabsContent value="material">
              <AlertList list={a.materialMissing} emptyText="所有学历已完成学信网认证" metric={() => ({ label: "缺学信网认证", tone: "warn" })} />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}
