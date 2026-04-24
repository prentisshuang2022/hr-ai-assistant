import TodayOverview from "@/modules/attendance/components/TodayOverview";
import { useNavigate } from "react-router-dom";

const tabToRoute: Record<string, string> = {
  detail: "/attendance/detail",
  overtime: "/attendance/overtime",
  rules: "/attendance/rules",
};

export default function AttendanceOverview() {
  const navigate = useNavigate();
  const switchTab = (tab: string) => navigate(tabToRoute[tab] || "/attendance/overview");

  return (
    <div className="flex flex-col">
      <div className="border-b px-6 pt-6 pb-4">
        <h1 className="text-xl font-semibold">今日概览</h1>
        <p className="mt-1 text-sm text-muted-foreground">考勤数据智能核算与异常处理中心</p>
      </div>
      <div className="p-6">
        <TodayOverview onSwitchTab={switchTab} />
      </div>
    </div>
  );
}