import React from "react";

function SkillsPreview({ resumeInfo }) {
  // Safe theme color
  const themeColor =
    resumeInfo?.resumeInfo?.themeColor ||
    resumeInfo?.themeColor ||
    "#000000";

  // Safe skills extraction (supports both formats)
  const skills =
    resumeInfo?.resumeInfo?.skills ||
    resumeInfo?.skills ||
    [];

  return (
    <div className="my-6">
      {/* Header */}
      <h2
        className="font-bold text-lg mb-2 uppercase"
        style={{ color: themeColor }}
      >
        Skills
      </h2>
      <hr style={{ borderColor: themeColor }} />

      {/* List */}
      <div className="mt-3 space-y-2">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <div key={index} className="text-sm">
              <span className="font-semibold">
                {skill?.category || "Category"}:
              </span>{" "}
              <span>
                {Array.isArray(skill?.items)
                  ? skill.items.join(", ")
                  : "No items"}
              </span>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-500 mt-3">
            No skills added yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default SkillsPreview;
