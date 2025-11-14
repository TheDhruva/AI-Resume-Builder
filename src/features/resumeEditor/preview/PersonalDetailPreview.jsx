import React from "react";

function PersonalDetailPreview({ resumeInfo }) {
  if (!resumeInfo) return <div>Loading...</div>;

  const themeColor = resumeInfo?.themeColor || "#000000";

  return (
    <div>
      {/* ✅ Name */}
      <h2
        className="font-bold text-xl text-center"
        style={{ color: themeColor }}
      >
        {resumeInfo?.personalDetails?.firstName || "First Name"} {resumeInfo?.personalDetails?.lastName || "Last Name"}
      </h2>

      {/* ✅ Job Title */}
      <h2
        className="text-center text-sm font-medium mb-2"
        style={{ color: themeColor }}
      >
        {resumeInfo?.personalDetails?.jobTitle || "Job Title"}
      </h2>

      {/* ✅ Contact Info */}
      <h2
        className="text-center text-sm font-medium"
        style={{ color: themeColor }}
      >
        {resumeInfo?.personalDetails?.address || "Address"} •{" "}
        {resumeInfo?.personalDetails?.phone || "Phone Number"} •{" "}
        {resumeInfo?.personalDetails?.email || "Email Address"}
      </h2>

      {/* ✅ Divider */}
      <hr
        className="border-[1.5px] my-3"
        style={{ borderColor: themeColor }}
      />
    </div>
  );
}

export default PersonalDetailPreview;
