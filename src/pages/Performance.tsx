import { AppLayout } from "@/components/AppLayout";
import { ModulePage } from "@/components/ModulePage";
import { TrendingUp } from "lucide-react";

const Performance = () => (
  <AppLayout>
    <ModulePage
      title="绩效助手"
      description="OKR / KPI 全流程跟踪，AI 辅助绩效评估"
      icon={TrendingUp}
      stats={[
        { label: "本季度目标", value: "562" },
        { label: "已完成", value: "418" },
        { label: "平均达成率", value: "86%" },
        { label: "待评审", value: "74" },
      ]}
      features={[
        "OKR / KPI 目标拆解",
        "绩效进度自动跟踪",
        "360 度评估收集",
        "AI 生成绩效评语",
        "绩效校准会辅助",
        "结果应用与激励建议",
      ]}
    />
  </AppLayout>
);

export default Performance;
