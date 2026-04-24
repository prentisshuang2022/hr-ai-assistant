import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  RefreshCw,
  Cloud,
  Clock,
  AlertCircle,
  Search,
  Eye,
  ArrowRight,
} from "lucide-react";

// 钉钉同步的字段（来自钉钉通讯录 / 组织架构 / 花名册）
const DINGTALK_FIELDS = [
  "姓名",
  "性别",
  "手机号",
  "工作邮箱",
  "工号",
  "部门",
  "现任职务",
  "入职时间",
  "出生日期",
  "身份证号码",
  "民族",
  "籍贯",
  "户籍地址",
  "政治面貌",
  "婚育状况",
  "最高学历",
  "毕业院校",
  "毕业时间",
  "专业",
  "紧急联系人",
  "紧急联系人电话",
];

type SyncStatus = "success" | "warning" | "failed";
type SyncType = "全量同步" | "增量同步" | "手动同步";

interface SyncRecord {
  id: string;
  time: string;
  type: SyncType;
  status: SyncStatus;
  total: number;
  added: number;
  updated: number;
  failed: number;
  duration: string;
  message: string;
  operator: string;
}

const LOG: SyncRecord[] = [
  {
    id: "SYNC202504230600",
    time: "2025-04-23 06:00:12",
    type: "全量同步",
    status: "success",
    total: 168,
    added: 0,
    updated: 12,
    failed: 0,
    duration: "48s",
    message: "全量同步完成",
    operator: "系统定时任务",
  },
  {
    id: "SYNC202504221800",
    time: "2025-04-22 18:00:05",
    type: "增量同步",
    status: "success",
    total: 3,
    added: 3,
    updated: 0,
    failed: 0,
    duration: "6s",
    message: "增量同步：新增 3 名员工",
    operator: "系统定时任务",
  },
  {
    id: "SYNC202504221423",
    time: "2025-04-22 14:23:51",
    type: "手动同步",
    status: "warning",
    total: 168,
    added: 0,
    updated: 165,
    failed: 3,
    duration: "52s",
    message: "3 名员工字段缺失：身份证号码、毕业院校",
    operator: "管理员（admin）",
  },
  {
    id: "SYNC202504220600",
    time: "2025-04-22 06:00:08",
    type: "全量同步",
    status: "success",
    total: 165,
    added: 0,
    updated: 8,
    failed: 0,
    duration: "45s",
    message: "全量同步完成",
    operator: "系统定时任务",
  },
  {
    id: "SYNC202504211800",
    time: "2025-04-21 18:00:03",
    type: "增量同步",
    status: "failed",
    total: 0,
    added: 0,
    updated: 0,
    failed: 0,
    duration: "2s",
    message: "钉钉接口超时，已自动重试",
    operator: "系统定时任务",
  },
  {
    id: "SYNC202504210600",
    time: "2025-04-21 06:00:11",
    type: "全量同步",
    status: "success",
    total: 165,
    added: 0,
    updated: 5,
    failed: 0,
    duration: "44s",
    message: "全量同步完成",
    operator: "系统定时任务",
  },
  {
    id: "SYNC202504200600",
    time: "2025-04-20 06:00:09",
    type: "全量同步",
    status: "success",
    total: 165,
    added: 2,
    updated: 6,
    failed: 0,
    duration: "46s",
    message: "全量同步完成",
    operator: "系统定时任务",
  },
];

// 同步详情中的人员（mock）
const NAMES = [
  "张伟", "王芳", "李娜", "刘洋", "陈晨", "杨帆", "赵磊", "黄静",
  "周强", "吴敏", "徐刚", "孙丽",
];
const DEPTS = ["研发部", "财务中心", "供应链", "市场营销部", "项目管理部"];
const POSITIONS = ["工程师", "高级工程师", "经理", "主管", "专员"];

interface SyncedPerson {
  id: string;
  name: string;
  dept: string;
  position: string;
  action: "新增" | "更新" | "失败";
  fields: { name: string; before?: string; after: string; status: "ok" | "missing" }[];
}

