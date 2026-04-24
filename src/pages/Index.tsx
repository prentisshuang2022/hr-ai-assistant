import { AppLayout } from "@/components/AppLayout";
import { ModulePage } from "@/components/ModulePage";
import { Users } from "lucide-react";

const Index = () => {
  return (
    <AppLayout>
      <ModulePage
        title="员工档案助手"
        description="一站式管理员工档案信息，AI 自动整理与查询"
        icon={Users}
        stats={[
          { label: "在职员工", value: "1,248" },
          { label: "本月新入职", value: "32" },
          { label: "档案完整率", value: "98.5%" },
          { label: "AI 处理量", value: "2,156" },
        ]}
        features={[
          "员工信息智能录入与校验",
          "合同与证件到期提醒",
          "组织架构自动同步",
          "一键导出员工花名册",
          "智能问答快速查档",
          "员工生命周期管理",
        ]}
      />
    </AppLayout>
  );
};

export default Index;
