import React, { useContext, useState } from "react";
import { ResumeInfoContext } from "@/features/resumeEditor/ResumeInfoContext";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; // ✅ correct loader import

function PersonalDetail({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const updateResumeInfo = useMutation(api.resumes.updateResumeInfo);
  const { id: resumeId } = useParams();
  const [loading, setLoading] = useState(false);

  // ✅ Handle input updates locally for live preview
  const handleInputChange = (e) => {
    enabledNext && enabledNext(false);
    const { name, value } = e.target;

    setResumeInfo((prev) => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [name]: value,
      },
    }));
  };

  // ✅ Save to Convex Database
  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateResumeInfo({
        resumeId,
        field: "resumeInfo",
        value: {
          ...resumeInfo.resumeInfo,
          personalDetails: resumeInfo.personalDetails,
        },
      });

      console.log("✅ Saved to Convex:", resumeInfo.personalDetails);
      toast.success("Personal details saved!");
      enabledNext && enabledNext(true);
    } catch (err) {
      console.error("❌ Error saving:", err);
      toast.error("Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-4 border-primary mt-4">
      <h2 className="font-bold text-lg mb-2 text-gray-800">Personal Details</h2>
      <p className="text-gray-500 mb-4">
        Enter your basic information below.
      </p>

      <form onSubmit={onSave}>
        <div className="grid grid-cols-2 mt-5 gap-4">
          <InputField
            label="First Name"
            name="firstName"
            defaultValue={resumeInfo?.personalDetails?.firstName || ""}
            value={resumeInfo?.personalDetails?.firstName || ""}
            onChange={handleInputChange}
          />
          <InputField
            label="Last Name"
            name="lastName"
            defaultValue={resumeInfo?.personalDetails?.lastName || ""}
            value={resumeInfo?.personalDetails?.lastName || ""}
            onChange={handleInputChange}
          />
          <InputField
            label="Job Title"
            name="jobTitle"
            defaultValue={resumeInfo?.personalDetails?.jobTitle || ""}
            value={resumeInfo?.personalDetails?.jobTitle || ""}
            className="col-span-2"
            onChange={handleInputChange}
          />
          <InputField
            label="Email"
            name="email"
            defaultValue={resumeInfo?.personalDetails?.email || ""}
            type="email"
            value={resumeInfo?.personalDetails?.email || ""}
            onChange={handleInputChange}
          />
          <InputField
            label="Phone"
            name="phone"
            defaultValue={resumeInfo?.personalDetails?.phone || ""}
            type="tel"
            value={resumeInfo?.personalDetails?.phone || ""}
            onChange={handleInputChange}
          />
          <InputField
            label="Address"
            name="address"
            defaultValue={resumeInfo?.personalDetails?.address || ""}
            className="col-span-2"
            value={resumeInfo?.personalDetails?.address || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="mt-5 flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Saving...
              </div>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

// 🔹 Reusable input field
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  className = "",
}) => (
  <div className={className}>
    <label className="text-sm block mb-1">{label}</label>
    <input
      name={name}
      type={type}
      required
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded-md outline-none focus:ring-2 focus:ring-primary"
    />
  </div>
);

export default PersonalDetail;
