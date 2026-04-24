import { AppLayout } from "@/components/AppLayout";
import { ModulePage } from "@/components/ModulePage";
import { Clock } from "lucide-react";

const Attendance = () => (
  <AppLayout>
    <ModulePage
      title="考勤助手"
      description="自动汇总考勤数据，异常智能预警"
      icon={Clock}
      stats={[
        { label: "今日出勤", value: "1,196" },
        { label: "迟到", value: "12" },
        { label: "请假", value: "28" },
        { label: "加班时长", value: "342h" },
      ]}
      features={[
        "多设备打卡数据汇总",
        "请假审批智能流转",
        "考勤异常自动识别",
        "月度考勤报表生成",
        "排班智能优化建议",
        "节假日规则自动适配",
      ]}
    />
  </AppLayout>
);

export default Attendance;
