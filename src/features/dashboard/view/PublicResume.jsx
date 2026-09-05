import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import ResumeDocument from "@/features/resumeEditor/ResumeDocument";
import { normalizeResumeInfo } from "@/lib/normalizeResume";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { copyTextToClipboard } from "@/lib/utils";

/** Public, read-only resume share — no auth required. */
export default function PublicResume() {
  const { id } = useParams();
  const data = useQuery(
    api.resumes.getPublicResumeById,
    id ? { resumeId: id } : "skip"
  );

  const handleDownload = () => window.print();

  const handleCopy = async () => {
    try {
      await copyTextToClipboard(window.location.href);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  if (data === undefined) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Loading resume...
      </div>
    );
  }

  if (data === null) {
    return (
      <div className="flex items-center justify-center px-4 py-20">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Resume not found</h1>
          <p className="text-muted-foreground mt-2">
            This public link is invalid or the resume was deleted.
          </p>
        </div>
      </div>
    );
  }

  const resumeInfo = normalizeResumeInfo(data.resumeInfo);

  return (
    <div>
      <div className="no-print print:hidden border-b border-border bg-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">{data.title}</p>
            <p className="text-xs text-muted-foreground">Public resume</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
              Copy link
            </Button>
            <Button type="button" size="sm" onClick={handleDownload}>
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      <main className="px-3 sm:px-6 py-8 overflow-x-auto">
        <div id="print-area" className="print-area mx-auto">
          <ResumeDocument resumeInfo={resumeInfo} mode="final" />
        </div>
      </main>
    </div>
  );
}
