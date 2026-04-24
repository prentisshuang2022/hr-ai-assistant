import { useParams, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Phone,
  Calendar,
  MapPin,
  GraduationCap,
  FileText,
  ShieldAlert,
  Download,
  CheckCircle2,
  XCircle,
  Sparkles,
  Cloud,
  Save,
  X,
  Upload,
  User,
  Briefcase,
  BookOpen,
  History,
  Plus,
} from "lucide-react";
import { EMPLOYEES, type EmployeeStatus } from "@/modules/employee/data/mockData";

const STATUS_STYLE: Record<EmployeeStatus, string> = {
  在职: "bg-success-soft text-success border-success/20",
  试用期: "bg-info-soft text-info border-info/20",
  离职: "bg-muted text-muted-foreground border-border",
};

function Field({
  label,
  value,
  locked,
  editable,
  editing,
  onChange,
}: {
  label: string;
  value: any;
  locked?: boolean;
  editable?: boolean;
  editing?: boolean;
  onChange?: (v: string) => void;
}) {
  const isEditing = editing && editable && !locked;
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3 py-2.5 border-b border-border/60 last:border-0 group">
      <div className="text-xs text-muted-foreground pt-0.5 flex items-center gap-1">
        {label}
        {locked && <Cloud className="h-3 w-3 text-info" />}
      </div>
      <div className="text-sm">
        {isEditing ? (
          <Input
            defaultValue={typeof value === "string" ? value : ""}
            onChange={(e) => onChange?.(e.target.value)}
            className="h-8 text-sm"
          />
        ) : (
          value ?? <span className="text-muted-foreground">—</span>
        )}
      </div>
    </div>
  );
}

const SECTIONS = [
  { id: "basic", label: "基本信息", icon: User },
  { id: "contract", label: "合同 & 编制", icon: Briefcase },
  { id: "education", label: "教育背景", icon: BookOpen },
  { id: "materials", label: "证件材料", icon: FileText },
  { id: "timeline", label: "关键时间节点", icon: History },
];

