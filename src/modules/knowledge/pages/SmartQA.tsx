import { useMemo, useState } from "react";
import { Send, Sparkles, MessagesSquare, TrendingUp, Bot, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HOT_QUESTIONS, MOCK_DOCS } from "../data/mock";

interface Msg { role: "user" | "ai"; text: string; sources?: string[] }

const SmartQA = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "你好，我是人资知识库助手 🤖。可以问我关于请假、报销、社保、绩效、入职/离职等问题。" },
  ]);

  const tagStats = useMemo(() => {
    const map = new Map<string, number>();
    HOT_QUESTIONS.forEach((q) => map.set(q.tag, (map.get(q.tag) ?? 0) + q.hits));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, []);

  const findAnswer = (q: string) => {
    const k = q.trim().toLowerCase();
    const hit = HOT_QUESTIONS.find((h) => h.q.toLowerCase().includes(k) || k.includes(h.tag.toLowerCase()));
    if (hit) {
      const source = MOCK_DOCS.find((d) => d.tags.some((t) => t.toLowerCase() === hit.tag.toLowerCase()));
      return { text: hit.a, sources: source ? [source.title] : [] };
    }
    const docHit = MOCK_DOCS.find((d) => `${d.title}${d.summary}${d.content}`.toLowerCase().includes(k));
    if (docHit) return { text: `根据《${docHit.title}》：${docHit.summary}`, sources: [docHit.title] };
    return { text: "暂未在知识库中找到确切答案，建议您联系 HR 同事或在「全文检索」中尝试其他关键词。", sources: [] };
  };

  const ask = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { role: "user", text };
    const ans = findAnswer(text);
    const aiMsg: Msg = { role: "ai", text: ans.text, sources: ans.sources };
    setMessages((m) => [...m, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">智能问答</h1>
        <p className="text-sm text-muted-foreground mt-1">基于知识库的高频问题汇总与智能问答入口。</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />知识库助手</CardTitle>
            <CardDescription>回答基于已录入的政策、流程与 FAQ 文档。</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <ScrollArea className="h-[440px] rounded-lg border bg-muted/20 p-4">
              <div className="space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-primary-soft text-primary"}`}>
                      {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border"}`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                      {m.sources && m.sources.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {m.sources.map((s) => (
                            <Badge key={s} variant="outline" className="text-[10px]">来源：{s}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); ask(input); }}>
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="输入你的问题，按回车发送" />
              <Button type="submit"><Send className="h-4 w-4" />发送</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" />热门标签</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {tagStats.map(([t, n]) => (
                <button key={t} onClick={() => ask(t)} className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs hover:bg-muted transition-colors">
                  {t}<span className="text-muted-foreground">·{n}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><MessagesSquare className="h-4 w-4 text-primary" />高频问题汇总</CardTitle>
              <CardDescription>点击直接提问。</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {HOT_QUESTIONS.map((q, i) => (
                  <li key={i}>
                    <button onClick={() => ask(q.q)} className="w-full text-left rounded-lg border px-3 py-2.5 text-sm hover:border-primary/40 hover:bg-muted/40 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium leading-snug">{q.q}</span>
                        <Badge variant="secondary" className="shrink-0 text-[10px]">{q.hits}</Badge>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground line-clamp-1">{q.a}</div>
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SmartQA;
