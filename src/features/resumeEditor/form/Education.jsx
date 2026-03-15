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

function Education({ enabledNext }) {
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
    enabledNext && enabledNext(false);
    const { name, value } = e.target;
    const updated = [...educationList];
    updated[index][name] = value;
    setEducationList(updated);
  };

  const AddNewEducation = () => {
    enabledNext && enabledNext(false);
    setEducationList((prev) => [...prev, { ...emptyEducation }]);
  };

  const RemoveEducation = () => {
    enabledNext && enabledNext(false);
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
      enabledNext && enabledNext(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save.");
    }
  };

  return (
    <div className="p-6 shadow-sm rounded-xl border-[1px] border-x-gray-200 border-b-gray-200 border-t-4 border-t-primary bg-white mt-4">
      <h2 className="font-bold text-xl text-gray-900 mb-1">Education</h2>
      <p className="text-muted-foreground text-sm mb-6">Add your educational details.</p>

      {educationList.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-gray-100 p-5 mb-5 rounded-lg bg-gray-50/50"
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

          <div className="col-span-1 sm:col-span-2 mt-2">
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Description</label>
            <textarea
              name="description"
              value={item?.description || ""}
              onChange={(e) => handleChange(index, e)}
              className="w-full p-2.5 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
              placeholder="Describe your coursework, achievements..."
              rows={4}
            />
          </div>
        </div>
      ))}

      <div className="flex justify-between mt-6">
        <div className="flex gap-2">
          <Button variant="outline" onClick={AddNewEducation}>
            + Add Education
          </Button>

          <Button variant="outline" onClick={RemoveEducation} className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200">
            - Remove
          </Button>
        </div>

        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}

const InputField = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 block mb-1.5">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full p-2.5 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
    />
  </div>
);

export default Education;