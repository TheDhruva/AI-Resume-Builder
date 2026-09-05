import React, { useContext, useState } from "react";
import { ResumeInfoContext } from "@/features/resumeEditor/ResumeInfoContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAI } from "@/lib/AIModel";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function TargetJob() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const targetJob = resumeInfo?.targetJob || { title: "", description: "", insights: null };
  const { analyzeJobDescription } = useAI();
  const [loading, setLoading] = useState(false);

  const update = (patch) => {
    setResumeInfo((prev) => ({
      ...prev,
      targetJob: {
        ...prev.targetJob,
        ...patch,
      },
      // Keep personal headline in sync when empty or matching previous title
      personalDetails: {
        ...prev.personalDetails,
        jobTitle:
          patch.title !== undefined &&
          (!prev.personalDetails?.jobTitle ||
            prev.personalDetails.jobTitle === prev.targetJob?.title)
            ? patch.title
            : prev.personalDetails?.jobTitle,
      },
    }));
  };

  const analyze = async () => {
    if (!targetJob.description?.trim()) {
      toast.error("Paste a job description first.");
      return;
    }

    try {
      setLoading(true);
      const insights = await analyzeJobDescription({
        title: targetJob.title || resumeInfo?.personalDetails?.jobTitle || "Role",
        description: targetJob.description,
      });
      update({ insights });
      toast.success("Job description analyzed");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Analysis failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const insights = targetJob.insights;
  const resumeSkills = new Set(
    (resumeInfo?.skills || [])
      .flatMap((s) => s.items || [])
      .map((s) => s.toLowerCase())
  );

  const missingRequired = (insights?.requiredSkills || []).filter(
    (s) => ![...resumeSkills].some((r) => r.includes(s.toLowerCase()) || s.toLowerCase().includes(r))
  );

  return (
    <div className="editor-panel">
      <h2 className="editor-panel-title">Target job</h2>
      <p className="editor-panel-desc">
        Paste the job description so AI can tailor your resume and score keyword match.
      </p>

      <div className="space-y-4 mt-5">
        <div>
          <label htmlFor="target-title" className="text-sm font-medium block mb-1.5">
            Job title
          </label>
          <input
            id="target-title"
            className="field-input"
            value={targetJob.title || ""}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="Software Engineer"
          />
        </div>

        <div>
          <label htmlFor="target-jd" className="text-sm font-medium block mb-1.5">
            Job description
          </label>
          <Textarea
            id="target-jd"
            className="min-h-[180px]"
            value={targetJob.description || ""}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="Paste the full job description here..."
          />
        </div>

        <Button
          type="button"
          onClick={analyze}
          disabled={loading}
          aria-busy={loading}
          className="gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Analyze job with AI
        </Button>
      </div>

      {insights && (
        <div className="mt-6 space-y-4">
          <InsightChips title="Required skills" items={insights.requiredSkills} />
          <InsightChips title="Preferred skills" items={insights.preferredSkills} />
          <InsightChips title="Keywords" items={insights.keywords} />
          {missingRequired.length > 0 && (
            <InsightChips
              title="Missing from resume"
              items={missingRequired}
              variant="warn"
            />
          )}
          {insights.responsibilities?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Responsibilities</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                {insights.responsibilities.slice(0, 8).map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InsightChips({ title, items, variant = "default" }) {
  if (!items?.length) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium border ${
              variant === "warn"
                ? "bg-amber-50 text-amber-900 border-amber-200"
                : "bg-secondary text-foreground border-border"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
