import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ResumePreview from "@/features/resumeEditor/ResumePreview";
import FormSection from "@/features/resumeEditor/FormSection";
import { ResumeInfoContext } from "@/features/resumeEditor/ResumeInfoContext";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api"; // Adjust path if needed

function EditResume() {
  const { id } = useParams(); // ✅ Get resume ID from URL
  const [resumeInfo, setResumeInfo] = useState({
    personalDetails: {},
    experience: [],
    education: [],
    skills: [],
    themeColor: "#000000",
  });

  // ✅ Fetch resume from Convex by ID
  const fetchedResume = useQuery(api.resumes.getResumeById, { resumeId: id });

  useEffect(() => {
    if (fetchedResume) {
      setResumeInfo(fetchedResume.resumeInfo || {});
    }
  }, [fetchedResume]);

  if (!fetchedResume) {
    return <p className="p-10 text-gray-500">Loading resume...</p>;
  }

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8">
        {/* Left: Form for editing */}
        <FormSection />

        {/* Right: Live Preview */}
        <ResumePreview />
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default EditResume;
