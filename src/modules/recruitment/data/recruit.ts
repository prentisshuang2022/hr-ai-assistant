export type JobStatus = "招聘中" | "已暂停" | "已关闭";
export type CandidateStatus = "待复筛" | "待沟通" | "待面试" | "已入库" | "已淘汰";

export interface Job {
  id: string;
  title: string;
  department: string;
  company: string;
  location: string;
  headcount: number;
  hired: number;
  candidates: number;
  newResumes: number;
  status: JobStatus;
  owner: string;
  createdAt: string;
  jd: string;
  requirements: string;
}

export interface Candidate {
  id: string;
  jobId: string;
  name: string;
  gender: "男" | "女";
  age: number;
  city: string;
  phone: string;
  education: string;
  major: string;
  yearsExp: number;
  currentCompany: string;
  currentTitle: string;
  matchScore: number;
  status: CandidateStatus;
  source: string;
  uploadedAt: string;
  highlights: string[];
  risks: string[];
  toConfirm: string[];
  experiences: { company: string; title: string; period: string; desc: string }[];
  skills: string[];
  hrQuestions: string[];
  bizQuestions: string[];
  followUps: string[];
  notes: { author: string; at: string; text: string }[];
}

export const jobs: Job[] = [
  {
    id: "JOB-2025-001",
    title: "高级前端工程师",
    department: "研发中心 / 前端组",
    company: "光电（鄂）",
    location: "武汉",
    headcount: 3,
    hired: 1,
    candidates: 28,
    newResumes: 6,
    status: "招聘中",
    owner: "林峰",
    createdAt: "2025-03-12",
    jd: "负责公司核心 SaaS 产品的 Web 前端架构与开发，主导组件库与性能优化方向...",
    requirements: "本科及以上，5年+前端经验，精通 React / TypeScript，有大型项目经验",
  },
  {
    id: "JOB-2025-002",
    title: "供应链运营经理",
    department: "供应链中心",
    company: "新能源",
    location: "宜昌",
    headcount: 2,
    hired: 0,
    candidates: 14,
    newResumes: 3,
    status: "招聘中",
    owner: "袁帅",
    createdAt: "2025-03-20",
    jd: "负责区域供应链整体运营，协调采购、仓储、物流环节，提升周转效率...",
    requirements: "本科及以上，8年+供应链经验，有新能源或制造业背景优先",
  },
  {
    id: "JOB-2025-003",
    title: "品质工程师",
    department: "品质管理部",
    company: "国际",
    location: "深圳",
    headcount: 1,
    hired: 0,
    candidates: 9,
    newResumes: 2,
    status: "招聘中",
    owner: "赵磊",
    createdAt: "2025-04-02",
    jd: "负责产品质量体系建设，主导供应商质量改善与客户投诉处理...",
    requirements: "本科及以上，5年+品质经验，熟悉 ISO9001 / IATF16949",
  },
  {
    id: "JOB-2025-004",
    title: "财务分析专员",
    department: "财务部",
    company: "综合管理",
    location: "上海",
    headcount: 1,
    hired: 1,
    candidates: 22,
    newResumes: 0,
    status: "已关闭",
    owner: "蔡明",
    createdAt: "2025-02-08",
    jd: "负责经营分析、预算编制与差异分析，输出管理层报表...",
    requirements: "本科及以上，3年+财务分析经验，CPA 优先",
  },
  {
    id: "JOB-2025-005",
    title: "市场推广经理",
    department: "市场营销部",
    company: "光电（鄂）",
    location: "武汉",
    headcount: 2,
    hired: 0,
    candidates: 18,
    newResumes: 4,
    status: "招聘中",
    owner: "潘伟",
    createdAt: "2025-03-28",
    jd: "负责品牌传播策略制定，统筹线上线下市场活动...",
    requirements: "本科及以上，6年+市场经验，有 B2B 行业经验优先",
  },
];