export default function EmployeeDetail() {
  const { id } = useParams();
  const e = EMPLOYEES.find((x) => x.id === id);
  const [editing, setEditing] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");
  const [materials, setMaterials] = useState(e?.materials ?? []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = () => {
      const offsets = SECTIONS.map((s) => {
        const el = document.getElementById(s.id);
        return { id: s.id, top: el?.getBoundingClientRect().top ?? Infinity };
      });
      const current = offsets
        .filter((o) => o.top < 200)
        .sort((a, b) => b.top - a.top)[0];
      if (current) setActiveSection(current.id);
    };
    window.addEventListener("scroll", handler, true);
    return () => window.removeEventListener("scroll", handler, true);
  }, []);

  if (!e) {
    return (
      <div className="p-12 text-center">
        <p className="text-muted-foreground">员工不存在</p>
        <Link to="/employees" className="text-primary text-sm mt-3 inline-block">返回列表</Link>
      </div>
    );
  }

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleUpload = (files: FileList | null) => {
    if (!files) return;
    const newOnes = Array.from(files).map((f) => ({
      name: f.name,
      type: "其他" as any,
      uploadedAt: new Date().toISOString().slice(0, 10),
      verified: false,
    }));
    setMaterials([...materials, ...newOnes]);
    toast({ title: "上传成功", description: `已添加 ${files.length} 份材料，AI 正在识别...` });
  };

  const handleDeleteMaterial = (i: number) => {
    setMaterials(materials.filter((_, idx) => idx !== i));
    toast({ title: "已删除", description: "材料已从档案中移除" });
  };

  const handleSave = () => {
    setEditing(false);
    toast({ title: "已保存", description: "员工信息已更新" });
  };

  // Build timeline events
  const timelineEvents = [
    { date: e.joinDate, title: "入职", desc: `加入 ${e.subsidiary} - ${e.department}，担任 ${e.position}`, color: "bg-success" },
    ...(e.status !== "试用期"
      ? [{
          date: new Date(new Date(e.joinDate).getTime() + 90 * 86400000).toISOString().slice(0, 10),
          title: "转正",
          desc: "通过试用期考核，转为正式员工",
          color: "bg-info",
        }]
      : []),
    { date: e.contractStart, title: "签订合同", desc: `${e.contractType} · 至 ${e.contractEnd}`, color: "bg-primary" },
    ...(e.transferDate ? [{ date: e.transferDate, title: "岗位调动", desc: "调入新岗位", color: "bg-info" }] : []),
    ...(e.resignDate ? [{ date: e.resignDate, title: "离职", desc: e.resignReason ?? "", color: "bg-destructive" }] : []),
  ].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      <Link to="/employees" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" />返回员工档案
      </Link>

      {/* Profile header */}
      <Card className="p-6 border-border/60 relative overflow-hidden mb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-soft/40 to-transparent pointer-events-none" />
        <div className="relative flex flex-wrap items-start gap-5">
          <Avatar className="h-20 w-20 ring-4 ring-card shadow-md">
            <AvatarFallback className="bg-gradient-to-br from-primary to-info text-primary-foreground text-2xl font-medium">
              {e.name.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-semibold">{e.name}</h1>
              <Badge variant="outline" className={`${STATUS_STYLE[e.status]} font-normal`}>{e.status}</Badge>
              <Badge variant="outline" className="font-normal text-xs">
                {e.source === "钉钉同步" ? <Cloud className="h-3 w-3 mr-1" /> : e.source === "AI识别" ? <Sparkles className="h-3 w-3 mr-1" /> : null}
                {e.source}
              </Badge>
              {e.alerts.length > 0 && (
                <Badge variant="outline" className="bg-warning-soft text-warning border-warning/20 font-normal">
                  <ShieldAlert className="h-3 w-3 mr-1" />
                  {e.alerts.length} 项预警
                </Badge>
              )}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {e.position} · {e.department} · {e.subsidiary}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="text-foreground/50">工号</span><span className="font-mono text-foreground/80">{e.id}</span></span>
              <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{e.phone}</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />入职 {e.joinDate} · {e.tenure}</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{e.location}</span>
              <span className="flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5" />{e.school} · {e.highestEducation}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <Button size="sm" className="gap-1.5" onClick={handleSave}>
                  <Save className="h-4 w-4" />保存
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setEditing(false)}>
                  <X className="h-4 w-4" />取消
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setEditing(true)}>
                  <Edit className="h-4 w-4" />编辑
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/5">
                  <Trash2 className="h-4 w-4" />删除
                </Button>
              </>
            )}
          </div>
        </div>

        {e.alerts.length > 0 && (
          <div className="relative mt-4 flex flex-wrap gap-2">
            {e.alerts.map((a) => (
              <div key={a} className="text-xs bg-warning-soft text-warning px-2.5 py-1 rounded-md border border-warning/20 flex items-center gap-1.5">
                <ShieldAlert className="h-3 w-3" />{a}
                {a === "合同到期" && <span className="text-foreground/70">· 剩 {e.contractDaysLeft} 天</span>}
                {a === "身份证到期" && <span className="text-foreground/70">· 剩 {e.idDaysLeft} 天</span>}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Anchor layout */}
      <div className="grid grid-cols-[180px_1fr] gap-5 items-start">
        {/* Anchor nav */}
        <nav className="sticky top-4 self-start">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground px-2 mb-2">页面导航</div>
          <ul className="space-y-0.5">
            {SECTIONS.map((s) => {
              const isActive = activeSection === s.id;
              return (
                <li key={s.id}>
                  <button
                    onClick={() => scrollTo(s.id)}
                    className={`w-full flex items-center gap-2 px-2.5 h-9 rounded-md text-sm transition-colors text-left ${
                      isActive
                        ? "bg-primary-soft text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <s.icon className="h-4 w-4" />
                    <span>{s.label}</span>
                    {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Long form content */}
        <div className="space-y-4 min-w-0">
          {/* Basic info */}
          <Card id="basic" className="p-5 border-border/60 scroll-mt-20">
            <div className="font-medium text-sm mb-3 flex items-center gap-2">
              <span className="h-1 w-3 rounded bg-primary" />基本信息
              <span className="ml-auto text-[11px] text-muted-foreground flex items-center gap-1">
                <Cloud className="h-3 w-3" />钉钉同步字段不可编辑
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div className="divide-y divide-border/60">
                <Field label="姓名" value={e.name} locked />
                <Field label="性别" value={e.gender} locked />
                <Field label="出生日期" value={e.birthday} locked />
                <Field label="员工年龄" value={`${e.age} 岁`} />
                <Field label="身份证号码" value={e.idNumber} locked />
                <Field label="身份证起止" value={`${e.idStart} ~ ${e.idEnd}`} editable editing={editing} />
                <Field label="到期提醒" value={
                  e.idDaysLeft <= 90
                    ? <span className="text-warning">剩 {e.idDaysLeft} 天</span>
                    : `剩 ${e.idDaysLeft} 天`
                } />
              </div>
              <div className="divide-y divide-border/60">
                <Field label="户籍住址" value={e.household} editable editing={editing} />
                <Field label="民族" value={e.ethnicity} editable editing={editing} />
                <Field label="籍贯" value={e.nativePlace} editable editing={editing} />
                <Field label="政治面貌" value={e.political} editable editing={editing} />
                <Field label="是否婚育" value={e.marital} editable editing={editing} />
                <Field label="联系号码" value={e.phone} locked />
                <Field label="紧急联系人" value={e.emergencyContact} editable editing={editing} />
                <Field label="紧急联系电话" value={e.emergencyPhone} editable editing={editing} />
                <Field label="归属地" value={e.location} editable editing={editing} />
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-border/60">
              <div className="text-xs text-muted-foreground mb-1.5">备注</div>
              {editing ? (
                <Input defaultValue={e.remark ?? ""} className="h-8 text-sm" />
              ) : (
                <div className="text-sm text-muted-foreground">{e.remark ?? "无"}</div>
              )}
            </div>
          </Card>

          {/* Contract */}
          <Card id="contract" className="p-5 border-border/60 scroll-mt-20">
            <div className="font-medium text-sm mb-3 flex items-center gap-2">
              <span className="h-1 w-3 rounded bg-primary" />合同与编制信息
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div className="divide-y divide-border/60">
                <Field label="合同归属" value={e.subsidiary} editable editing={editing} />
                <Field label="现用人编制" value={e.currentHeadcount} editable editing={editing} />
                <Field label="原用人编制" value={e.originalHeadcount ?? "—"} editable editing={editing} />
                <Field label="部门" value={e.department} locked />
                <Field label="现任职务" value={e.position} locked />
                <Field label="入职时间" value={e.joinDate} locked />
                <Field label="员工司龄" value={e.tenure} />
              </div>
              <div className="divide-y divide-border/60">
                <Field label="合同性质" value={e.contractType} editable editing={editing} />
                <Field label="现合同起止" value={`${e.contractStart} ~ ${e.contractEnd}`} editable editing={editing} />
                <Field label="到期天数" value={
                  <span className={e.contractDaysLeft <= 60 ? "text-warning font-medium" : ""}>
                    剩 {e.contractDaysLeft} 天
                  </span>
                } />
                <Field label="原合同起止" value="—" editable editing={editing} />
                <Field label="调岗时间" value={e.transferDate ?? "—"} editable editing={editing} />
                {e.status === "离职" && (
                  <>
                    <Field label="离职时间" value={e.resignDate} editable editing={editing} />
                    <Field label="离职原因" value={e.resignReason} editable editing={editing} />
                  </>
                )}
              </div>
            </div>
          </Card>

          {/* Education */}
          <Card id="education" className="p-5 border-border/60 scroll-mt-20">
            <div className="font-medium text-sm mb-3 flex items-center gap-2">
              <span className="h-1 w-3 rounded bg-info" />教育背景
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div className="divide-y divide-border/60">
                <Field label="最高学历" value={
                  <span className="flex items-center gap-2">
                    {e.highestEducation}
                    {e.alerts.includes("学信网未认证") ? (
                      <Badge variant="outline" className="bg-destructive-soft text-destructive border-destructive/20 text-[10px] font-normal">未认证</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-success-soft text-success border-success/20 text-[10px] font-normal">学信网已认证</Badge>
                    )}
                  </span>
                } editable editing={editing} />
                <Field label="第一学历" value={e.firstEducation} editable editing={editing} />
                <Field label="学历类别" value={e.educationCategory} editable editing={editing} />
              </div>
              <div className="divide-y divide-border/60">
                <Field label="毕业院校" value={e.school} editable editing={editing} />
                <Field label="毕业时间" value={e.graduationDate} editable editing={editing} />
                <Field label="专业" value={e.major} editable editing={editing} />
              </div>
            </div>
          </Card>

          {/* Materials */}
          <Card id="materials" className="p-5 border-border/60 scroll-mt-20">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium text-sm flex items-center gap-2">
                <span className="h-1 w-3 rounded bg-primary" />证件材料
                <Badge variant="outline" className="ml-2 font-normal text-[10px]">
                  <Sparkles className="h-3 w-3 mr-1 text-primary" />AI 已识别 {materials.length} 份
                </Badge>
              </div>
              {editing && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(ev) => handleUpload(ev.target.files)}
                  />
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4" />上传新材料
                  </Button>
                </>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {materials.map((m, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors">
                  <div className="h-10 w-10 rounded-md bg-primary-soft flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{m.name}</span>
                      {m.verified ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {m.type} · 上传于 {m.uploadedAt}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                  {editing && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/5"
                      onClick={() => handleDeleteMaterial(i)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {editing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-border bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-colors text-sm text-muted-foreground"
                >
                  <Plus className="h-4 w-4" />添加材料
                </button>
              )}
            </div>
          </Card>

          {/* Timeline */}
          <Card id="timeline" className="p-5 border-border/60 scroll-mt-20">
            <div className="font-medium text-sm mb-4 flex items-center gap-2">
              <span className="h-1 w-3 rounded bg-info" />关键时间节点
              <span className="text-[11px] text-muted-foreground font-normal">入职 / 转正 / 签约 / 调岗 / 离职 等</span>
            </div>
            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-1.5 before:bottom-1.5 before:w-px before:bg-border">
              {timelineEvents.map((ev, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-[18px] top-1 h-3 w-3 rounded-full ${ev.color} ring-4 ring-card`} />
                  <div className="text-xs text-muted-foreground tabular-nums">{ev.date}</div>
                  <div className="text-sm font-medium mt-0.5">{ev.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{ev.desc}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
