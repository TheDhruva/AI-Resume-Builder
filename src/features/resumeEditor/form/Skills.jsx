import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from "@/features/resumeEditor/ResumeInfoContext";
import { toast } from "sonner";

const emptySkill = { category: "", items: [], itemsText: "" };

export default function Skills() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  const skillsList =
    resumeInfo?.skills?.length > 0
      ? resumeInfo.skills.map((s) => ({
          ...s,
          itemsText: s.itemsText ?? (s.items || []).join(", "),
        }))
      : [{ ...emptySkill }];

  const missing = resumeInfo?.targetJob?.insights?.requiredSkills || [];

  const updateList = (next) => {
    setResumeInfo((prev) => ({
      ...prev,
      skills: next.map(({ itemsText, category, items }) => ({
        category,
        items:
          items ||
          String(itemsText || "")
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean),
      })),
    }));
  };

  const handleChange = (index, field, value) => {
    const next = skillsList.map((skill, i) => {
      if (i !== index) return skill;
      if (field === "itemsText") {
        return {
          ...skill,
          itemsText: value,
          items: value
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean),
        };
      }
      return { ...skill, [field]: value };
    });
    updateList(next);
  };

  const addMissingKeyword = (keyword) => {
    const first = { ...(skillsList[0] || emptySkill) };
    const items = [...(first.items || [])];
    if (items.some((i) => i.toLowerCase() === keyword.toLowerCase())) {
      toast("Already in skills");
      return;
    }
    items.push(keyword);
    first.category = first.category || "Skills";
    first.items = items;
    first.itemsText = items.join(", ");
    updateList([first, ...skillsList.slice(1)]);
    toast.success(`Added ${keyword}`);
  };

  const resumeSkillSet = new Set(
    skillsList.flatMap((s) => (s.items || []).map((i) => i.toLowerCase()))
  );
  const missingShown = missing.filter(
    (m) =>
      ![...resumeSkillSet].some(
        (r) => r.includes(m.toLowerCase()) || m.toLowerCase().includes(r)
      )
  );

  return (
    <div className="editor-panel">
      <h2 className="editor-panel-title">Skills</h2>
      <p className="editor-panel-desc">
        Group skills by category. Add missing JD keywords with one tap.
      </p>

      {missingShown.length > 0 && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-sm font-medium text-amber-900 mb-2">
            Missing from job description
          </p>
          <div className="flex flex-wrap gap-2">
            {missingShown.slice(0, 12).map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => addMissingKeyword(kw)}
                className="text-xs px-2.5 py-1 rounded-md border border-amber-300 bg-white hover:bg-amber-100 focus-visible:ring-2 focus-visible:ring-ring"
              >
                + {kw}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 space-y-4">
        {skillsList.map((skill, index) => (
          <div
            key={index}
            className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3"
          >
            <div>
              <label className="text-sm font-medium block mb-1.5">Category</label>
              <input
                className="field-input"
                value={skill.category || ""}
                onChange={(e) => handleChange(index, "category", e.target.value)}
                placeholder="Frontend, Backend, Tools..."
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">
                Skills (comma separated)
              </label>
              <input
                className="field-input"
                value={skill.itemsText || ""}
                onChange={(e) => handleChange(index, "itemsText", e.target.value)}
                placeholder="React, Next.js, Tailwind, Git"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => updateList([...skillsList, { ...emptySkill }])}
        >
          + Add skill group
        </Button>
        <Button
          type="button"
          variant="outline"
          className="text-destructive border-destructive/30"
          onClick={() => {
            if (skillsList.length <= 1) {
              toast("Keep at least one skill group.");
              return;
            }
            updateList(skillsList.slice(0, -1));
          }}
        >
          − Remove last
        </Button>
      </div>
    </div>
  );
}
