import RuleEngine from "@/modules/attendance/components/RuleEngine";

export default function AttendanceRules() {
  return (
    <div className="flex flex-col">
      <div className="border-b px-6 pt-6 pb-4">
        <h1 className="text-xl font-semibold">规则引擎</h1>
        <p className="mt-1 text-sm text-muted-foreground">考勤规则配置与管理</p>
      </div>
      <div className="p-6">
        <RuleEngine />
      </div>
    </div>
  );
}