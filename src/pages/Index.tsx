import { Building2, Clock, GraduationCap, TrendingUp, UserPlus, Users, BookOpen } from "lucide-react";
import { HomeModulesGrid } from "@/components/navigation/HomeModulesGrid";

const modules = [
  {
    title: "员工档案助手",
    description: "统一管理员工档案、材料识别、预警与钉钉同步入口。",
    icon: Users,
    to: "/employee",
    stats: [
      { label: "在职员工", value: "1,248" },
      { label: "本月新入职", value: "32" },
      { label: "档案完整率", value: "98.5%" },
      { label: "关键预警", value: "27" },
    ],
    highlights: ["人员流动看板", "员工档案管理", "关键指标预警", "钉钉字段同步"],
  },
  {
    title: "考勤助手",
    description: "汇总打卡、门禁和月报数据，统一处理异常、加班和规则。",
    icon: Clock,
    to: "/attendance",
    stats: [
      { label: "今日异常", value: "5" },
      { label: "本月加班", value: "186h" },
      { label: "调休申请", value: "12" },
      { label: "规则数", value: "8" },
    ],
    highlights: ["今日概览", "考勤明细", "加班与调休", "规则引擎配置"],
  },
  {
    title: "招聘助手",
    description: "覆盖 JD 生成、简历库、候选人台账与面试辅助。",
    icon: UserPlus,
    to: "/recruitment",
    stats: [
      { label: "在招岗位", value: "48" },
      { label: "活跃候选人", value: "126" },
      { label: "待面试", value: "22" },
      { label: "AI 简历解析", value: "142" },
    ],
    highlights: ["招聘工作台", "岗位与 JD", "简历库", "候选人台账"],
  },
  {
    title: "绩效助手",
    description: "统一考核配置、指标库、流程推进和 AI 评估参考。",
    icon: TrendingUp,
    to: "/performance",
    stats: [
      { label: "进行中考核", value: "3" },
      { label: "待处理", value: "12" },
      { label: "指标数", value: "7" },
      { label: "AI 建议", value: "7" },
    ],
    highlights: ["绩效工作台", "新建考核", "指标库管理", "员工绩效管理"],
  },
  {
    title: "培训助手",
    description: "整合题库、考试、在岗培训和培训档案留存。",
    icon: GraduationCap,
    to: "/training",
    stats: [
      { label: "参训人次", value: "248" },
      { label: "进行中考试", value: "6" },
      { label: "在岗培训", value: "34" },
      { label: "通过率", value: "92.4%" },
    ],
    highlights: ["培训总览", "题库管理", "考试中心", "培训记录留存"],
  },
  {
    title: "人资知识库",
    description: "沉淀政策、流程、FAQ 文档，提供全文检索与智能问答。",
    icon: BookOpen,
    to: "/knowledge/upload",
    stats: [
      { label: "已收录文档", value: "6" },
      { label: "高频问答", value: "6" },
      { label: "本月提问", value: "1,286" },
      { label: "解决率", value: "88%" },
    ],
    highlights: ["文档录入（富文本/Word/PDF）", "全文检索与标签筛选", "高频问题汇总", "智能问答助手"],
  },
];

const Index = () => {
  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <section className="rounded-3xl bg-[var(--gradient-brand)] px-8 py-10 text-primary-foreground shadow-[var(--shadow-pop)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm backdrop-blur">
              <Building2 className="h-4 w-4" /> 人事AI员工
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight">统一管理五大人事模块的智能工作台</h1>
            <p className="mt-3 text-sm text-primary-foreground/85 md:text-base">
              将员工档案、考勤、招聘、绩效、培训整合到一个前端项目中，统一入口、统一导航、统一后续扩展基础。
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur">
            <div>
              <div className="text-xs text-primary-foreground/70">一级模块</div>
              <div className="mt-1 text-2xl font-semibold">6</div>
            </div>
            <div>
              <div className="text-xs text-primary-foreground/70">统一路由</div>
              <div className="mt-1 text-2xl font-semibold">1 套</div>
            </div>
            <div>
              <div className="text-xs text-primary-foreground/70">当前版本</div>
              <div className="mt-1 text-2xl font-semibold">前端整合版</div>
            </div>
            <div>
              <div className="text-xs text-primary-foreground/70">后续重点</div>
              <div className="mt-1 text-2xl font-semibold">接真实业务</div>
            </div>
          </div>
        </div>
      </section>

      <HomeModulesGrid modules={modules} />
    </div>
  );
};

export default Index;
