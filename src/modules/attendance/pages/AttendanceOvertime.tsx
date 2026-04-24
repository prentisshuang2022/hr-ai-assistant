import OvertimeLeave from "@/modules/attendance/components/OvertimeLeave";

export default function AttendanceOvertime() {
  return (
    <div className="flex flex-col">
      <div className="border-b px-6 pt-6 pb-4">
        <h1 className="text-xl font-semibold">加班调休</h1>
        <p className="mt-1 text-sm text-muted-foreground">加班与调休数据管理</p>
      </div>
      <div className="p-6">
        <OvertimeLeave />
      </div>
    </div>
  );
}