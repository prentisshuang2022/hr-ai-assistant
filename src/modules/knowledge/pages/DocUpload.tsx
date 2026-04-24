import { useRef, useState } from "react";
import { Upload, FileType } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DocUpload = () => {
  const [uploads, setUploads] = useState<{ name: string; size: string; type: string; at: string }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

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
        <p className="text-sm text-muted-foreground mt-1">支持 Word / PDF 上传，自动进入解析队列。</p>
      </div>

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
    </div>
  );
};

export default DocUpload;
