import React from "react";

function SkillsPreview({ resumeInfo }) {
  const themeColor = resumeInfo?.themeColor || "#4F46E5";
  const skills = resumeInfo?.skills || [];

  return (
    <div className="my-6">
      <h2
        className="font-bold text-lg mb-2 uppercase"
        style={{ color: themeColor }}
      >
        Skills
      </h2>
      <hr style={{ borderColor: themeColor }} />

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
          <p className="text-xs text-brand-muted mt-3">No skills added yet.</p>
        )}
      </div>
    </div>
  );
}

export default SkillsPreview;
