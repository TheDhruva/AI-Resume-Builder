import React from "react";
import { sanitizeHtml } from "@/lib/utils";

function ExperiencePreview({ resumeInfo }) {
  const themeColor = resumeInfo?.themeColor || "#4F46E5";
  const experiences = resumeInfo?.experience || [];

  return (
    <div className="my-6">
      <h2 className="font-bold text-lg mb-2" style={{ color: themeColor }}>
        Experience
      </h2>
      <hr style={{ borderColor: themeColor }} />

      {experiences.length > 0 ? (
        experiences.map((exp, index) => (
          <div key={index} className="my-5">
            <h3 className="text-sm font-bold">
              {exp?.title || "Job Title"}
            </h3>

            <h3 className="text-xs font-semibold flex justify-between">
              <span>
                {exp?.companyName || "Company"}, {exp?.city || "City"},{" "}
                {exp?.state || "State"}
              </span>
              <span>
                {exp?.startDate || "Start"} –{" "}
                {exp?.currentlyWorking ? "Present" : exp?.endDate || "End"}
              </span>
            </h3>

            {exp?.workSummary ? (
              <div
                className="text-xs my-2"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(exp.workSummary),
                }}
              />
            ) : (
              <p className="text-xs my-2 text-brand-muted">
                Work summary not added.
              </p>
            )}
          </div>
        ))
      ) : (
        <p className="text-xs text-brand-muted mt-3">
          No experiences added yet.
        </p>
      )}
    </div>
  );
}

export default ExperiencePreview;
