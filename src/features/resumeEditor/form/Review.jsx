import React, { useContext, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ResumeInfoContext } from "@/features/resumeEditor/ResumeInfoContext";
import { calculateResumeScore } from "@/lib/scoring";
import { Button } from "@/components/ui/button";
import ThemeSelector from "@/components/custom/ThemeColor";
import ScorePanel from "@/features/resumeEditor/ScorePanel";
import { SECTION_INDEX } from "@/features/resumeEditor/editorSections";
import { getShareUrl, shareOrCopy } from "@/lib/utils";
import { toast } from "sonner";

export default function Review({ onNavigateSection }) {
  const { resumeInfo, isGuest } = useContext(ResumeInfoContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const score = useMemo(() => calculateResumeScore(resumeInfo), [resumeInfo]);

  const share = async () => {
    if (isGuest) {
      toast.message("Sign in to get a public share link", {
        action: {
          label: "Sign in",
          onClick: () => navigate("/auth/sign-in"),
        },
      });
      return;
    }

    const url = getShareUrl(id);
    try {
      const result = await shareOrCopy({
        title: "My resume",
        text: "Check out my resume",
        url,
      });
      if (result === "copied") toast.success("Public link copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <div className="editor-panel space-y-6">
      <div>
        <h2 className="editor-panel-title">Review your resume</h2>
        <p className="editor-panel-desc">
          Check ATS readiness, close gaps, pick a template, then export or share.
        </p>
      </div>

      <ScorePanel score={score} onNavigateSection={onNavigateSection} />

      <div>
        <h3 className="text-sm font-semibold mb-3">Template & accent</h3>
        <ThemeSelector embedded />
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        <Button
          type="button"
          onClick={() => onNavigateSection?.(SECTION_INDEX.summary)}
        >
          Improve with AI
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(`/dashboard/resume/${id}/view`)}
        >
          Preview / Download PDF
        </Button>
        <Button type="button" variant="outline" onClick={share}>
          Share resume
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => onNavigateSection?.(SECTION_INDEX.basics)}
        >
          Edit basics
        </Button>
      </div>
    </div>
  );
}
