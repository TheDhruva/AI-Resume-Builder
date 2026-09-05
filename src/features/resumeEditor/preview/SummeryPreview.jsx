import React from "react";

function SummeryPreview({ resumeInfo }) {
  return (
    <p className="text-sm text-brand-text leading-relaxed">
      {resumeInfo?.summary ||
        "Professional summary goes here. This is a brief overview of your skills, experience, and career goals."}
    </p>
  );
}

export default SummeryPreview;
