import { Briefcase, FileText, LayoutDashboard, Upload, Users } from "lucide-react";
import { ModuleSubnav } from "@/components/navigation/ModuleSubnav";
import RecruitmentDashboardContent from "@/modules/recruitment/pages/RecruitmentDashboard";

const RecruitmentHome = () => {
  return (
    <div className="space-y-6">
      <ModuleSubnav
        title="招聘助手"
        description="统一入口查看招聘工作台、岗位管理、简历库和候选人台账。"
        items={[
          { label: "招聘工作台", to: "/recruitment", icon: LayoutDashboard },
          { label: "岗位与 JD", to: "/recruitment/jobs", icon: Briefcase },
          { label: "新建岗位", to: "/recruitment/jobs/new", icon: FileText },
          { label: "简历库", to: "/recruitment/resumes", icon: Upload },
          { label: "候选人台账", to: "/recruitment/candidates", icon: Users },
        ]}
      />
      <RecruitmentDashboardContent />
    </div>
  );
};

export default RecruitmentHome;
