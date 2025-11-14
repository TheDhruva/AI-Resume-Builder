import React, { useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from "@/features/resumeEditor/ResumeInfoContext";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams } from "react-router-dom";

const emptyEducation = {
  universityName: "",
  degree: "",
  major: "",
  startDate: "",
  endDate: "",
  description: "",
};

function Education() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const updateResumeInfo = useMutation(api.resumes.updateResumeInfo);
  const { id: resumeId } = useParams();

  // 1. ROBUST INITIALIZATION
  // Check both paths immediately to try and catch data if it's already there
  const [educationList, setEducationList] = useState(() => {
    return (
      resumeInfo?.resumeInfo?.education ||
      resumeInfo?.education ||
      [{ ...emptyEducation }]
    );
  });

  // 2. SMART LOAD & SYNC
  // This watches for when the DB data finally arrives
  useEffect(() => {
    const dbEducation =
      resumeInfo?.resumeInfo?.education ||
      resumeInfo?.education ||
      [];

    // Only update local state if DB has data AND it is different from local
    // This prevents the "typing loop" bug and ensures data appears on reload
    if (dbEducation.length > 0) {
      if (JSON.stringify(educationList) !== JSON.stringify(dbEducation)) {
        setEducationList(dbEducation);
      }
    }
  }, [resumeInfo]);

  // 3. LIVE PREVIEW UPDATE
  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      resumeInfo: {
        ...prev.resumeInfo,
        education: educationList,
      },
    }));
  }, [educationList]);

  // Handle input changes
  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...educationList];
    updated[index][name] = value;
    setEducationList(updated);
  };

  const AddNewEducation = () =>
    setEducationList((prev) => [...prev, { ...emptyEducation }]);

  const RemoveEducation = () => {
    if (educationList.length === 1) {
      toast("At least one education entry is required");
      return;
    }
    setEducationList((prev) => prev.slice(0, -1));
  };

  // REAL SAVE (Convex)
  const handleSave = async () => {
    try {
      await updateResumeInfo({
        resumeId,
        field: "resumeInfo",
        value: {
          ...resumeInfo?.resumeInfo,
          education: educationList,
        },
      });

      toast.success("Education saved permanently!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save.");
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-4 border-primary mt-4">
      <h2 className="font-bold text-lg text-gray-800 mb-1">Education</h2>
      <p className="text-gray-500 mb-4">Add your educational details.</p>

      {educationList.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-2 gap-3 border p-4 mb-5 rounded-lg bg-gray-50"
        >
          <InputField
            label="University Name"
            name="universityName"
            value={item?.universityName || ""} // Safety fallback
            onChange={(e) => handleChange(index, e)}
          />

          <InputField
            label="Degree"
            name="degree"
            value={item?.degree || ""}
            onChange={(e) => handleChange(index, e)}
          />

          <InputField
            label="Major"
            name="major"
            value={item?.major || ""}
            onChange={(e) => handleChange(index, e)}
          />

          <InputField
            type="date"
            label="Start Date"
            name="startDate"
            value={item?.startDate || ""}
            onChange={(e) => handleChange(index, e)}
          />

          <InputField
            type="date"
            label="End Date"
            name="endDate"
            value={item?.endDate || ""}
            onChange={(e) => handleChange(index, e)}
          />

          <div className="col-span-2">
            <label className="text-xs font-medium">Description</label>
            <textarea
              name="description"
              value={item?.description || ""}
              onChange={(e) => handleChange(index, e)}
              className="w-full p-2 border rounded-md outline-none text-sm mt-1"
              placeholder="Describe your coursework, achievements..."
            />
          </div>
        </div>
      ))}

      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={AddNewEducation}>
          + Add Education
        </Button>

        <Button variant="outline" onClick={RemoveEducation}>
          - Remove
        </Button>

        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}

const InputField = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="text-xs font-medium">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded-md outline-none text-sm mt-1"
    />
  </div>
);

export default Education;