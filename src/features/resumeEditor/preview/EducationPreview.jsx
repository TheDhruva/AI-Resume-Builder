import React from "react";

function EducationPreview({ resumeInfo }) {
  const themeColor = resumeInfo?.themeColor || "#4F46E5";
  const educationList = resumeInfo?.education || [];

  return (
    <div className="my-6">
      <h2 className="font-bold text-lg mb-2" style={{ color: themeColor }}>
        Education
      </h2>
      <hr style={{ borderColor: themeColor }} />

      {educationList.length === 0 ? (
        <p className="text-xs text-brand-muted mt-3">
          No education details added yet.
        </p>
      ) : (
        educationList.map((education, index) => (
          <div key={index} className="my-5">
            <h3 className="text-sm font-bold" style={{ color: themeColor }}>
              {education?.universityName || "University Name"}
            </h3>
            <h4 className="text-xs flex justify-between font-semibold">
              <span>
                {education?.degree || "Degree"}
                {education?.major ? ` (${education.major})` : ""}
              </span>
              <span>
                {education?.startDate || "Start"} –{" "}
                {education?.endDate || "Present"}
              </span>
            </h4>
            {education?.description ? (
              <p className="text-xs my-2">{education.description}</p>
            ) : (
              <p className="text-xs my-2 text-brand-muted">
                Coursework / achievements not added.
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default EducationPreview;
