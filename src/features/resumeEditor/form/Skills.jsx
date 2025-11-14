import React, { useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from "@/features/resumeEditor/ResumeInfoContext";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams } from "react-router-dom";

const emptySkill = {
  category: "",
  itemsText: "",
  items: [],
};

function Skills() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const updateResumeInfo = useMutation(api.resumes.updateResumeInfo);
  const { id: resumeId } = useParams();

  // 1. ROBUST INITIALIZATION
  // check both paths immediately on load to prevent flash of empty state
  const [skillsList, setSkillsList] = useState(() => {
    const dbSkills = 
      resumeInfo?.resumeInfo?.skills || 
      resumeInfo?.skills || 
      [];

    if (dbSkills.length > 0) {
      return dbSkills.map((skill) => ({
        ...skill,
        itemsText: skill.items ? skill.items.join(", ") : "",
      }));
    }
    return [{ ...emptySkill }];
  });

  // 2. LOAD & HYDRATE (Watch for updates)
  useEffect(() => {
    const dbSkills = 
      resumeInfo?.resumeInfo?.skills || 
      resumeInfo?.skills || 
      [];

    if (dbSkills.length > 0) {
      // Create a clean version of local state to compare with DB
      // We only care if 'category' or 'items' array changed.
      const localVersion = skillsList.map(({ itemsText, ...rest }) => rest);
      
      // Compare! Only update local state if DB is TRULY different.
      // This prevents the "comma deletion" bug.
      if (JSON.stringify(localVersion) !== JSON.stringify(dbSkills)) {
        const formattedSkills = dbSkills.map((skill) => ({
          ...skill,
          itemsText: skill.items ? skill.items.join(", ") : "",
        }));
        setSkillsList(formattedSkills);
      }
    }
  }, [resumeInfo]);

  // 3. LIVE PREVIEW: Sync to Context
  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      resumeInfo: {
        ...prev.resumeInfo,
        skills: skillsList,
      },
    }));
  }, [skillsList]);

  // ------------------------------
  // Input Handling
  // ------------------------------
  const handleChange = (index, field, value) => {
    const updated = [...skillsList];
    if (field === "itemsText") {
      updated[index].itemsText = value;
      updated[index].items = value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    } else {
      updated[index][field] = value;
    }
    setSkillsList(updated);
  };

  const addSkillGroup = () => {
    setSkillsList((prev) => [...prev, { ...emptySkill }]);
  };

  const removeSkillGroup = () => {
    if (skillsList.length === 1) {
      toast("At least one skill section is required");
      return;
    }
    setSkillsList((prev) => prev.slice(0, -1));
  };

  // ------------------------------
  // SAVE
  // ------------------------------
  const handleSave = async () => {
    // Strip 'itemsText' for DB
    const skillsToSave = skillsList.map(({ itemsText, ...rest }) => rest);

    try {
      await updateResumeInfo({
        resumeId,
        field: "resumeInfo", 
        value: {
          ...resumeInfo?.resumeInfo,
          skills: skillsToSave, 
        },
      });
      toast.success("Skills saved permanently!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save skills.");
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-4 border-primary mt-4">
      <h2 className="font-bold text-lg text-gray-800 mb-1">Skills</h2>
      <p className="text-gray-500 mb-4">Add skills by categories.</p>

      {skillsList.map((skill, index) => (
        <div
          key={index}
          className="border p-4 rounded-lg mb-4 bg-gray-50 grid grid-cols-1 gap-4"
        >
          <div>
            <label className="text-xs font-medium">Category</label>
            <input
              type="text"
              value={skill.category}
              onChange={(e) => handleChange(index, "category", e.target.value)}
              className="w-full p-2 border rounded-md mt-1"
              placeholder="Frontend, Backend, Tools..."
            />
          </div>

          <div>
            <label className="text-xs font-medium">Skills (comma separated)</label>
            <input
              type="text"
              value={skill.itemsText || ""} 
              onChange={(e) => handleChange(index, "itemsText", e.target.value)}
              className="w-full p-2 border rounded-md mt-1"
              placeholder="React, Next.js, Tailwind, Git"
            />
          </div>
        </div>
      ))}

      <div className="flex gap-3 mt-4">
        <Button variant="outline" onClick={addSkillGroup}>
          + Add Skill Group
        </Button>
        <Button variant="outline" onClick={removeSkillGroup}>
          - Remove
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}

export default Skills;