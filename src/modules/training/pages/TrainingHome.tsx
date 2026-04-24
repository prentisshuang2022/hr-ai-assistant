import { Archive, BookOpenCheck, GraduationCap, PlaySquare, Workflow } from "lucide-react";
import { ModuleSubnav } from "@/components/navigation/ModuleSubnav";
import TrainingDashboardContent from "@/modules/training/pages/Dashboard";

const TrainingHome = () => {
  return (
    <div className="space-y-6">
      <ModuleSubnav
        title="培训助手"
        description="统一进入培训总览、题库、考试、在岗培训和培训记录。"
        items={[
          { label: "培训总览", to: "/training", icon: GraduationCap },
          { label: "题库管理", to: "/training/question-bank", icon: BookOpenCheck },
          { label: "考试中心", to: "/training/exam-center", icon: PlaySquare },
          { label: "在岗培训", to: "/training/on-job", icon: Workflow },
          { label: "培训记录", to: "/training/records", icon: Archive },
        ]}
      />
      <TrainingDashboardContent />
    </div>
  );
};

export default TrainingHome;
