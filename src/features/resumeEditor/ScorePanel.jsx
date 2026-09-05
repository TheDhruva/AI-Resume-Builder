import React from "react";
import { Button } from "@/components/ui/button";
import { SECTION_INDEX } from "@/features/resumeEditor/editorSections";

export default function ScorePanel({ score, onNavigateSection, compact = false }) {
  if (!score) return null;

  const cats = [
    { key: "keywordMatch", label: "Keyword match" },
    { key: "skillsRelevance", label: "Skills relevance" },
    { key: "completeness", label: "Completeness" },
    { key: "experienceQuality", label: "Experience quality" },
    { key: "jdAlignment", label: "JD alignment" },
    { key: "structure", label: "Structure" },
    { key: "contact", label: "Contact" },
    { key: "readability", label: "Readability" },
  ];

  return (
    <div className={compact ? "space-y-4" : "space-y-5"}>
      <div className="rounded-xl border border-border bg-white p-5 text-center sm:text-left">
        <p className="text-sm text-muted-foreground">ATS Match</p>
        {score.ready ? (
          <p className="text-4xl font-bold tracking-tight mt-1">
            {score.total}
            <span className="text-lg font-medium text-muted-foreground">
              {" "}
              / 100
            </span>
          </p>
        ) : (
          <div className="mt-2">
            <p className="text-xl font-semibold text-foreground">
              Not enough data yet
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Add contact details plus experience, projects, or a summary to
              unlock a meaningful ATS score.
            </p>
          </div>
        )}
        {score.ready && !score.hasJd && (
          <p className="text-xs text-amber-800 mt-2">
            Add a job description for full keyword and JD alignment scoring.
          </p>
        )}
      </div>

      {score.ready && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cats.map(({ key, label }) => {
            const value = score.categories?.[key];
            if (value === null || value === undefined) return null;
            return (
              <div
                key={key}
                className="rounded-lg border border-border bg-secondary/40 px-3 py-2.5"
              >
                <div className="flex justify-between text-sm">
                  <span>{label}</span>
                  <span className="font-semibold">{value}</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.min(100, value)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {score.missingKeywords?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">Missing keywords</h3>
          <div className="flex flex-wrap gap-2">
            {score.missingKeywords.slice(0, 10).map((kw) => (
              <span
                key={kw}
                className="text-xs px-2 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-900"
              >
                {kw}
              </span>
            ))}
          </div>
          {onNavigateSection && (
            <Button
              type="button"
              variant="link"
              className="px-0 mt-1"
              onClick={() => onNavigateSection(SECTION_INDEX.skills)}
            >
              Review skills →
            </Button>
          )}
        </div>
      )}

      {score.weakBullets?.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">Weak bullets</h3>
          <ul className="space-y-2">
            {score.weakBullets.map((b, i) => (
              <li
                key={i}
                className="text-sm text-muted-foreground border border-border rounded-md p-2"
              >
                “{b}”
              </li>
            ))}
          </ul>
          {onNavigateSection && (
            <Button
              type="button"
              variant="link"
              className="px-0 mt-1"
              onClick={() => onNavigateSection(SECTION_INDEX.experience)}
            >
              Improve experience →
            </Button>
          )}
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold mb-2">Checklist</h3>
        <ul className="space-y-2">
          {score.recommendations.map((rec, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span aria-hidden>{rec.type === "ok" ? "✓" : "⚠"}</span>
              <span
                className={
                  rec.type === "ok" ? "text-foreground" : "text-amber-900"
                }
              >
                {rec.message}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
