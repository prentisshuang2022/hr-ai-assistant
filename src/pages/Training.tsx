import { AppLayout } from "@/components/AppLayout";
import { ModulePage } from "@/components/ModulePage";
import { GraduationCap } from "lucide-react";

const Training = () => (
  <AppLayout>
    <ModulePage
      title="培训助手"
      description="个性化学习路径推荐，培训效果智能跟踪"
      icon={GraduationCap}
      stats={[
        { label: "在线课程", value: "286" },
        { label: "本月学习人次", value: "3,420" },
        { label: "完课率", value: "78%" },
        { label: "证书发放", value: "156" },
      ]}
      features={[
        "岗位胜任力学习地图",
        "AI 个性化课程推荐",
        "培训计划自动排期",
        "学习进度实时跟踪",
        "考试与证书管理",
        "培训 ROI 分析",
      ]}
    />
  </AppLayout>
);

export default Training;
