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

function Skills({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const updateResumeInfo = useMutation(api.resumes.updateResumeInfo);
  const { id: resumeId } = useParams();

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

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (hydrated) return;

    const dbSkills =
      resumeInfo?.resumeInfo?.skills ||
      resumeInfo?.skills ||
      [];

    if (dbSkills.length > 0) {
      const formattedSkills = dbSkills.map((skill) => ({
        ...skill,
        itemsText: skill.items ? skill.items.join(", ") : "",
      }));

      setSkillsList(formattedSkills);
      setHydrated(true);
    }
  }, [resumeInfo, hydrated]);

  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      resumeInfo: {
        ...prev.resumeInfo,
        skills: skillsList,
      },
    }));
  }, [skillsList, setResumeInfo]);

  const handleChange = (index, field, value) => {
    enabledNext && enabledNext(false);

    setSkillsList((prev) => {
      const updated = [...prev];

      if (field === "itemsText") {
        updated[index].itemsText = value;
        updated[index].items = value
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);
      } else {
        updated[index][field] = value;
      }

      return updated;
    });
  };

  const addSkillGroup = () => {
    enabledNext && enabledNext(false);
    setSkillsList((prev) => [...prev, { ...emptySkill }]);
  };

  const removeSkillGroup = () => {
    enabledNext && enabledNext(false);

    if (skillsList.length === 1) {
      toast("At least one skill section is required");
      return;
    }

    setSkillsList((prev) => prev.slice(0, -1));
  };

  const handleSave = async () => {
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
      enabledNext && enabledNext(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save skills.");
    }
  };

  return (
    <div className="p-6 shadow-sm rounded-xl border border-gray-200 border-t-4 border-t-primary bg-white mt-4">
      <h2 className="font-bold text-xl text-gray-900 mb-1">Skills</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Add skills by categories.
      </p>

      {skillsList.map((skill, index) => (
        <div
          key={index}
          className="border border-gray-100 p-5 rounded-lg mb-5 bg-gray-50/50 grid grid-cols-1 gap-4"
        >
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Category
            </label>

            <input
              type="text"
              value={skill.category}
              onChange={(e) =>
                handleChange(index, "category", e.target.value)
              }
              className="w-full p-2.5 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
              placeholder="Frontend, Backend, Tools..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Skills (comma separated)
            </label>

            <input
              type="text"
              value={skill.itemsText || ""}
              onChange={(e) =>
                handleChange(index, "itemsText", e.target.value)
              }
              className="w-full p-2.5 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
              placeholder="React, Next.js, Tailwind, Git"
            />
          </div>
        </div>
      ))}

      <div className="flex justify-between mt-6">
        <div className="flex gap-2">
          <Button variant="outline" onClick={addSkillGroup}>
            + Add Skill Group
          </Button>

          <Button
            variant="outline"
            onClick={removeSkillGroup}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
          >
            - Remove
          </Button>
        </div>

        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}

export default Skills;
