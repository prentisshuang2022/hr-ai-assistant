import { AppLayout } from "@/components/AppLayout";
import { ModulePage } from "@/components/ModulePage";
import { UserPlus } from "lucide-react";

const Recruitment = () => (
  <AppLayout>
    <ModulePage
      title="招聘助手"
      description="AI 简历筛选 + 智能面试安排，提升招聘效率"
      icon={UserPlus}
      stats={[
        { label: "在招职位", value: "48" },
        { label: "本月简历", value: "1,260" },
        { label: "待面试", value: "86" },
        { label: "录用转化率", value: "18%" },
      ]}
      features={[
        "JD 一键智能生成",
        "简历自动筛选与打分",
        "面试日程智能协调",
        "候选人画像分析",
        "Offer 审批与发放",
        "多渠道招聘数据看板",
      ]}
    />
  </AppLayout>
);

export default Recruitment;
