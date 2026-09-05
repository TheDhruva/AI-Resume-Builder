import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "@/features/resumeEditor/ResumeInfoContext";
import AiAssistMenu from "@/features/resumeEditor/AiAssistMenu";
import { useAI } from "@/lib/AIModel";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

const emptyProject = {
  name: "",
  description: "",
  technologies: [],
  technologiesText: "",
  role: "",
  projectUrl: "",
  githubUrl: "",
};

function Field({ label, value, onChange, placeholder = "" }) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1.5">{label}</label>
      <input
        className="field-input"
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

export default function Projects() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { generateProjectBullets } = useAI();
  const [busyIndex, setBusyIndex] = useState(null);

  const projects =
    resumeInfo?.projects?.length > 0
      ? resumeInfo.projects.map((p) => ({
          ...p,
          technologiesText:
            p.technologiesText ?? (p.technologies || []).join(", "),
        }))
      : [{ ...emptyProject }];

  const updateList = (next) => {
    setResumeInfo((prev) => ({
      ...prev,
      projects: next.map(({ technologiesText, ...rest }) => ({
        ...rest,
        technologies:
          rest.technologies ||
          String(technologiesText || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
      })),
    }));
  };

  const patch = (index, fields) => {
    const next = projects.map((p, i) => {
      if (i !== index) return p;
      const merged = { ...p, ...fields };
      if (fields.technologiesText !== undefined) {
        merged.technologies = fields.technologiesText
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }
      return merged;
    });
    updateList(next);
  };

  const generateBullets = async (index) => {
    const project = projects[index];
    if (!project.name?.trim() || !project.description?.trim()) {
      toast.error("Add a project name and description first.");
      return;
    }
    try {
      setBusyIndex(index);
      const html = await generateProjectBullets({
        name: project.name,
        description: project.description,
        technologies: project.technologies || [],
        role: project.role || "",
        targetJob: resumeInfo?.targetJob || null,
      });
      patch(index, { description: html });
      toast.success("Project bullets generated");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "AI generation failed");
    } finally {
      setBusyIndex(null);
    }
  };

  return (
    <div className="editor-panel">
      <h2 className="editor-panel-title">Projects</h2>
      <p className="editor-panel-desc">
        Especially valuable for students and career switchers.
      </p>

      <div className="mt-5 space-y-5">
        {projects.map((project, index) => (
          <div
            key={index}
            className="rounded-lg border border-border bg-secondary/30 p-4 sm:p-5 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Project name"
                value={project.name}
                onChange={(e) => patch(index, { name: e.target.value })}
              />
              <Field
                label="Your role"
                value={project.role}
                onChange={(e) => patch(index, { role: e.target.value })}
                placeholder="Lead developer"
              />
              <Field
                label="Technologies (comma separated)"
                value={project.technologiesText || ""}
                onChange={(e) =>
                  patch(index, { technologiesText: e.target.value })
                }
                placeholder="React, Node.js, PostgreSQL"
              />
              <Field
                label="Project URL"
                value={project.projectUrl}
                onChange={(e) => patch(index, { projectUrl: e.target.value })}
              />
              <Field
                label="GitHub URL"
                value={project.githubUrl}
                onChange={(e) => patch(index, { githubUrl: e.target.value })}
                className="sm:col-span-2"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <label className="text-sm font-medium">Description</label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={busyIndex === index}
                    aria-busy={busyIndex === index}
                    onClick={() => generateBullets(index)}
                    className="gap-1.5"
                  >
                    {busyIndex === index ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    Generate bullets
                  </Button>
                  <AiAssistMenu
                    section="projects"
                    content={project.description || ""}
                    context={{
                      name: project.name,
                      technologies: project.technologies,
                    }}
                    targetJob={resumeInfo?.targetJob}
                    allowedActions={[
                      "improve",
                      "rewrite",
                      "concise",
                      "technical",
                      "metrics",
                      "tailor",
                      "bullets",
                    ]}
                    onResult={(text) => patch(index, { description: text })}
                  />
                </div>
              </div>
              <Textarea
                className="min-h-[120px]"
                value={project.description || ""}
                onChange={(e) => patch(index, { description: e.target.value })}
                placeholder="What you built, your impact, and tech used..."
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => updateList([...projects, { ...emptyProject }])}
        >
          + Add project
        </Button>
        <Button
          type="button"
          variant="outline"
          className="text-destructive border-destructive/30"
          onClick={() => {
            if (projects.length <= 1) {
              toast("Keep at least one project card.");
              return;
            }
            updateList(projects.slice(0, -1));
          }}
        >
          − Remove last
        </Button>
      </div>
    </div>
  );
}
