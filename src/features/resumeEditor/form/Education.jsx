import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from "@/features/resumeEditor/ResumeInfoContext";
import { toast } from "sonner";

const emptyEducation = {
  universityName: "",
  degree: "",
  major: "",
  startDate: "",
  endDate: "",
  description: "",
};

function Field({ label, name, value, onChange, type = "text", className = "" }) {
  return (
    <div className={className}>
      <label className="text-sm font-medium block mb-1.5">{label}</label>
      <input
        name={name}
        type={type}
        value={value || ""}
        onChange={onChange}
        className="field-input"
      />
    </div>
  );
}

export default function Education() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const educationList =
    resumeInfo?.education?.length > 0
      ? resumeInfo.education
      : [{ ...emptyEducation }];

  const updateList = (next) => {
    setResumeInfo((prev) => ({ ...prev, education: next }));
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    updateList(
      educationList.map((item, i) =>
        i === index ? { ...item, [name]: value } : item
      )
    );
  };

  return (
    <div className="editor-panel">
      <h2 className="editor-panel-title">Education</h2>
      <p className="editor-panel-desc">Add your educational background.</p>

      <div className="mt-5 space-y-5">
        {educationList.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border border-border bg-secondary/30 p-4 sm:p-5"
          >
            <Field
              label="University / school"
              name="universityName"
              value={item.universityName}
              onChange={(e) => handleChange(index, e)}
              className="sm:col-span-2"
            />
            <Field label="Degree" name="degree" value={item.degree} onChange={(e) => handleChange(index, e)} />
            <Field label="Major" name="major" value={item.major} onChange={(e) => handleChange(index, e)} />
            <Field type="date" label="Start date" name="startDate" value={item.startDate} onChange={(e) => handleChange(index, e)} />
            <Field type="date" label="End date" name="endDate" value={item.endDate} onChange={(e) => handleChange(index, e)} />
            <div className="sm:col-span-2">
              <label className="text-sm font-medium block mb-1.5">Description</label>
              <textarea
                name="description"
                value={item.description || ""}
                onChange={(e) => handleChange(index, e)}
                className="field-input min-h-[96px]"
                placeholder="Coursework, honors, GPA..."
                rows={3}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => updateList([...educationList, { ...emptyEducation }])}
        >
          + Add education
        </Button>
        <Button
          type="button"
          variant="outline"
          className="text-destructive border-destructive/30"
          onClick={() => {
            if (educationList.length <= 1) {
              toast("Keep at least one education card.");
              return;
            }
            updateList(educationList.slice(0, -1));
          }}
        >
          − Remove last
        </Button>
      </div>
    </div>
  );
}
