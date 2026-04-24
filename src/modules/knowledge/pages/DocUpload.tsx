import { useRef, useState } from "react";
import { FileText, Upload, FileType, FileCheck2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TEMPLATES, type DocCategory } from "../data/mock";

interface Draft {
  title: string;
  category: DocCategory | "";
  tags: string;
  content: string;
}

const empty: Draft = { title: "", category: "", tags: "", content: "" };

const DocUpload = () => {
  const [draft, setDraft] = useState<Draft>(empty);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [uploads, setUploads] = useState<{ name: string; size: string; type: string; at: string }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const applyTemplate = (key: DocCategory) => {
    const tpl = TEMPLATES.find((t) => t.key === key);
    if (!tpl) return;
    setDraft((d) => ({ ...d, category: key, content: tpl.content }));
    toast.success(`已应用「${tpl.name}」`);
  };

  const submit = () => {
    if (!draft.title.trim()) return toast.error("请填写文档标题");
    if (!draft.category) return toast.error("请选择文档分类");
    if (!draft.content.trim()) return toast.error("文档正文不能为空");
    toast.success(`文档「${draft.title}」已保存到知识库`);
    setDraft(empty);
  };

  const onPickFile = (files: FileList | null) => {
    if (!files || !files.length) return;
    const items = Array.from(files).map((f) => {
      const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
      const ok = ["doc", "docx", "pdf"].includes(ext);
      if (!ok) toast.error(`${f.name} 不支持，仅支持 Word / PDF`);
      return ok
        ? {
            name: f.name,
            size: `${(f.size / 1024).toFixed(1)} KB`,
            type: ext.toUpperCase(),
            at: new Date().toLocaleString("zh-CN", { hour12: false }),
          }
        : null;
    }).filter(Boolean) as typeof uploads;
    if (items.length) {
      setUploads((u) => [...items, ...u]);
      toast.success(`已上传 ${items.length} 个文件，进入解析队列`);
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">文档录入</h1>
        <p className="text-sm text-muted-foreground mt-1">支持富文本编辑与 Word/PDF 上传，使用模板保证格式统一。</p>
      </div>

      <Tabs defaultValue="editor">
        <TabsList>
          <TabsTrigger value="editor"><FileText className="h-4 w-4 mr-1.5" />富文本编辑</TabsTrigger>
          <TabsTrigger value="upload"><Upload className="h-4 w-4 mr-1.5" />Word / PDF 上传</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">编辑文档</CardTitle>
                <CardDescription>填写基本信息后撰写正文，可随时套用右侧模板。</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>文档标题</Label>
                    <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="如：员工请假管理制度" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>分类</Label>
                    <Select value={draft.category} onValueChange={(v) => setDraft({ ...draft, category: v as DocCategory })}>
                      <SelectTrigger><SelectValue placeholder="选择分类" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="政策类">政策类</SelectItem>
                        <SelectItem value="流程类">流程类</SelectItem>
                        <SelectItem value="FAQ类">FAQ类</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>标签（逗号分隔）</Label>
                  <Input value={draft.tags} onChange={(e) => setDraft({ ...draft, tags: e.target.value })} placeholder="如：请假, 考勤, 制度" />
                </div>

                <div className="space-y-1.5">
                  <Label>正文</Label>
                  <div className="rounded-md border">
                    <div className="flex items-center gap-1 border-b bg-muted/40 px-2 py-1.5">
                      <Button type="button" size="sm" variant={bold ? "secondary" : "ghost"} className="h-7 px-2 font-bold" onClick={() => setBold(!bold)}>B</Button>
                      <Button type="button" size="sm" variant={italic ? "secondary" : "ghost"} className="h-7 px-2 italic" onClick={() => setItalic(!italic)}>I</Button>
                      <span className="mx-1 h-4 w-px bg-border" />
                      <Button type="button" size="sm" variant="ghost" className="h-7 px-2" onClick={() => setDraft((d) => ({ ...d, content: d.content + "\n\n## 标题\n" }))}>H2</Button>
                      <Button type="button" size="sm" variant="ghost" className="h-7 px-2" onClick={() => setDraft((d) => ({ ...d, content: d.content + "\n- 列表项\n" }))}>列表</Button>
                      <Button type="button" size="sm" variant="ghost" className="h-7 px-2" onClick={() => setDraft((d) => ({ ...d, content: d.content + "\n> 引用\n" }))}>引用</Button>
                    </div>
                    <Textarea
                      value={draft.content}
                      onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                      placeholder="在此撰写文档正文，支持 Markdown 语法……"
                      className={`min-h-[360px] border-0 focus-visible:ring-0 ${bold ? "font-bold" : ""} ${italic ? "italic" : ""}`}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDraft(empty)}>清空</Button>
                  <Button onClick={submit}><FileCheck2 className="h-4 w-4" />保存到知识库</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />常用模板</CardTitle>
                <CardDescription>点击套用，保证文档格式统一。</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {TEMPLATES.map((t) => (
                  <div key={t.key} className="rounded-lg border p-3 hover:bg-muted/40 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium text-sm">{t.name}</div>
                      <Badge variant="secondary">{t.key}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
                    <Button size="sm" variant="outline" className="mt-2 w-full" onClick={() => applyTemplate(t.key)}>套用模板</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upload" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">上传 Word / PDF</CardTitle>
              <CardDescription>支持 .doc / .docx / .pdf，单文件不超过 20MB。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); onPickFile(e.dataTransfer.files); }}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-12 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="text-sm font-medium">点击或拖拽文件到此区域上传</div>
                <div className="text-xs text-muted-foreground">支持格式：.doc / .docx / .pdf</div>
                <input ref={fileRef} type="file" accept=".doc,.docx,.pdf" multiple className="hidden" onChange={(e) => onPickFile(e.target.files)} />
              </div>

              {uploads.length > 0 && (
                <div className="rounded-lg border">
                  <div className="border-b bg-muted/40 px-3 py-2 text-sm font-medium">已上传文件</div>
                  <ul className="divide-y">
                    {uploads.map((f, i) => (
                      <li key={i} className="flex items-center justify-between gap-3 px-3 py-2.5 text-sm">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileType className="h-4 w-4 text-primary shrink-0" />
                          <span className="truncate">{f.name}</span>
                          <Badge variant="outline" className="shrink-0">{f.type}</Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                          <span>{f.size}</span>
                          <span>{f.at}</span>
                          <Badge variant="secondary">解析中</Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocUpload;
