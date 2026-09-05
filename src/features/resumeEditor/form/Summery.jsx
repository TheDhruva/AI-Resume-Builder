import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "@/features/resumeEditor/ResumeInfoContext";
import AiAssistMenu from "@/features/resumeEditor/AiAssistMenu";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";
import { useAI } from "@/lib/AIModel";

function buildResumeFacts(info) {
  const lines = [];
  const p = info?.personalDetails || {};
  if (p.jobTitle) lines.push(`Headline: ${p.jobTitle}`);

  (info?.experience || []).forEach((e, i) => {
    if (!e.title && !e.companyName) return;
    lines.push(
      `Experience ${i + 1}: ${e.title || "Role"} at ${e.companyName || "Company"}`
    );
    if (e.workSummary) {
      lines.push(
        String(e.workSummary)
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 400)
      );
    }
  });

  (info?.projects || []).forEach((pr, i) => {
    if (!pr.name && !pr.description) return;
    lines.push(
      `Project ${i + 1}: ${pr.name || "Project"} (${(pr.technologies || []).join(", ")})`
    );
    if (pr.description) {
      lines.push(
        String(pr.description)
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 300)
      );
    }
  });

  (info?.skills || []).forEach((s) => {
    if ((s.items || []).length) {
      lines.push(`Skills (${s.category || "General"}): ${s.items.join(", ")}`);
    }
  });

  (info?.education || []).forEach((ed) => {
    if (ed.universityName || ed.degree) {
      lines.push(
        `Education: ${[ed.degree, ed.major, ed.universityName].filter(Boolean).join(" — ")}`
      );
    }
  });

  return lines.join("\n") || "Limited evidence provided.";
}

export default function Summery() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const summary = resumeInfo?.summary || "";
  const { generateSummaries } = useAI();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);

  const setSummary = (value) => {
    setResumeInfo((prev) => ({ ...prev, summary: value }));
  };

  const generate = async () => {
    const jobTitle =
      resumeInfo?.targetJob?.title ||
      resumeInfo?.personalDetails?.jobTitle ||
      "Professional";

    try {
      setLoading(true);
      const result = await generateSummaries({
        jobTitle,
        targetJob: resumeInfo?.targetJob || null,
        resumeFacts: buildResumeFacts(resumeInfo),
      });
      setSuggestions(result);
      toast.success("AI summaries ready");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "AI failed to generate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-panel">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="editor-panel-title">AI Summary</h2>
          <p className="editor-panel-desc">
            Generate a concise summary from your experience, projects, skills,
            and target job — without inventing unsupported claims.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={generate}
            disabled={loading}
            aria-busy={loading}
            className="gap-1.5"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Generate with AI
          </Button>
          <AiAssistMenu
            section="summary"
            content={summary}
            targetJob={resumeInfo?.targetJob}
            context={{ facts: buildResumeFacts(resumeInfo).slice(0, 1500) }}
            onResult={setSummary}
            allowedActions={[
              "improve",
              "rewrite",
              "concise",
              "professional",
              "technical",
              "tailor",
            ]}
          />
        </div>
      </div>

      <Textarea
        className="mt-5 min-h-[140px]"
        placeholder="A short professional summary grounded in your real experience..."
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <p className="mt-2 text-xs text-muted-foreground text-right">
        {summary.length} chars
      </p>

      {suggestions && (
        <div className="mt-6 space-y-3">
          <h3 className="font-semibold text-sm">AI suggestions</h3>
          {Object.entries(suggestions).map(([level, text]) => (
            <button
              key={level}
              type="button"
              onClick={() => setSummary(String(text))}
              className="w-full text-left p-3 border border-border rounded-lg hover:bg-secondary/60 transition focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="text-xs font-semibold text-primary">{level}</span>
              <p className="text-sm text-foreground mt-1">{String(text)}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
