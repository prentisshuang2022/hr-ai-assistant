export type DocCategory = "政策类" | "流程类" | "FAQ类";
export type DocSource = "富文本" | "Word上传" | "PDF上传";

export interface KnowledgeDoc {
  id: string;
  title: string;
  category: DocCategory;
  tags: string[];
  source: DocSource;
  summary: string;
  content: string;
  importedAt: string;
  views: number;
}

export const TEMPLATES: { key: DocCategory; name: string; description: string; content: string }[] = [
  {
    key: "政策类",
    name: "政策类模板",
    description: "用于公司制度、福利、考勤等正式政策类文档",
    content: `# 标题（政策名称）

## 一、政策目的
说明该政策出台的背景与目标。

## 二、适用范围
说明适用的部门 / 岗位 / 人员范围。

## 三、政策内容
1. 条款一……
2. 条款二……
3. 条款三……

## 四、执行与监督
说明执行部门、监督机制与违规处理。

## 五、附则
生效日期、解释权归属、修订记录。`,
  },
  {
    key: "流程类",
    name: "流程类模板",
    description: "用于入职、离职、报销、审批等业务流程说明",
    content: `# 流程名称

## 一、流程概述
一句话描述该流程做什么、解决什么问题。

## 二、适用场景
列出触发该流程的具体场景。

## 三、流程步骤
1. 步骤一：操作人 / 操作内容 / 时限
2. 步骤二：……
3. 步骤三：……

## 四、所需材料 / 表单
- 材料 1
- 材料 2

## 五、常见问题
- Q：……  A：……`,
  },
  {
    key: "FAQ类",
    name: "FAQ 类模板",
    description: "用于高频问题汇总，便于智能问答检索",
    content: `# 主题（如：社保公积金常见问题）

## Q1：问题描述？
A：答案要点。

## Q2：问题描述？
A：答案要点。

## Q3：问题描述？
A：答案要点。`,
  },
];

export const MOCK_DOCS: KnowledgeDoc[] = [
  {
    id: "K001",
    title: "员工请假管理制度",
    category: "政策类",
    tags: ["请假", "考勤", "制度"],
    source: "Word上传",
    summary: "明确事假、病假、年假、婚假、产假等各类假期的申请条件、审批流程及销假规则……",
    content: "本制度适用于公司全体正式员工。事假需提前 1 个工作日申请，病假凭医院证明……",
    importedAt: "2025-03-12 10:24",
    views: 312,
  },
  {
    id: "K002",
    title: "新员工入职流程",
    category: "流程类",
    tags: ["入职", "流程", "HR"],
    source: "富文本",
    summary: "覆盖 offer 发放、背调、报到、IT 开通、导师分配到转正考核的全流程节点说明……",
    content: "Step1 HR 发放 offer 并收集入职材料；Step2 IT 部门开通账号；Step3 直属主管安排导师……",
    importedAt: "2025-03-08 14:02",
    views: 489,
  },
  {
    id: "K003",
    title: "社保公积金常见问题",
    category: "FAQ类",
    tags: ["社保", "公积金", "FAQ"],
    source: "富文本",
    summary: "集中回答社保基数调整、异地缴纳、公积金提取、断缴影响等高频咨询问题……",
    content: "Q1：社保基数何时调整？A：每年 7 月统一调整。Q2：异地缴纳是否影响购房？……",
    importedAt: "2025-02-26 09:11",
    views: 1024,
  },
  {
    id: "K004",
    title: "差旅报销流程",
    category: "流程类",
    tags: ["报销", "差旅", "财务"],
    source: "PDF上传",
    summary: "差旅申请 → 审批 → 出差 → 单据收集 → 报销提交 → 财务复核的完整步骤与时限……",
    content: "出差前需提交差旅申请单，经直属主管及部门负责人审批……",
    importedAt: "2025-02-18 16:40",
    views: 256,
  },
  {
    id: "K005",
    title: "绩效考核管理办法",
    category: "政策类",
    tags: ["绩效", "考核", "制度"],
    source: "Word上传",
    summary: "规定季度 / 年度绩效考核的指标体系、评分规则、申诉机制与结果应用……",
    content: "公司绩效采用 OKR + KPI 双轨制，季度评估占 30%，年度评估占 70%……",
    importedAt: "2025-02-05 11:30",
    views: 678,
  },
  {
    id: "K006",
    title: "年假休假常见问题",
    category: "FAQ类",
    tags: ["年假", "请假", "FAQ"],
    source: "富文本",
    summary: "年假天数计算、跨年清零、未休补偿、试用期能否休年假等常见疑问……",
    content: "Q1：年假天数如何计算？A：按工龄阶梯，1-10 年 5 天，10-20 年 10 天……",
    importedAt: "2025-01-22 15:18",
    views: 845,
  },
];

export const HOT_QUESTIONS: { q: string; a: string; hits: number; tag: string }[] = [
  {
    q: "年假可以跨年使用吗？",
    a: "原则上当年年假需当年休完，未休部分可顺延至次年 3 月 31 日，逾期视为自动放弃，特殊情况可申请折算工资。",
    hits: 218,
    tag: "年假",
  },
  {
    q: "试用期可以请病假吗？",
    a: "可以。试用期员工凭三级及以上医院证明可申请病假，期间按当地最低工资 80% 发放病假工资。",
    hits: 176,
    tag: "病假",
  },
  {
    q: "差旅报销需要哪些材料？",
    a: "需提供：1) 已审批的差旅申请单；2) 行程单 / 登机牌；3) 酒店发票；4) 餐饮 / 交通发票；5) 出差总结。",
    hits: 152,
    tag: "报销",
  },
  {
    q: "社保基数什么时候调整？",
    a: "每年 7 月根据上年度社平工资统一调整，员工无需操作，HR 会在调整前一周内部公告。",
    hits: 134,
    tag: "社保",
  },
  {
    q: "如何申请内部转岗？",
    a: "在岗满 1 年且当前绩效 B 及以上可申请，流程：本人申请 → 现主管同意 → 目标主管面试 → HR 审批 → 交接转岗。",
    hits: 121,
    tag: "转岗",
  },
  {
    q: "离职手续需要几天办理？",
    a: "正式员工需提前 30 天书面申请，试用期 3 天，完成工作交接、资产归还、财务结算后办理离职证明，通常 1-2 个工作日。",
    hits: 109,
    tag: "离职",
  },
];
