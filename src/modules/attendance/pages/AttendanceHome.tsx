import { CalendarDays, Clock3, FileClock, Settings2 } from "lucide-react";
import { ModuleSubnav } from "@/components/navigation/ModuleSubnav";
import AttendanceOverviewContent from "@/modules/attendance/pages/AttendanceOverview";

const AttendanceHome = () => {
  return (
    <div className="space-y-6">
      <ModuleSubnav
        title="考勤助手"
        description="统一查看今日概览、月度明细、加班调休与考勤规则配置。"
        items={[
          { label: "今日概览", to: "/attendance/overview", icon: CalendarDays },
          { label: "考勤明细", to: "/attendance/detail", icon: Clock3 },
          { label: "加班与调休", to: "/attendance/overtime", icon: FileClock },
          { label: "规则配置", to: "/attendance/rules", icon: Settings2 },
        ]}
      />
      <AttendanceOverviewContent />
    </div>
  );
};

export default AttendanceHome;
