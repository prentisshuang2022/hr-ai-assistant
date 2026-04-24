import { Link } from "react-router-dom";
import { FileText, Search, MessagesSquare, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_DOCS, HOT_QUESTIONS } from "../data/mock";

const KnowledgeHome = () => {
  const totalDocs = MOCK_DOCS.length;
  const policyCount = MOCK_DOCS.filter((d) => d.category === "政策类").length;
  const flowCount = MOCK_DOCS.filter((d) => d.category === "流程类").length;
  const faqCount = MOCK_DOCS.filter((d) => d.category === "FAQ类").length;

  const cards = [
    {
      title: "文档录入",
      description: "支持富文本编辑与 Word/PDF 上传，提供政策、流程、FAQ 模板。",
      icon: FileText,
      to: "/knowledge/upload",
      stats: [
        { label: "已收录", value: `${totalDocs}` },
        { label: "政策类", value: `${policyCount}` },
        { label: "流程类", value: `${flowCount}` },
        { label: "FAQ类", value: `${faqCount}` },
      ],
    },
    {
      title: "全文检索",
      description: "关键词 + 标签 + 分类组合筛选，命中摘要片段一目了然。",
      icon: Search,
      to: "/knowledge/search",
      stats: [
        { label: "可检索文档", value: `${totalDocs}` },
        { label: "标签数", value: "18" },
        { label: "本周搜索", value: "342" },
        { label: "命中率", value: "94%" },
      ],
    },
    {
      title: "智能问答",
      description: "基于知识库的高频问题汇总与智能问答入口。",
      icon: MessagesSquare,
      to: "/knowledge/qa",
      stats: [
        { label: "高频问题", value: `${HOT_QUESTIONS.length}` },
        { label: "本月提问", value: "1,286" },
        { label: "解决率", value: "88%" },
        { label: "平均响应", value: "1.4s" },
      ],
    },
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <section className="rounded-3xl bg-[var(--gradient-brand)] px-8 py-10 text-primary-foreground shadow-[var(--shadow-pop)]">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm backdrop-blur">
          <BookOpen className="h-4 w-4" /> 人资知识库
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">统一沉淀 HR 制度、流程与高频问答</h1>
        <p className="mt-3 max-w-2xl text-sm text-primary-foreground/85 md:text-base">
          通过文档录入、全文检索、智能问答三步闭环，让员工自助找答案，让 HR 减少重复回答。
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {cards.map(({ title, description, icon: Icon, to, stats }) => (
          <Card key={to} className="border-border/60 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow">
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link to={to}>进入</Link>
                </Button>
              </div>
              <div>
                <CardTitle>{title}</CardTitle>
                <CardDescription className="mt-1">{description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-lg bg-muted/50 p-3">
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                    <div className="mt-1 text-lg font-semibold text-foreground">{s.value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeHome;
