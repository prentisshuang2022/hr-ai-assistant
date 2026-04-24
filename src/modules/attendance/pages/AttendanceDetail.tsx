import AttendanceHeatmap from "@/modules/attendance/components/AttendanceHeatmap";
import { useNavigate } from "react-router-dom";

const tabToRoute: Record<string, string> = {
  overtime: "/attendance/overtime",
  overview: "/attendance/overview",
  rules: "/attendance/rules",
};

export default function AttendanceDetail() {
  const navigate = useNavigate();
  const switchTab = (tab: string) => navigate(tabToRoute[tab] || "/attendance/detail");

  return (
    <div className="flex flex-col">
      <div className="border-b px-6 pt-6 pb-4">
        <h1 className="text-xl font-semibold">考勤明细</h1>
        <p className="mt-1 text-sm text-muted-foreground">全员月度考勤热力图与明细查询</p>
      </div>
      <div className="p-6">
        <AttendanceHeatmap onSwitchTab={switchTab} />
      </div>
    </div>
  );
}