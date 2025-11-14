import React from "react";

function ExperiencePreview({ resumeInfo }) {
  const themeColor =
    resumeInfo?.resumeInfo?.themeColor ||
    resumeInfo?.themeColor ||
    "#000000";

  // Support both root-level and nested resumeInfo
  const experiences =
    resumeInfo?.resumeInfo?.experience ||
    resumeInfo?.experience ||
    [];

  return (
    <div className="my-6">
      {/* Section Header */}
      <h2 className="font-bold text-lg mb-2" style={{ color: themeColor }}>
        Experience
      </h2>
      <hr style={{ borderColor: themeColor }} />

      {/* Experience List */}
      {experiences.length > 0 ? (
        experiences.map((exp, index) => (
          <div key={index} className="my-5">
            <h3 className="text-sm font-bold">{exp?.title || "Job Title"}</h3>

            <h3 className="text-xs font-semibold flex justify-between">
              <span>
                {exp?.companyName || "Company"},{" "}
                {exp?.city || "City"},{" "}
                {exp?.state || "State"}
              </span>

              <span>
                {exp?.startDate || "Start"} –{" "}
                {exp?.currentlyWorking
                  ? "Present"
                  : exp?.endDate || "End"}
              </span>
            </h3>

            {/* Work Summary (HTML from RichTextEditor) */}
            {exp?.workSummary ? (
              <div
                className="text-xs my-2"
                dangerouslySetInnerHTML={{ __html: exp.workSummary }}
              />
            ) : (
              <p className="text-xs my-2 text-gray-500">
                Work summary not added.
              </p>
            )}
          </div>
        ))
      ) : (
        <p className="text-xs text-gray-500 mt-3">
          No experiences added yet.
        </p>
      )}
    </div>
  );
}

export default ExperiencePreview;