function buildPeople(record: SyncRecord): SyncedPerson[] {
  const count = Math.min(
    record.added + record.updated + record.failed || record.total,
    record.total || 12,
  );
  const list: SyncedPerson[] = [];
  for (let i = 0; i < Math.min(count, 12); i++) {
    const action: SyncedPerson["action"] =
      i < record.added
        ? "新增"
        : i < record.added + record.updated
        ? "更新"
        : "失败";
    list.push({
      id: `EMP${String(10000 + i + 1).slice(1)}`,
      name: NAMES[i % NAMES.length],
      dept: DEPTS[i % DEPTS.length],
      position: POSITIONS[i % POSITIONS.length],
      action,
      fields:
        action === "新增"
          ? DINGTALK_FIELDS.slice(0, 8).map((f) => ({
              name: f,
              after: f === "姓名" ? NAMES[i % NAMES.length] : "—",
              status: "ok" as const,
            }))
          : action === "更新"
          ? [
              { name: "现任职务", before: "工程师", after: "高级工程师", status: "ok" },
              { name: "部门", before: "研发部", after: "研发部·算法组", status: "ok" },
              { name: "手机号", before: "138****1234", after: "138****5678", status: "ok" },
            ]
          : [
              { name: "身份证号码", after: "（钉钉花名册中缺失）", status: "missing" },
              { name: "毕业院校", after: "（钉钉花名册中缺失）", status: "missing" },
            ],
    });
  }
  return list;
}

const STATUS_META: Record<SyncStatus, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  success: {
    label: "成功",
    cls: "bg-success-soft text-success border-success/20",
    icon: CheckCircle2,
  },
  warning: {
    label: "部分异常",
    cls: "bg-warning-soft text-warning border-warning/20",
    icon: AlertCircle,
  },
  failed: {
    label: "失败",
    cls: "bg-destructive/10 text-destructive border-destructive/20",
    icon: AlertCircle,
  },
};

