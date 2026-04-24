import { AlertTriangle, LayoutDashboard, RefreshCw, UserPlus, Users } from "lucide-react";
import { ModuleSubnav } from "@/components/navigation/ModuleSubnav";
import EmployeeDashboardContent from "@/modules/employee/pages/Dashboard";

const EmployeeDashboard = () => {
  return (
    <div className="space-y-6">
      <ModuleSubnav
        title="员工档案助手"
        description="聚合人员流动、员工档案、关键预警和钉钉同步能力。"
        items={[
          { label: "流动看板", to: "/employee", icon: LayoutDashboard },
          { label: "员工档案", to: "/employee/employees", icon: Users },
          { label: "新增员工", to: "/employee/employees/new", icon: UserPlus },
          { label: "预警中心", to: "/employee/alerts", icon: AlertTriangle },
          { label: "钉钉同步", to: "/employee/sync", icon: RefreshCw },
        ]}
      />
      <EmployeeDashboardContent />
    </div>
  );
};

export default EmployeeDashboard;
