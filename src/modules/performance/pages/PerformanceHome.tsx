import { ClipboardCheck, LayoutDashboard, ListChecks, Settings2 } from "lucide-react";
import { ModuleSubnav } from "@/components/navigation/ModuleSubnav";
import PerformanceDashboardContent from "@/modules/performance/pages/Dashboard";

const PerformanceHome = () => {
  return (
    <div className="space-y-6">
      <ModuleSubnav
        title="绩效助手"
        description="统一管理考核工作台、考核发布、指标库与绩效过程。"
        items={[
          { label: "绩效工作台", to: "/performance", icon: LayoutDashboard },
          { label: "新建考核", to: "/performance/assessments/new", icon: ClipboardCheck },
          { label: "指标库管理", to: "/performance/indicators", icon: Settings2 },
          { label: "员工绩效管理", to: "/performance/reviews", icon: ListChecks },
        ]}
      />
      <PerformanceDashboardContent />
    </div>
  );
};

export default PerformanceHome;
