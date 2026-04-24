// Mock data for HR AI Employee System
export type EmployeeStatus = "试用期" | "在职" | "离职";
export type ContractType = "劳动合同" | "劳务协议" | "临时工聘用";
export type Subsidiary =
  | "光电"
  | "光电（鄂）"
  | "国际"
  | "激光"
  | "新能源"
  | "新能源（鄂）"
  | "其他";

export const SUBSIDIARIES: Subsidiary[] = [
  "光电",
  "光电（鄂）",
  "国际",
  "激光",
  "新能源",
  "新能源（鄂）",
  "其他",
];

export const DEPARTMENTS = [
  { name: "财务中心", type: "职能部门" },
  { name: "供应链", type: "职能部门" },
  { name: "品质管理部", type: "生产一线" },
  { name: "生产管理部", type: "生产一线" },
  { name: "商务部", type: "职能部门" },
  { name: "市场营销部", type: "职能部门" },
  { name: "项目管理部", type: "职能部门" },
  { name: "研发部", type: "职能部门" },
  { name: "营销中心", type: "职能部门" },
  { name: "综合管理部", type: "职能部门" },
  { name: "物业", type: "职能部门" },
] as const;

export interface Employee {
  id: string;
  name: string;
  avatar?: string;
  status: EmployeeStatus;
  subsidiary: Subsidiary; // 合同归属
  department: string;
  currentHeadcount: Subsidiary; // 现用人编制
  originalHeadcount?: Subsidiary;
  location: string; // 归属地
  position: string; // 现任职务
  joinDate: string;
  tenure: string; // 司龄
  contractType: ContractType;
  contractStart: string;
  contractEnd: string;
  contractDaysLeft: number;
  gender: "男" | "女";
  birthday: string;
  age: number;
  idNumber: string;
  idStart: string;
  idEnd: string;
  idDaysLeft: number;
  household: string;
  ethnicity: string;
  nativePlace: string;
  political: string;
  marital: string;
  highestEducation: string;
  firstEducation: string;
  educationCategory: string;
  school: string;
  graduationDate: string;
  major: string;
  phone: string;
  emergencyContact: string;
  emergencyPhone: string;
  transferDate?: string;
  resignDate?: string;
  resignReason?: string;
  remark?: string;
  // 材料
  materials: { type: string; name: string; uploadedAt: string; verified?: boolean }[];
  // 来源
  source: "钉钉同步" | "手动创建" | "AI识别";
  // 警示
  alerts: ("合同到期" | "身份证到期" | "钉钉数据未上传" | "学信网未认证")[];
}

const NAMES = [
  "张伟", "王芳", "李娜", "刘洋", "陈晨", "杨帆", "赵磊", "黄静", "周强", "吴敏",
  "徐刚", "孙丽", "朱琳", "胡军", "郭涛", "何雪", "高远", "林峰", "罗静", "郑浩",
  "梁越", "谢婷", "宋扬", "唐悦", "韩雪", "冯刚", "邓超", "曹颖", "彭磊", "曾娜",
  "肖恩", "田野", "董雯", "袁帅", "潘伟", "于佳", "蒋勤", "蔡明", "余华", "杜娟",
  "魏然", "薛涛", "贺敏", "雷鸣", "侯亮", "汪晨", "邵华", "毛宁", "程琳", "苏菲",
];

const POSITIONS = [
  "工程师", "高级工程师", "经理", "主管", "总监", "专员", "助理", "财务", "采购",
  "销售经理", "产品经理", "项目经理", "QA", "运营专员",
];

const SCHOOLS = ["清华大学", "北京大学", "武汉大学", "华中科技大学", "浙江大学", "复旦大学", "同济大学", "中山大学", "上海交通大学", "南京大学"];
const MAJORS = ["计算机科学", "电子信息工程", "机械工程", "工商管理", "财务管理", "市场营销", "光电信息", "材料科学", "自动化", "国际贸易"];
const EDUCATIONS = ["大专", "本科", "硕士", "博士"];
const ETHNICS = ["汉族", "回族", "满族", "壮族", "苗族"];
const POLITICS = ["群众", "团员", "党员"];
const MARITALS = ["未婚", "已婚已育", "已婚未育"];
const PROVINCES = ["湖北武汉", "湖北宜昌", "广东深圳", "广东广州", "上海", "北京", "江苏南京", "浙江杭州", "四川成都", "河南郑州"];

