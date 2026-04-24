import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  UploadCloud,
  Sparkles,
  FileText,
  CheckCircle2,
  Loader2,
  X,
  Plus,
  Users,
} from "lucide-react";
import { SUBSIDIARIES, DEPARTMENTS } from "@/modules/employee/data/mockData";
import { Badge } from "@/components/ui/badge";

type ParsedFile = {
  name: string;
  type: string;
  size: string;
  status: "parsing" | "done";
  fields?: { label: string; value: string }[];
};

const SAMPLE_PARSED: ParsedFile[] = [
  {
    name: "身份证正反面.jpg",
    type: "身份证",
    size: "1.2 MB",
    status: "done",
    fields: [
      { label: "姓名", value: "李思源" },
      { label: "性别", value: "男" },
      { label: "出生日期", value: "1995-08-12" },
      { label: "身份证号", value: "420106199508121234" },
      { label: "民族", value: "汉族" },
      { label: "户籍住址", value: "湖北省武汉市洪山区某街道" },
    ],
  },
  {
    name: "劳动合同.pdf",
    type: "合同",
    size: "856 KB",
    status: "done",
    fields: [
      { label: "合同性质", value: "劳动合同" },
      { label: "合同起止", value: "2024-03-01 ~ 2027-02-28" },
      { label: "岗位", value: "高级研发工程师" },
      { label: "试用期", value: "3 个月" },
    ],
  },
  {
    name: "学历证书.pdf",
    type: "学历",
    size: "412 KB",
    status: "done",
    fields: [
      { label: "毕业院校", value: "华中科技大学" },
      { label: "专业", value: "计算机科学与技术" },
      { label: "学历", value: "硕士" },
      { label: "毕业时间", value: "2020-07-01" },
      { label: "学信网认证", value: "✓ 已认证" },
    ],
  },
];

