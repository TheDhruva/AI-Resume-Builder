import React, { useContext } from "react";
import { ResumeInfoContext } from "@/features/resumeEditor/ResumeInfoContext";
import PersonalDetailPreview from "@/features/resumeEditor/preview/PersonalDetailPreview";
import SummeryPreview from "@/features/resumeEditor/preview/SummeryPreview";
import ExperiencePreview from "@/features/resumeEditor/preview/ExperiencePreview";
import EducationPreview from "@/features/resumeEditor/preview/EducationPreview";
import SkillsPreview from "@/features/resumeEditor/preview/SkillsPreview";
function ResumePreview() {
  const { resumeInfo } = useContext(ResumeInfoContext);

  return (
    <div
      className="shadow-lg h-full p-14 border-t-20px"
      style={{ borderColor: resumeInfo?.themeColor || "#000000" }}
    >
      {/* ✅ Personal Details Section */}
      <PersonalDetailPreview resumeInfo={resumeInfo} />

      {/* ✅ Summary Section */}
      <SummeryPreview resumeInfo={resumeInfo} />

      {/* ✅ Experience Section */}
      <ExperiencePreview resumeInfo={resumeInfo} />

      {/* ✅ Education Section */}
      <EducationPreview resumeInfo={resumeInfo} />

      {/* ✅ Skills Section */}
      <SkillsPreview resumeInfo={resumeInfo} />
    </div>
  );
}

export default ResumePreview;
