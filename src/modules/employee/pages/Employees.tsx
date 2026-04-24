import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Download, Filter, AlertTriangle, MoreHorizontal } from "lucide-react";
import { EMPLOYEES, SUBSIDIARIES, DEPARTMENTS, type EmployeeStatus } from "@/modules/employee/data/mockData";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const STATUS_STYLE: Record<EmployeeStatus, string> = {
  在职: "bg-success-soft text-success border-success/20",
  试用期: "bg-info-soft text-info border-info/20",
  离职: "bg-muted text-muted-foreground border-border",
};

export default function Employees() {
  const [q, setQ] = useState("");
  const [sub, setSub] = useState<string>("all");
  const [dept, setDept] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const PER = 12;

  const list = useMemo(() => {
    return EMPLOYEES.filter((e) => {
      if (q && !(e.name.includes(q) || e.id.includes(q) || e.phone.includes(q))) return false;
      if (sub !== "all" && e.subsidiary !== sub) return false;
      if (dept !== "all" && e.department !== dept) return false;
      if (status !== "all" && e.status !== status) return false;
      return true;
    });
  }, [q, sub, dept, status]);

  const pageData = list.slice((page - 1) * PER, page * PER);
  const totalPages = Math.ceil(list.length / PER);

  return (
    <div className="p-6 space-y-4 max-w-[1600px] mx-auto">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">员工档案</h1>
          <p className="text-sm text-muted-foreground mt-1">
            共 <span className="text-foreground font-medium">{list.length}</span> 名员工 · 在职{" "}
            {list.filter((e) => e.status === "在职").length} 人
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" />导出
          </Button>
          <Link to="/employee/employees/new">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />新增员工
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 border-border/60">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索姓名 / 工号 / 手机号"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              className="pl-9 h-9"
            />
          </div>
          <Select value={sub} onValueChange={(v) => { setSub(v); setPage(1); }}>
            <SelectTrigger className="w-36 h-9"><SelectValue placeholder="子公司" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部子公司</SelectItem>
              {SUBSIDIARIES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={dept} onValueChange={(v) => { setDept(v); setPage(1); }}>
            <SelectTrigger className="w-40 h-9"><SelectValue placeholder="部门" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部部门</SelectItem>
              {DEPARTMENTS.map((d) => (<SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="w-32 h-9"><SelectValue placeholder="状态" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="在职">在职</SelectItem>
              <SelectItem value="试用期">试用期</SelectItem>
              <SelectItem value="离职">离职</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm" className="h-9 gap-1.5 text-muted-foreground">
            <Filter className="h-4 w-4" />更多筛选
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="border-border/60 overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground bg-muted/40 border-b border-border">
                <th className="text-left font-normal py-3 px-4">员工</th>
                <th className="text-left font-normal py-3 px-4">工号</th>
                <th className="text-left font-normal py-3 px-4">合同归属</th>
                <th className="text-left font-normal py-3 px-4">部门 / 职务</th>
                <th className="text-left font-normal py-3 px-4">入职时间</th>
                <th className="text-left font-normal py-3 px-4">合同到期</th>
                <th className="text-left font-normal py-3 px-4">状态</th>
                <th className="text-left font-normal py-3 px-4">来源</th>
                <th className="text-right font-normal py-3 px-4">操作</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((e) => (
                <tr key={e.id} className="border-b border-border/60 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <Link to={`/employee/employees/${e.id}`} className="flex items-center gap-2.5 group">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-info text-primary-foreground">
                          {e.name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-medium group-hover:text-primary transition-colors flex items-center gap-1.5">
                          {e.name}
                          {e.alerts.length > 0 && (
                            <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">{e.gender} · {e.age}岁</div>
                      </div>
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground tabular-nums">{e.id}</td>
                  <td className="py-3 px-4">{e.subsidiary}</td>
                  <td className="py-3 px-4">
                    <div>{e.department}</div>
                    <div className="text-xs text-muted-foreground">{e.position}</div>
                  </td>
                  <td className="py-3 px-4 tabular-nums text-muted-foreground">{e.joinDate}</td>
                  <td className="py-3 px-4 tabular-nums">
                    <div>{e.contractEnd}</div>
                    <div className={`text-xs ${e.contractDaysLeft <= 60 ? "text-warning" : "text-muted-foreground"}`}>
                      剩 {e.contractDaysLeft} 天
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className={`${STATUS_STYLE[e.status]} font-normal`}>
                      {e.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-muted-foreground">{e.source}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link to={`/employee/employees/${e.id}`} className="text-primary hover:underline text-sm">详情</Link>
                    <Button variant="ghost" size="icon" className="h-7 w-7 ml-1">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {pageData.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-muted-foreground text-sm">
                    没有匹配的员工
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="p-3 border-t border-border">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} className="cursor-pointer" />
                </PaginationItem>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === page}
                      onClick={() => setPage(p)}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="cursor-pointer" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>
    </div>
  );
}