function rand<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function dateAdd(base: Date, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
function daysBetween(a: string, b: string) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

const TODAY = new Date("2025-04-23");

function makeEmployee(i: number): Employee {
  const subsidiary = rand(SUBSIDIARIES);
  const dept = rand(DEPARTMENTS);
  const name = rand(NAMES) + (i > NAMES.length ? i : "");
  const gender: "男" | "女" = Math.random() > 0.4 ? "男" : "女";
  const ageVal = randInt(22, 55);
  const birthYear = 2025 - ageVal;
  const birthday = `${birthYear}-${String(randInt(1, 12)).padStart(2, "0")}-${String(randInt(1, 28)).padStart(2, "0")}`;
  const joinDays = randInt(30, 365 * 8);
  const joinDate = dateAdd(TODAY, -joinDays);
  const tenureYears = (joinDays / 365).toFixed(1);
  const contractStart = joinDate;
  const contractDuration = rand([365, 365 * 2, 365 * 3]);
  const contractEnd = dateAdd(new Date(contractStart), contractDuration);
  const contractDaysLeft = daysBetween(TODAY.toISOString().slice(0, 10), contractEnd);
  const idStart = dateAdd(TODAY, -randInt(365, 365 * 8));
  const idEnd = dateAdd(new Date(idStart), 365 * 10);
  const idDaysLeft = daysBetween(TODAY.toISOString().slice(0, 10), idEnd);

  const statusRoll = Math.random();
  let status: EmployeeStatus = "在职";
  let resignDate: string | undefined;
  let resignReason: string | undefined;
  if (statusRoll < 0.12) {
    status = "离职";
    resignDate = dateAdd(TODAY, -randInt(1, 365));
    resignReason = rand(["个人发展", "家庭原因", "薪资原因", "工作内容不匹配", "公司原因"]);
  } else if (statusRoll < 0.22) {
    status = "试用期";
  }

  const edu = rand(EDUCATIONS);
  const alerts: Employee["alerts"] = [];
  if (contractDaysLeft <= 60 && contractDaysLeft >= 0 && status !== "离职") alerts.push("合同到期");
  if (idDaysLeft <= 90 && idDaysLeft >= 0) alerts.push("身份证到期");
  if (Math.random() < 0.08) alerts.push("钉钉数据未上传");
  if ((edu === "大专" || edu === "本科" || edu === "硕士" || edu === "博士") && Math.random() < 0.1) alerts.push("学信网未认证");

  const source = rand(["钉钉同步", "钉钉同步", "钉钉同步", "手动创建", "AI识别"] as const);

  return {
    id: `EMP${String(10000 + i).slice(1)}`,
    name,
    status,
    subsidiary,
    department: dept.name,
    currentHeadcount: subsidiary,
    location: rand(PROVINCES),
    position: rand(POSITIONS),
    joinDate,
    tenure: `${tenureYears}年`,
    contractType: rand(["劳动合同", "劳动合同", "劳动合同", "劳务协议", "临时工聘用"] as const),
    contractStart,
    contractEnd,
    contractDaysLeft,
    gender,
    birthday,
    age: ageVal,
    idNumber: `${randInt(110000, 659000)}${birthday.replace(/-/g, "")}${randInt(1000, 9999)}`,
    idStart,
    idEnd,
    idDaysLeft,
    household: rand(PROVINCES) + "市某区某街道",
    ethnicity: rand(ETHNICS),
    nativePlace: rand(PROVINCES),
    political: rand(POLITICS),
    marital: rand(MARITALS),
    highestEducation: edu,
    firstEducation: rand(EDUCATIONS),
    educationCategory: rand(["全日制", "非全日制"]),
    school: rand(SCHOOLS),
    graduationDate: `${birthYear + 22}-07-01`,
    major: rand(MAJORS),
    phone: `1${randInt(3, 9)}${randInt(100000000, 999999999)}`,
    emergencyContact: rand(NAMES),
    emergencyPhone: `1${randInt(3, 9)}${randInt(100000000, 999999999)}`,
    resignDate,
    resignReason,
    materials: [
      { type: "身份证", name: "身份证正反面.jpg", uploadedAt: contractStart, verified: true },
      { type: "合同", name: "劳动合同.pdf", uploadedAt: contractStart, verified: true },
      { type: "学历", name: "毕业证书.pdf", uploadedAt: contractStart, verified: !alerts.includes("学信网未认证") },
      ...(status === "离职"
        ? [{ type: "离职证明", name: "离职证明.pdf", uploadedAt: resignDate!, verified: true }]
        : []),
    ],
    source,
    alerts,
  };
}

// Seeded-ish stable mock list
let _seed = 1;
function seededRandom() {
  _seed = (_seed * 9301 + 49297) % 233280;
  return _seed / 233280;
}
const _origRandom = Math.random;
Math.random = seededRandom as any;
export const EMPLOYEES: Employee[] = Array.from({ length: 168 }, (_, i) => makeEmployee(i));
Math.random = _origRandom;

// ===== Stats helpers =====
export function getMonthlyFlow() {
  // last 12 months: 入职/离职 by subsidiary
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(TODAY);
    d.setMonth(d.getMonth() - (11 - i));
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  return months.map((m) => {
    const row: any = { month: m };
    SUBSIDIARIES.forEach((s) => {
      row[`${s}_入职`] = randInt(2, 12);
      row[`${s}_离职`] = randInt(0, 6);
    });
    row["入职"] = SUBSIDIARIES.reduce((a, s) => a + row[`${s}_入职`], 0);
    row["离职"] = SUBSIDIARIES.reduce((a, s) => a + row[`${s}_离职`], 0);
    return row;
  });
}

export function getDeptDistribution() {
  // 按部门统计；人数<3 的合并为"其他(合并)"
  const counts = new Map<string, number>();
  EMPLOYEES.filter((e) => e.status !== "离职").forEach((e) => {
    counts.set(e.department, (counts.get(e.department) ?? 0) + 1);
  });
  const result: { name: string; value: number }[] = [];
  let merged = 0;
  counts.forEach((v, k) => {
    if (v < 3) merged += v;
    else result.push({ name: k, value: v });
  });
  if (merged > 0) result.push({ name: "其他(部门<3合并)", value: merged });
  return result.sort((a, b) => b.value - a.value);
}

export function getSubsidiaryDistribution() {
  const counts = new Map<string, number>();
  EMPLOYEES.filter((e) => e.status !== "离职").forEach((e) => {
    counts.set(e.subsidiary, (counts.get(e.subsidiary) ?? 0) + 1);
  });
  return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
}

export function getLocationDistribution() {
  const counts = new Map<string, number>();
  EMPLOYEES.filter((e) => e.status !== "离职").forEach((e) => {
    counts.set(e.location, (counts.get(e.location) ?? 0) + 1);
  });
  return Array.from(counts.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function getKpis() {
  const active = EMPLOYEES.filter((e) => e.status !== "离职");
  const probation = EMPLOYEES.filter((e) => e.status === "试用期").length;
  const resigned = EMPLOYEES.filter((e) => e.status === "离职");
  const totalEverActive = active.length + resigned.length;
  const turnoverRate = ((resigned.length / Math.max(totalEverActive, 1)) * 100).toFixed(1);
  // 同比环比 mock
  const yoy = (Math.random() * 4 - 2).toFixed(1);
  const mom = (Math.random() * 3 - 1.5).toFixed(1);
  return {
    total: active.length,
    probation,
    resigned: resigned.length,
    turnoverRate,
    yoyTurnover: yoy,
    momTurnover: mom,
    newJoinThisMonth: randInt(8, 22),
    transferThisMonth: randInt(2, 8),
  };
}

export function getResignTrend() {
  // 12 months 离职 + 同比
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(TODAY);
    d.setMonth(d.getMonth() - (11 - i));
    const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return {
      month: m,
      本年: randInt(4, 22),
      去年同期: randInt(3, 24),
    };
  });
}

export function getAlerts() {
  const list = EMPLOYEES.filter((e) => e.alerts.length > 0 && e.status !== "离职");
  return {
    contractExpiring: list.filter((e) => e.alerts.includes("合同到期")),
    idExpiring: list.filter((e) => e.alerts.includes("身份证到期")),
    dingTalkMissing: list.filter((e) => e.alerts.includes("钉钉数据未上传")),
    materialMissing: list.filter((e) => e.alerts.includes("学信网未认证")),
  };
}
