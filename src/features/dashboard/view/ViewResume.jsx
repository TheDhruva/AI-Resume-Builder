import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";

import ResumePreview from "../../resumeEditor/ResumePreview";
import { ResumeInfoContext } from "../../resumeEditor/ResumeInfoContext";
import Header from "@/components/custom/Header";

function ViewResume() {
  const { id } = useParams(); // dynamic route param

  const resumeData = useQuery(api.resumes.getResumeById, {
    resumeId: id,
  });

  const [resumeInfo, setResumeInfo] = useState(null);

  useEffect(() => {
    if (resumeData?.resumeInfo) {
      setResumeInfo(resumeData.resumeInfo);
    }
  }, [resumeData]);

  const handleDownload = () => window.print();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${resumeInfo?.personalDetails?.firstName || ""} ${
          resumeInfo?.personalDetails?.lastName || ""
        } Resume`,
        text: "Checkout my resume!",
        url: `${import.meta.env.VITE_BASE_URL}/dashboard/resume/${id}/view`,
      });
    } else {
      alert("Sharing not supported on this browser.");
    }
  };

  if (!resumeData) return <p>Loading...</p>;
  if (!resumeInfo) return <p>Preparing Resume...</p>;

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className="min-h-screen">

        {/* Non-print section */}
        <div id="no-print" className="pb-8">

          <div className="my-10 mx-5 md:mx-10 lg:mx-40">
            <h2 className="text-center text-2xl font-semibold">
              🎉 Your Resume is Ready!
            </h2>
            <p className="text-center text-gray-500">
              Download or share your unique resume link
            </p>

            <div className="flex justify-center gap-4 mt-8">
              <Button onClick={handleDownload}>Download PDF</Button>

              <Button variant="outline" onClick={handleShare}>
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* PRINT-ONLY */}
        <div id="print-area" className="p-6 print:p-0">
          <ResumePreview />
        </div>

      </div>
    </ResumeInfoContext.Provider>
  );
}

export default ViewResume;
