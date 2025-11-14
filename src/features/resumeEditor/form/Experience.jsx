import React, { useState, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from "@/features/resumeEditor/ResumeInfoContext";
import { toast } from "sonner";
import RichTextEditor from "@/components/custom/RichTextEditor";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams } from "react-router-dom";

const emptyExperience = {
  title: "",
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  workSummary: "",
};

function Experience() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  const updateResumeInfo = useMutation(api.resumes.updateResumeInfo);
  const { id: resumeId } = useParams();

  const themeColor =
    resumeInfo?.resumeInfo?.themeColor ||
    resumeInfo?.themeColor ||
    "#000000";

  const [experienceList, setExperienceList] = useState(() => {
    return (
      resumeInfo?.resumeInfo?.experience ||
      resumeInfo?.experience ||
      [{ ...emptyExperience }]
    );
  });

  useEffect(() => {
    const loaded =
      resumeInfo?.resumeInfo?.experience ||
      resumeInfo?.experience ||
      [];

    if (loaded.length > 0) {
      setExperienceList(loaded);
    }
  }, [resumeInfo]);

  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      resumeInfo: {
        ...prev.resumeInfo,
        experience: experienceList,
      },
    }));
  }, [experienceList]);

  const onSave = async () => {
    try {
      await updateResumeInfo({
        resumeId,
        field: "resumeInfo",
        value: {
          ...resumeInfo?.resumeInfo,
          experience: experienceList,
        },
      });

      toast.success("Experience saved!");
    } catch (err) {
      console.error("Error saving:", err);
      toast.error("Failed to save experience.");
    }
  };

  const handleChange = (index, event) => {
    const { name, value } = event.target;

    setExperienceList((prev) => {
      const updated = [...prev];
      updated[index][name] = value;
      return updated;
    });
  };

  const handleRichTextChange = (index, html) => {
    setExperienceList((prev) => {
      const updated = [...prev];
      updated[index].workSummary = html;
      return updated;
    });
  };

  const AddNewExperience = () => {
    setExperienceList((prev) => [...prev, { ...emptyExperience }]);
  };

  const RemoveExperience = () => {
    setExperienceList((prev) => {
      if (prev.length === 1) {
        toast("At least one experience is required");
        return prev;
      }
      return prev.slice(0, -1);
    });
  };

  return (
    <div
      className="p-5 shadow-lg rounded-lg mt-4"
      style={{ borderTop: `4px solid ${themeColor}` }}
    >
      <h2
        className="font-bold text-lg mb-1"
        style={{ color: themeColor }}
      >
        Professional Experience
      </h2>

      {experienceList.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-2 gap-3 p-4 mb-5 rounded bg-gray-50"
          style={{
            borderLeft: `3px solid ${themeColor}`,
          }}
        >
          <InputField
            label="Position Title"
            name="title"
            value={item.title}
            onChange={(e) => handleChange(index, e)}
          />

          <InputField
            label="Company Name"
            name="companyName"
            value={item.companyName}
            onChange={(e) => handleChange(index, e)}
          />

          <InputField
            label="City"
            name="city"
            value={item.city}
            onChange={(e) => handleChange(index, e)}
          />

          <InputField
            label="State"
            name="state"
            value={item.state}
            onChange={(e) => handleChange(index, e)}
          />

          <InputField
            label="Start Date"
            type="date"
            name="startDate"
            value={item.startDate}
            onChange={(e) => handleChange(index, e)}
          />

          <InputField
            label="End Date"
            type="date"
            name="endDate"
            value={item.endDate}
            onChange={(e) => handleChange(index, e)}
          />

          <div className="col-span-2">
            <label className="text-xs font-medium">Work Summary</label>
            <RichTextEditor
              defaultValue={item.workSummary}
              index={index}
              onRichTextEditorChange={(html) =>
                handleRichTextChange(index, html)
              }
            />
          </div>
        </div>
      ))}

      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={AddNewExperience}>
          + Add Experience
        </Button>
        <Button variant="outline" onClick={RemoveExperience}>
          - Remove
        </Button>
        <Button onClick={onSave}>Save</Button>
      </div>
    </div>
  );
}

const InputField = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="text-xs">{label}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded mt-1"
    />
  </div>
);

export default Experience;
