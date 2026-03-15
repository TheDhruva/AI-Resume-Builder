import React, { useContext } from "react";
import { ResumeInfoContext } from "@/features/resumeEditor/ResumeInfoContext";

import PersonalDetailPreview from "@/features/resumeEditor/preview/PersonalDetailPreview";
import SummeryPreview from "@/features/resumeEditor/preview/SummeryPreview";
import ExperiencePreview from "@/features/resumeEditor/preview/ExperiencePreview";
import EducationPreview from "@/features/resumeEditor/preview/EducationPreview";
import SkillsPreview from "@/features/resumeEditor/preview/SkillsPreview";

function ResumePreview() {
  const { resumeInfo } = useContext(ResumeInfoContext);

  if (!resumeInfo) {
    return (
      <div className="text-center text-brand-muted py-20">
        Preparing preview...
      </div>
    );
  }

  const themeColor = resumeInfo?.themeColor || "#000000";

  return (
    <div
      className="bg-white mx-auto shadow-md rounded-sm
      w-full max-w-[210mm] min-h-[297mm]
      px-10 py-8 border-t-[16px]
      print:shadow-none print:rounded-none print:px-6 print:py-6"
      style={{ borderColor: themeColor }}
    >

      {/* Personal Info */}
      <div className="mb-6">
        <PersonalDetailPreview resumeInfo={resumeInfo} />
      </div>

      {/* Summary */}
      <div className="mb-6">
        <SummeryPreview resumeInfo={resumeInfo} />
      </div>

      {/* Experience */}
      <div className="mb-6">
        <ExperiencePreview resumeInfo={resumeInfo} />
      </div>

      {/* Education */}
      <div className="mb-6">
        <EducationPreview resumeInfo={resumeInfo} />
      </div>

      {/* Skills */}
      <div>
        <SkillsPreview resumeInfo={resumeInfo} />
      </div>

    </div>
  );
}

export default ResumePreview;
