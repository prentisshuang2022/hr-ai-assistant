import { useMemo, useState } from "react";
import { Search, Tag as TagIcon, Clock, Eye, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_DOCS, type DocCategory } from "../data/mock";

const ALL_TAGS = Array.from(new Set(MOCK_DOCS.flatMap((d) => d.tags)));

const highlight = (text: string, kw: string) => {
  if (!kw.trim()) return text;
  const parts = text.split(new RegExp(`(${kw})`, "gi"));
  return parts.map((p, i) =>
    p.toLowerCase() === kw.toLowerCase() ? (
      <mark key={i} className="bg-primary/20 text-primary rounded px-0.5">{p}</mark>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
};

const FullTextSearch = () => {
  const [kw, setKw] = useState("");
  const [category, setCategory] = useState<DocCategory | "all">("all");
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());

  const toggleTag = (t: string) => {
    setActiveTags((s) => {
      const n = new Set(s);
      n.has(t) ? n.delete(t) : n.add(t);
      return n;
    });
  };

  const results = useMemo(() => {
    return MOCK_DOCS.filter((d) => {
      if (category !== "all" && d.category !== category) return false;
      if (activeTags.size && !d.tags.some((t) => activeTags.has(t))) return false;
      if (kw.trim()) {
        const k = kw.trim().toLowerCase();
        const hay = `${d.title} ${d.summary} ${d.content} ${d.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(k)) return false;
      }
      return true;
    });
  }, [kw, category, activeTags]);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">全文检索</h1>
        <p className="text-sm text-muted-foreground mt-1">支持关键词、标签、分类组合筛选，结果展示摘要与导入时间。</p>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={kw}
                onChange={(e) => setKw(e.target.value)}
                placeholder="输入关键词，如「年假」「报销」「社保」"
                className="pl-9"
              />
            </div>
            <Select value={category} onValueChange={(v) => setCategory(v as DocCategory | "all")}>
              <SelectTrigger className="md:w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                <SelectItem value="政策类">政策类</SelectItem>
                <SelectItem value="流程类">流程类</SelectItem>
                <SelectItem value="FAQ类">FAQ类</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => { /* search is reactive */ }}><Search className="h-4 w-4" />搜索</Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1"><TagIcon className="h-3.5 w-3.5" />标签：</span>
            {ALL_TAGS.map((t) => {
              const active = activeTags.has(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                    active ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"
                  }`}
                >
                  {t}
                </button>
              );
            })}
            {activeTags.size > 0 && (
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setActiveTags(new Set())}>清除</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">共找到 <span className="font-semibold text-foreground">{results.length}</span> 条结果</div>
      </div>

      <div className="space-y-3">
        {results.map((d) => (
          <Card key={d.id} className="hover:border-primary/40 transition-colors">
            <CardContent className="pt-5 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2 min-w-0">
                  <FileText className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-base truncate">{highlight(d.title, kw)}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{d.category}</Badge>
                      {d.tags.map((t) => (
                        <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline">查看原文</Button>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-7">{highlight(d.summary, kw)}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground pl-7">
                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />导入时间：{d.importedAt}</span>
                <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{d.views} 次查看</span>
                <span>来源：{d.source}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {results.length === 0 && (
          <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">没有匹配的文档，试试调整关键词或筛选条件。</CardContent></Card>
        )}
      </div>
    </div>
  );
};

export default FullTextSearch;