export default function Sync() {
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [active, setActive] = useState<SyncRecord | null>(null);
  const [personFilter, setPersonFilter] = useState<string>("all");

  const filtered = LOG.filter((l) => {
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (typeFilter !== "all" && l.type !== typeFilter) return false;
    if (
      keyword &&
      !l.id.toLowerCase().includes(keyword.toLowerCase()) &&
      !l.message.toLowerCase().includes(keyword.toLowerCase())
    )
      return false;
    return true;
  });

  const people = active ? buildPeople(active) : [];
  const filteredPeople =
    personFilter === "all"
      ? people
      : people.filter((p) =>
          personFilter === "added"
            ? p.action === "新增"
            : personFilter === "updated"
            ? p.action === "更新"
            : p.action === "失败",
        );

  return (
    <div className="p-6 space-y-4 max-w-[1400px] mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">钉钉同步</h1>
          <p className="text-sm text-muted-foreground mt-1">
            查看钉钉同步日志，追踪每次同步涉及的具体人员与字段变更
          </p>
        </div>
        <Button size="sm" className="gap-1.5">
          <RefreshCw className="h-4 w-4" />
          立即同步
        </Button>
      </div>

      {/* Connection status */}
      <Card className="p-5 border-border/60">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-info to-primary flex items-center justify-center">
            <Cloud className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold">钉钉企业账号</span>
              <Badge
                variant="outline"
                className="bg-success-soft text-success border-success/20 font-normal"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-success mr-1.5 animate-pulse" />
                已连接
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              企业 ID: ding_xxxxxxxxxxxx · 通讯录权限 ✓ · 组织架构权限 ✓ · 花名册权限 ✓
            </div>
          </div>
          <div className="grid grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-semibold tabular-nums">168</div>
              <div className="text-xs text-muted-foreground">已同步员工</div>
            </div>
            <div>
              <div className="text-2xl font-semibold tabular-nums">
                {DINGTALK_FIELDS.length}
              </div>
              <div className="text-xs text-muted-foreground">同步字段数</div>
            </div>
            <div>
              <div className="text-2xl font-semibold tabular-nums text-success">98.2%</div>
              <div className="text-xs text-muted-foreground">字段完整率</div>
            </div>
            <div>
              <div className="text-2xl font-semibold tabular-nums">
                5<span className="text-sm">分钟前</span>
              </div>
              <div className="text-xs text-muted-foreground">最近同步</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Sync log */}
      <Card className="p-5 border-border/60">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <div className="font-semibold">同步日志</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              点击任意一行可查看本次同步涉及的人员及字段详情
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜索任务编号 / 描述"
                className="h-8 pl-8 w-56"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-8 w-32">
                <SelectValue placeholder="同步类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="全量同步">全量同步</SelectItem>
                <SelectItem value="增量同步">增量同步</SelectItem>
                <SelectItem value="手动同步">手动同步</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-32">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="success">成功</SelectItem>
                <SelectItem value="warning">部分异常</SelectItem>
                <SelectItem value="failed">失败</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">任务编号</TableHead>
              <TableHead>同步时间</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>状态</TableHead>
              <TableHead className="text-right">总数</TableHead>
              <TableHead className="text-right">新增</TableHead>
              <TableHead className="text-right">更新</TableHead>
              <TableHead className="text-right">失败</TableHead>
              <TableHead>耗时</TableHead>
              <TableHead>触发方</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((l) => {
              const meta = STATUS_META[l.status];
              const Icon = meta.icon;
              return (
                <TableRow
                  key={l.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setActive(l);
                    setPersonFilter("all");
                  }}
                >
                  <TableCell className="font-mono text-xs">{l.id}</TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {l.time}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal text-xs">
                      {l.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${meta.cls} font-normal text-xs gap-1`}
                    >
                      <Icon className="h-3 w-3" />
                      {meta.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{l.total}</TableCell>
                  <TableCell className="text-right tabular-nums text-success">
                    {l.added > 0 ? `+${l.added}` : "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {l.updated > 0 ? l.updated : "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-destructive">
                    {l.failed > 0 ? l.failed : "—"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {l.duration}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {l.operator}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
                      <Eye className="h-3 w-3" />
                      详情
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="text-center text-sm text-muted-foreground py-10"
                >
                  暂无符合条件的同步记录
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Detail dialog */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  同步详情
                  <Badge variant="outline" className="font-normal text-xs">
                    {active.type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`${STATUS_META[active.status].cls} font-normal text-xs`}
                  >
                    {STATUS_META[active.status].label}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs font-mono">
                  {active.id} · {active.time} · 耗时 {active.duration} · {active.operator}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-4 gap-3 py-3 border-y border-border/60">
                <div>
                  <div className="text-xs text-muted-foreground">本次涉及</div>
                  <div className="text-xl font-semibold tabular-nums">
                    {active.total}
                    <span className="text-sm font-normal text-muted-foreground ml-1">人</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">新增</div>
                  <div className="text-xl font-semibold tabular-nums text-success">
                    {active.added}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">更新</div>
                  <div className="text-xl font-semibold tabular-nums">
                    {active.updated}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">失败</div>
                  <div className="text-xl font-semibold tabular-nums text-destructive">
                    {active.failed}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-sm font-medium">人员变更明细</div>
                <Select value={personFilter} onValueChange={setPersonFilter}>
                  <SelectTrigger className="h-8 w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="added">仅新增</SelectItem>
                    <SelectItem value="updated">仅更新</SelectItem>
                    <SelectItem value="failed">仅失败</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-auto flex-1 -mx-6 px-6">
                <div className="space-y-2">
                  {filteredPeople.map((p) => (
                    <div
                      key={p.id + p.action}
                      className="border border-border/60 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{p.name}</span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {p.id}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            · {p.dept} · {p.position}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs font-normal ${
                            p.action === "新增"
                              ? "bg-success-soft text-success border-success/20"
                              : p.action === "更新"
                              ? "bg-info-soft text-info border-info/20"
                              : "bg-destructive/10 text-destructive border-destructive/20"
                          }`}
                        >
                          {p.action}
                        </Badge>
                      </div>
                      <div className="mt-2.5 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1.5">
                        {p.fields.map((f, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-xs py-1"
                          >
                            <span className="text-muted-foreground w-20 shrink-0">
                              {f.name}
                            </span>
                            {f.before !== undefined ? (
                              <span className="flex items-center gap-1 min-w-0">
                                <span className="text-muted-foreground line-through truncate">
                                  {f.before}
                                </span>
                                <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                                <span className="text-foreground truncate">{f.after}</span>
                              </span>
                            ) : (
                              <span
                                className={`truncate ${
                                  f.status === "missing"
                                    ? "text-destructive"
                                    : "text-foreground"
                                }`}
                              >
                                {f.after}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {filteredPeople.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground py-10">
                      本次同步无符合条件的人员变更
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-border/60">
                <div className="text-xs text-muted-foreground">
                  本次同步涉及的钉钉字段范围（共 {DINGTALK_FIELDS.length} 个）：
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {DINGTALK_FIELDS.map((f) => (
                    <Badge
                      key={f}
                      variant="outline"
                      className="font-normal text-xs bg-muted/30"
                    >
                      {f}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
