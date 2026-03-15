import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ResumePreview from "@/features/resumeEditor/ResumePreview";
import FormSection from "@/features/resumeEditor/FormSection";
import { ResumeInfoContext } from "@/features/resumeEditor/ResumeInfoContext";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

import PageContainer from "@/components/layout/PageContainer";

function EditResume() {
  const { id } = useParams();

  const [resumeInfo, setResumeInfo] = useState({
    personalDetails: {},
    experience: [],
    education: [],
    skills: [],
    themeColor: "#4F46E5",
  });

  const fetchedResume = useQuery(
    api.resumes.getResumeById,
    id ? { resumeId: id } : "skip"
  );

  useEffect(() => {
    if (fetchedResume?.resumeInfo) {
      setResumeInfo(fetchedResume.resumeInfo);
    }
  }, [fetchedResume]);

  // Loading
  if (fetchedResume === undefined) {
    return (
      <PageContainer>
        <div className="text-center py-20 text-brand-muted">
          Loading resume editor...
        </div>
      </PageContainer>
    );
  }

  // Not found
  if (!fetchedResume) {
    return (
      <PageContainer>
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold mb-2">
            Resume not found
          </h2>
          <p className="text-brand-muted">
            The resume you are trying to edit does not exist.
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <PageContainer className="pt-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ---------- FORM SECTION ---------- */}
          <div className="space-y-6">
            <FormSection />
          </div>

          {/* ---------- LIVE PREVIEW ---------- */}
          <div className="sticky top-24 h-fit">
            <ResumePreview />
          </div>

        </div>

      </PageContainer>
    </ResumeInfoContext.Provider>
  );
}

export default EditResume;
