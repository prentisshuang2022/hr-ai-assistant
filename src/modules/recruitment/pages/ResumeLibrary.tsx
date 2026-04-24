import { AppShell } from "@/shared/AppShell";
import { jobs, candidates } from "@/modules/recruitment/data/recruit";
import { Button } from "@/components/ui/button";
import { Upload, FolderOpen, FileText, Sparkles, Calendar, Briefcase, CheckCircle2, AlertCircle } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const ResumeLibrary = () => {
  const [selectedJob, setSelectedJob] = useState<string>(jobs[0].id);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (files: FileList | null) => {
    if (!files || !files.length) return;
    toast.success(`已上传 ${files.length} 份简历，AI 正在解析...`, {
      description: "解析完成后将自动入库并生成候选人卡片",
    });
  };

  const folders = jobs.map((j) => ({
    id: j.id,
    title: j.title,
    company: j.company,
    count: candidates.filter((c) => c.jobId === j.id).length,
    latest: candidates
      .filter((c) => c.jobId === j.id)
      .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))[0]?.uploadedAt,
  }));

  const jobCandidates = candidates.filter((c) => c.jobId === selectedJob);

  return (
    <AppShell breadcrumbs={[{ label: "招聘管理" }, { label: "简历库" }]}>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">简历库</h1>
          <p className="text-sm text-muted-foreground mt-2">
            按岗位 / 时间沉淀候选人池 · AI 自动解析与初筛
          </p>
        </div>
      </div>

      {/* Upload area */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleUpload(e.dataTransfer.files);
        }}
        className="bg-card rounded-2xl border-2 border-dashed border-border hover:border-primary hover:bg-primary-soft/40 transition-all p-10 mb-6 text-center cursor-pointer"
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
        <div className="w-14 h-14 rounded-2xl bg-primary-soft text-primary flex items-center justify-center mx-auto mb-4">
          <Upload className="w-6 h-6" />
        </div>
        <div className="text-base font-semibold text-foreground mb-1">拖拽简历到此处，或点击选择文件</div>
        <div className="text-sm text-muted-foreground mb-4">支持 PDF / Word，单次最多 50 份，AI 自动解析为统一结构</div>
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-primary" /> 基本信息提取</span>
          <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-primary" /> 学历 / 工作经历</span>
          <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-primary" /> 亮点 / 风险点 总结</span>
          <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-primary" /> 关联 JD 智能匹配</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Folder list */}
        <div className="bg-card rounded-2xl border border-border shadow-[var(--shadow-card)] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2"><FolderOpen className="w-4 h-4 text-primary" /> 岗位文件夹</h2>
            <span className="text-xs text-muted-foreground">{folders.length} 个</span>
          </div>
          <div className="space-y-1">
            {folders.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedJob(f.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                  selectedJob === f.id ? "bg-primary-soft text-primary" : "hover:bg-secondary"
                }`}
              >
                <FolderOpen className={`w-4 h-4 shrink-0 ${selectedJob === f.id ? "text-primary" : "text-muted-foreground"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{f.title}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{f.company} · 最近 {f.latest || "—"}</div>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${selectedJob === f.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Resume detail list */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-[var(--shadow-card)]">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-semibold">{jobs.find((j) => j.id === selectedJob)?.title}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{jobCandidates.length} 份已解析简历</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/recruit/jobs/${selectedJob}/candidates`}>查看候选人列表</Link>
            </Button>
          </div>
          <div className="divide-y divide-border max-h-[600px] overflow-auto">
            {jobCandidates.map((c) => (
              <Link
                to={`/recruitment/candidates/${c.id}`}
                key={c.id}
                className="p-5 flex items-start gap-4 hover:bg-secondary/40 transition-colors"
              >
                <div className="w-11 h-11 rounded-full bg-primary-soft text-primary flex items-center justify-center font-semibold shrink-0">
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">{c.name}</span>
                    <span className="text-xs text-muted-foreground">{c.gender} · {c.age}岁 · {c.city}</span>
                    <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> {c.uploadedAt}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2 flex items-center gap-3">
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {c.currentTitle} @ {c.currentCompany}</span>
                    <span>· {c.education}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {c.highlights.slice(0, 2).map((h) => (
                      <span key={h} className="text-[11px] px-2 py-0.5 rounded-md bg-success-soft text-success flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {h}
                      </span>
                    ))}
                    {c.risks.slice(0, 1).map((r) => (
                      <span key={r} className="text-[11px] px-2 py-0.5 rounded-md bg-warning-soft text-warning flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {r}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-bold text-primary">{c.matchScore}</div>
                  <div className="text-[11px] text-muted-foreground">匹配度</div>
                </div>
              </Link>
            ))}
            {jobCandidates.length === 0 && (
              <div className="p-12 text-center text-muted-foreground text-sm">该岗位暂无简历，去上传吧</div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default ResumeLibrary;
