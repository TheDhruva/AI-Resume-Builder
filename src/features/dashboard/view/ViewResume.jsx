import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

import { Button } from "@/components/ui/button";
import ResumePreview from "../../resumeEditor/ResumePreview";
import { ResumeInfoContext } from "../../resumeEditor/ResumeInfoContext";
import PageContainer from "@/components/layout/PageContainer";

function ViewResume() {
  const { id } = useParams();

  const resumeData = useQuery(
    api.resumes.getResumeById,
    id ? { resumeId: id } : "skip"
  );

  const [resumeInfo, setResumeInfo] = useState(null);

  useEffect(() => {
    if (resumeData?.resumeInfo) {
      setResumeInfo(resumeData.resumeInfo);
    }
  }, [resumeData]);

  const handleDownload = () => {
    window.print();
  };

  const handleShare = async () => {
    const url = `${import.meta.env.VITE_BASE_URL}/dashboard/resume/${id}/view`;

    if (navigator.share) {
      await navigator.share({
        title: `${resumeInfo?.personalDetails?.firstName || ""} ${
          resumeInfo?.personalDetails?.lastName || ""
        } Resume`,
        text: "Check out my resume",
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Resume link copied to clipboard!");
    }
  };

  if (resumeData === undefined) {
    return (
      <PageContainer>
        <div className="text-center py-20 text-brand-muted">
          Loading resume...
        </div>
      </PageContainer>
    );
  }

  if (!resumeData) {
    return (
      <PageContainer>
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold mb-2">Resume not found</h2>
          <p className="text-brand-muted">
            The resume you are trying to view does not exist.
          </p>
        </div>
      </PageContainer>
    );
  }

  if (!resumeInfo) {
    return (
      <PageContainer>
        <div className="text-center py-20 text-brand-muted">
          Preparing resume...
        </div>
      </PageContainer>
    );
  }

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>

      <PageContainer className="min-h-screen">

        {/* UI CONTROLS (NOT PRINTED) */}
        <div className="pb-10 print:hidden">

          <div className="max-w-2xl mx-auto text-center mt-12">

            <h2 className="text-3xl font-bold tracking-tight text-brand-text">
              🎉 Your Resume is Ready
            </h2>

            <p className="text-brand-muted mt-3">
              Download or share your resume link
            </p>

            <div className="flex justify-center gap-4 mt-8">

              <Button onClick={handleDownload} className="rounded-full shadow-sm">
                Download PDF
              </Button>

              <Button
                variant="outline"
                onClick={handleShare}
                className="rounded-full"
              >
                Share Link
              </Button>

            </div>

          </div>

        </div>

        {/* PRINT AREA */}
        <div
          id="print-area"
          className="bg-white mx-auto max-w-[210mm] min-h-[297mm] p-8 shadow-lg rounded-sm print:shadow-none print:p-0"
        >
          <ResumePreview />
        </div>

      </PageContainer>

    </ResumeInfoContext.Provider>
  );
}

export default ViewResume;