export const candidates: Candidate[] = [
  {
    id: "CAN-0001",
    jobId: "JOB-2025-001",
    name: "陈思远",
    gender: "男",
    age: 31,
    city: "武汉",
    phone: "138****2891",
    education: "硕士 · 华中科技大学",
    major: "计算机科学与技术",
    yearsExp: 7,
    currentCompany: "字节跳动",
    currentTitle: "前端技术专家",
    matchScore: 92,
    status: "待面试",
    source: "Boss 直聘",
    uploadedAt: "2025-04-18",
    highlights: ["主导过 50w+ DAU 产品的前端架构", "开源组件库 5k+ Star", "团队管理 8 人"],
    risks: ["最近一份工作仅 11 个月", "期望薪资偏高 (45K×16)"],
    toConfirm: ["实际带团队人数", "可入职时间", "是否能接受出差"],
    experiences: [
      { company: "字节跳动", title: "前端技术专家", period: "2024.05 - 至今", desc: "负责飞书文档前端架构演进" },
      { company: "腾讯", title: "高级前端工程师", period: "2020.07 - 2024.04", desc: "QQ 音乐 Web 团队核心成员" },
      { company: "网易", title: "前端工程师", period: "2018.06 - 2020.06", desc: "网易云课堂业务开发" },
    ],
    skills: ["React", "TypeScript", "Webpack", "Node.js", "性能优化", "团队管理"],
    hrQuestions: ["了解一下离职原因，是否有反复跳槽倾向", "对薪资结构的预期是固定还是浮动", "家庭安置与异地工作意愿"],
    bizQuestions: ["主导过的最复杂的架构改造项目", "如何评估前端性能瓶颈并制定方案", "团队 Code Review 文化如何建立"],
    followUps: ["最近 11 个月项目成果具体数据", "开源项目目前是否仍在维护", "曾经的下属对其管理风格的评价"],
    notes: [
      { author: "林峰 (HR)", at: "2025-04-19 10:24", text: "电话沟通顺畅，技术表达清晰，下周二可安排技术面" },
    ],
  },
  {
    id: "CAN-0002",
    jobId: "JOB-2025-001",
    name: "李雨桐",
    gender: "女",
    age: 28,
    city: "上海",
    phone: "139****6712",
    education: "本科 · 同济大学",
    major: "软件工程",
    yearsExp: 5,
    currentCompany: "美团",
    currentTitle: "前端工程师",
    matchScore: 85,
    status: "待沟通",
    source: "拉勾网",
    uploadedAt: "2025-04-19",
    highlights: ["美团到店事业群核心成员", "主导可视化搭建平台从 0-1", "技术博客 30w+ 阅读"],
    risks: ["跨城市工作意向待确认", "无明确管理经验"],
    toConfirm: ["是否愿意 base 武汉", "近一年绩效情况"],
    experiences: [
      { company: "美团", title: "前端工程师", period: "2022.03 - 至今", desc: "到店事业群可视化搭建" },
      { company: "拼多多", title: "初级前端", period: "2020.07 - 2022.02", desc: "营销活动页开发" },
    ],
    skills: ["Vue", "React", "低代码", "可视化", "Canvas"],
    hrQuestions: ["对武汉 base 是否能接受", "期望薪资范围", "下家公司最看重什么"],
    bizQuestions: ["可视化搭建平台的核心难点是什么", "如何设计跨业务复用的组件体系"],
    followUps: ["低代码项目目前的业务覆盖率", "是否有完整的 RFC 输出习惯"],
    notes: [],
  },
  {
    id: "CAN-0003",
    jobId: "JOB-2025-001",
    name: "王浩",
    gender: "男",
    age: 33,
    city: "武汉",
    phone: "186****0034",
    education: "本科 · 武汉大学",
    major: "信息工程",
    yearsExp: 9,
    currentCompany: "斗鱼",
    currentTitle: "前端 Leader",
    matchScore: 78,
    status: "待复筛",
    source: "AI 识别 · 简历库",
    uploadedAt: "2025-04-20",
    highlights: ["9 年前端经验", "本地候选人，稳定性强", "带团队 6 人"],
    risks: ["技术栈以 Vue 为主，React 经验偏弱", "近年项目偏运营"],
    toConfirm: ["React 实战项目经历", "是否能 hands-on coding"],
    experiences: [
      { company: "斗鱼", title: "前端 Leader", period: "2019.04 - 至今", desc: "直播业务前端团队管理" },
      { company: "小米", title: "高级前端", period: "2016.02 - 2019.03", desc: "小米商城前端开发" },
    ],
    skills: ["Vue", "Nuxt", "团队管理", "直播 SDK"],
    hrQuestions: ["现公司离职原因", "对薪资 package 的预期"],
    bizQuestions: ["从 Vue 迁移到 React 的看法", "管理与编码的时间分配"],
    followUps: ["最近 1 年是否还在 hands-on", "团队 OKR 完成情况"],
    notes: [],
  },
  {
    id: "CAN-0004",
    jobId: "JOB-2025-002",
    name: "孙启明",
    gender: "男",
    age: 36,
    city: "宜昌",
    phone: "135****7782",
    education: "本科 · 武汉理工大学",
    major: "物流管理",
    yearsExp: 11,
    currentCompany: "宁德时代",
    currentTitle: "供应链高级经理",
    matchScore: 89,
    status: "待面试",
    source: "猎聘",
    uploadedAt: "2025-04-15",
    highlights: ["新能源行业 8 年经验", "主导过 3 个工厂供应链搭建", "管理团队 25 人"],
    risks: ["现年薪较高 (80W)", "可能需要 1 个月以上交接期"],
    toConfirm: ["竞业协议情况", "实际可入职时间"],
    experiences: [
      { company: "宁德时代", title: "供应链高级经理", period: "2021.03 - 至今", desc: "宜春基地供应链负责人" },
      { company: "比亚迪", title: "供应链经理", period: "2017.05 - 2021.02", desc: "电池业务部" },
    ],
    skills: ["SAP", "供应链规划", "S&OP", "团队管理", "成本控制"],
    hrQuestions: ["竞业是否覆盖我司", "家庭对宜昌 base 的意见"],
    bizQuestions: ["从 0 搭建工厂供应链的关键节点", "如何处理供应商交付危机"],
    followUps: ["管理 25 人团队的具体结构", "近 3 年成本下降数据"],
    notes: [{ author: "袁帅 (HR)", at: "2025-04-16 14:00", text: "已约下周三业务面" }],
  },
  {
    id: "CAN-0005",
    jobId: "JOB-2025-002",
    name: "张媛",
    gender: "女",
    age: 32,
    city: "武汉",
    phone: "187****1199",
    education: "硕士 · 中南财经政法大学",
    major: "工商管理",
    yearsExp: 8,
    currentCompany: "亿纬锂能",
    currentTitle: "供应链运营主管",
    matchScore: 82,
    status: "待沟通",
    source: "AI 识别 · 简历库",
    uploadedAt: "2025-04-21",
    highlights: ["新能源电池行业经验", "数据分析能力强", "PMP 认证"],
    risks: ["未独立带过完整运营团队"],
    toConfirm: ["是否能胜任经理岗", "管理过最大团队规模"],
    experiences: [
      { company: "亿纬锂能", title: "供应链运营主管", period: "2020.07 - 至今", desc: "动力电池供应链运营" },
    ],
    skills: ["供应链分析", "Excel/Power BI", "PMP", "S&OP"],
    hrQuestions: ["升任经理岗的信心", "薪资期望"],
    bizQuestions: ["数据驱动的运营改善案例", "如何看待区域分仓策略"],
    followUps: ["管理跨度", "实际决策权限"],
    notes: [],
  },
  {
    id: "CAN-0006",
    jobId: "JOB-2025-003",
    name: "周博文",
    gender: "男",
    age: 30,
    city: "深圳",
    phone: "159****4520",
    education: "本科 · 华南理工大学",
    major: "材料工程",
    yearsExp: 6,
    currentCompany: "立讯精密",
    currentTitle: "高级品质工程师",
    matchScore: 86,
    status: "已入库",
    source: "Boss 直聘",
    uploadedAt: "2025-04-10",
    highlights: ["IATF16949 内审员", "苹果供应链质量经验", "8D 报告专家"],
    risks: ["对外资客户沟通经验为主"],
    toConfirm: ["国内客户处理经验"],
    experiences: [{ company: "立讯精密", title: "高级品质工程师", period: "2019 - 至今", desc: "iPhone 配件品质" }],
    skills: ["IATF16949", "8D", "SPC", "FMEA"],
    hrQuestions: ["跳槽意愿强度", "薪资预期"],
    bizQuestions: ["处理过最严重的客户投诉", "供应商导入流程"],
    followUps: ["客户审核通过率"],
    notes: [],
  },
  {
    id: "CAN-0007",
    jobId: "JOB-2025-005",
    name: "黄琳",
    gender: "女",
    age: 34,
    city: "武汉",
    phone: "133****8866",
    education: "硕士 · 武汉大学",
    major: "新闻传播",
    yearsExp: 9,
    currentCompany: "高德红外",
    currentTitle: "市场总监助理",
    matchScore: 80,
    status: "待沟通",
    source: "猎聘",
    uploadedAt: "2025-04-17",
    highlights: ["B2B 行业 6 年", "本地资源丰富", "策划过 50+ 活动"],
    risks: ["缺乏完整品牌操盘经验"],
    toConfirm: ["独立预算管理经验"],
    experiences: [{ company: "高德红外", title: "市场总监助理", period: "2020 - 至今", desc: "B2B 市场推广" }],
    skills: ["品牌传播", "活动策划", "媒介采购", "B2B 营销"],
    hrQuestions: ["为何考虑新机会", "管理跨度期望"],
    bizQuestions: ["B2B 营销获客的关键方法", "活动 ROI 如何衡量"],
    followUps: ["独立操盘的项目"],
    notes: [],
  },
  {
    id: "CAN-0008",
    jobId: "JOB-2025-001",
    name: "刘瑶",
    gender: "女",
    age: 26,
    city: "杭州",
    phone: "188****3344",
    education: "本科 · 浙江工业大学",
    major: "计算机",
    yearsExp: 3,
    currentCompany: "阿里巴巴",
    currentTitle: "前端工程师",
    matchScore: 65,
    status: "已淘汰",
    source: "AI 识别 · 简历库",
    uploadedAt: "2025-04-08",
    highlights: ["阿里背景", "代码质量高"],
    risks: ["经验年限不足", "无大型项目主导经验"],
    toConfirm: [],
    experiences: [{ company: "阿里巴巴", title: "前端工程师", period: "2022 - 至今", desc: "钉钉文档" }],
    skills: ["React", "TypeScript"],
    hrQuestions: [],
    bizQuestions: [],
    followUps: [],
    notes: [{ author: "林峰 (HR)", at: "2025-04-09", text: "经验不达标，已淘汰" }],
  },
];

export const statusColor: Record<CandidateStatus, string> = {
  待复筛: "bg-info-soft text-info",
  待沟通: "bg-warning-soft text-warning",
  待面试: "bg-primary-soft text-primary",
  已入库: "bg-success-soft text-success",
  已淘汰: "bg-muted text-muted-foreground",
};

export const jobStatusColor: Record<JobStatus, string> = {
  招聘中: "bg-success-soft text-success",
  已暂停: "bg-warning-soft text-warning",
  已关闭: "bg-muted text-muted-foreground",
};