export default function NewEmployee() {
  const [files, setFiles] = useState<ParsedFile[]>([]);
  const [parsing, setParsing] = useState(false);

  const handleSimulateUpload = () => {
    setParsing(true);
    setFiles(SAMPLE_PARSED.map((f) => ({ ...f, status: "parsing" })));
    SAMPLE_PARSED.forEach((f, i) => {
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((x, idx) => (idx === i ? { ...f, status: "done" as const } : x))
        );
        if (i === SAMPLE_PARSED.length - 1) setParsing(false);
      }, 800 * (i + 1));
    });
  };

  return (
    <div className="p-6 space-y-4 max-w-[1400px] mx-auto">
      <Link to="/employees" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />返回员工档案
      </Link>

      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">新增员工</h1>
          <p className="text-sm text-muted-foreground mt-1">
            上传材料，AI 自动识别并结构化关键信息；若已存在该员工，将自动挂接。
          </p>
        </div>
      </div>

      <Tabs defaultValue="single">
        <TabsList className="bg-card border border-border h-10 p-1">
          <TabsTrigger value="single" className="gap-1.5"><Plus className="h-4 w-4" />单个创建</TabsTrigger>
          <TabsTrigger value="batch" className="gap-1.5"><Users className="h-4 w-4" />批量创建</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Upload zone */}
            <Card className="p-6 border-border/60 lg:col-span-2 h-fit">
              <div className="font-medium text-sm mb-3 flex items-center gap-2">
                <span className="h-1 w-3 rounded bg-primary" />上传员工材料
              </div>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 hover:bg-primary-soft/30 transition-all cursor-pointer" onClick={handleSimulateUpload}>
                <div className="h-12 w-12 rounded-full bg-primary-soft mx-auto flex items-center justify-center">
                  <UploadCloud className="h-6 w-6 text-primary" />
                </div>
                <div className="mt-3 text-sm font-medium">点击或拖拽文件到此处</div>
                <div className="text-xs text-muted-foreground mt-1">
                  支持 身份证、合同、学历、学信网认证、离职证明
                </div>
                <div className="text-xs text-muted-foreground">PDF / JPG / PNG · 单文件 ≤ 20MB</div>
              </div>

              <div className="mt-4 p-3 rounded-md bg-info-soft/60 border border-info/20 flex gap-2">
                <Sparkles className="h-4 w-4 text-info shrink-0 mt-0.5" />
                <div className="text-xs text-info-foreground/90 leading-relaxed">
                  <span className="font-medium text-info">智能识别</span>：上传后将通过 AI 识别姓名 + 证件号码作为主键，
                  若员工已存在则自动挂接到对应档案，否则创建新员工。
                </div>
              </div>
            </Card>

            {/* Parsed result + form */}
            <Card className="p-6 border-border/60 lg:col-span-3">
              <div className="font-medium text-sm mb-3 flex items-center gap-2">
                <span className="h-1 w-3 rounded bg-info" />AI 识别结果
                {parsing && <span className="text-xs text-muted-foreground flex items-center gap-1.5"><Loader2 className="h-3 w-3 animate-spin" />识别中…</span>}
              </div>

              {files.length === 0 ? (
                <div className="text-center py-12 text-sm text-muted-foreground">
                  上传材料后，识别的字段将在此展示
                </div>
              ) : (
                <div className="space-y-3">
                  {files.map((f, i) => (
                    <div key={i} className="border border-border rounded-lg overflow-hidden">
                      <div className="flex items-center gap-3 p-3 bg-muted/30">
                        <div className="h-9 w-9 rounded-md bg-primary-soft flex items-center justify-center">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{f.name}</div>
                          <div className="text-xs text-muted-foreground">{f.type} · {f.size}</div>
                        </div>
                        {f.status === "parsing" ? (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : (
                          <Badge variant="outline" className="bg-success-soft text-success border-success/20 font-normal">
                            <CheckCircle2 className="h-3 w-3 mr-1" />识别完成
                          </Badge>
                        )}
                        <button className="text-muted-foreground hover:text-destructive">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      {f.fields && (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-3 text-sm">
                          {f.fields.map((fld, j) => (
                            <div key={j} className="flex justify-between gap-2 py-1 border-b border-border/40 last:border-0">
                              <span className="text-xs text-muted-foreground">{fld.label}</span>
                              <span className="font-medium text-right">{fld.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Quick form for missing fields */}
                  <div className="mt-5 pt-5 border-t border-border">
                    <div className="text-sm font-medium mb-3">补充信息</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">合同归属</Label>
                        <Select>
                          <SelectTrigger className="h-9"><SelectValue placeholder="选择子公司" /></SelectTrigger>
                          <SelectContent>
                            {SUBSIDIARIES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">部门</Label>
                        <Select>
                          <SelectTrigger className="h-9"><SelectValue placeholder="选择部门" /></SelectTrigger>
                          <SelectContent>
                            {DEPARTMENTS.map((d) => (<SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">现任职务</Label>
                        <Input placeholder="例如：高级研发工程师" className="h-9" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">归属地</Label>
                        <Input placeholder="例如：湖北武汉" className="h-9" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">联系号码</Label>
                        <Input placeholder="11 位手机号" className="h-9" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">紧急联系人</Label>
                        <Input className="h-9" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-5">
                      <Button variant="outline">取消</Button>
                      <Button>确认创建员工</Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="batch" className="mt-4">
          <Card className="p-8 border-border/60">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <div className="h-14 w-14 rounded-full bg-primary-soft mx-auto flex items-center justify-center">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-lg">批量上传员工材料</div>
                <div className="text-sm text-muted-foreground mt-1">
                  上传多份材料压缩包或文件夹，AI 将按 「姓名 + 证件号码」自动归类到对应员工
                </div>
              </div>
              <div className="border-2 border-dashed border-border rounded-lg p-10 text-left">
                <div className="flex items-center justify-center flex-col">
                  <UploadCloud className="h-10 w-10 text-muted-foreground" />
                  <div className="mt-3 text-sm">拖拽文件夹或多份文件到此处</div>
                  <div className="text-xs text-muted-foreground mt-1">支持 ZIP, 单次最多 200 个文件</div>
                  <Button className="mt-4">选择文件</Button>
                </div>
              </div>
              <div className="text-left p-4 rounded-md bg-muted/40 text-xs space-y-2">
                <div className="font-medium text-foreground">智能归类规则</div>
                <ul className="space-y-1 text-muted-foreground">
                  <li>① 通过 OCR 识别每份材料的姓名 + 证件号码</li>
                  <li>② 与系统现有员工匹配，命中则自动挂接</li>
                  <li>③ 未匹配则新建员工档案，并将关键字段结构化存储</li>
                  <li>④ 识别失败的材料会进入「人工复核」队列</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
