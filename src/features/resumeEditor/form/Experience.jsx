import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from "@/features/resumeEditor/ResumeInfoContext";
import RichTextEditor from "@/components/custom/RichTextEditor";
import AiAssistMenu from "@/features/resumeEditor/AiAssistMenu";
import { toast } from "sonner";

const emptyExperience = {
  title: "",
  companyName: "",
  city: "",
  state: "",
  startDate: "",
  endDate: "",
  currentlyWorking: false,
  workSummary: "",
};

function Field({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
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

export default function Experience() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const experienceList =
    resumeInfo?.experience?.length > 0
      ? resumeInfo.experience
      : [{ ...emptyExperience }];

  const updateList = (next) => {
    setResumeInfo((prev) => ({ ...prev, experience: next }));
  };

  const handleChange = (index, event) => {
    const { name, value, type, checked } = event.target;
    updateList(
      experienceList.map((item, i) =>
        i === index
          ? { ...item, [name]: type === "checkbox" ? checked : value }
          : item
      )
    );
  };

  const handleRichTextChange = (index, html) => {
    updateList(
      experienceList.map((item, i) =>
        i === index ? { ...item, workSummary: html } : item
      )
    );
  };

  return (
    <div className="editor-panel">
      <h2 className="editor-panel-title">Experience</h2>
      <p className="editor-panel-desc">
        Add roles and use AI to generate or improve bullet points.
      </p>

      <div className="mt-5 space-y-5">
        {experienceList.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border border-border bg-secondary/30 p-4 sm:p-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Position title" name="title" value={item.title} onChange={(e) => handleChange(index, e)} />
              <Field label="Company" name="companyName" value={item.companyName} onChange={(e) => handleChange(index, e)} />
              <Field label="City" name="city" value={item.city} onChange={(e) => handleChange(index, e)} />
              <Field label="State / region" name="state" value={item.state} onChange={(e) => handleChange(index, e)} />
              <Field label="Start date" type="date" name="startDate" value={item.startDate} onChange={(e) => handleChange(index, e)} />
              <Field label="End date" type="date" name="endDate" value={item.endDate} onChange={(e) => handleChange(index, e)} />
            </div>

            <label className="mt-3 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="currentlyWorking"
                checked={Boolean(item.currentlyWorking)}
                onChange={(e) => handleChange(index, e)}
                className="h-4 w-4"
              />
              Currently working here
            </label>

            <div className="mt-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-sm font-medium">Work summary</span>
                <AiAssistMenu
                  section="experience"
                  content={item.workSummary || ""}
                  context={{ title: item.title, companyName: item.companyName }}
                  targetJob={resumeInfo?.targetJob}
                  allowedActions={[
                    "improve",
                    "rewrite",
                    "concise",
                    "professional",
                    "technical",
                    "metrics",
                    "tailor",
                    "bullets",
                  ]}
                  onResult={(html) => handleRichTextChange(index, html)}
                />
              </div>
              <RichTextEditor
                defaultValue={item.workSummary}
                index={index}
                positionTitle={item.title}
                companyName={item.companyName}
                targetJob={resumeInfo?.targetJob}
                onRichTextEditorChange={(html) =>
                  handleRichTextChange(index, html)
                }
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => updateList([...experienceList, { ...emptyExperience }])}
        >
          + Add experience
        </Button>
        <Button
          type="button"
          variant="outline"
          className="text-destructive border-destructive/30"
          onClick={() => {
            if (experienceList.length <= 1) {
              toast("Keep at least one experience card.");
              return;
            }
            updateList(experienceList.slice(0, -1));
          }}
        >
          − Remove last
        </Button>
      </div>
    </div>
  );
}
