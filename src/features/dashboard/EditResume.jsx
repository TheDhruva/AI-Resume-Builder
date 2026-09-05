import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ResumePreview from "@/features/resumeEditor/ResumePreview";
import FormSection from "@/features/resumeEditor/FormSection";
import { EDITOR_SECTIONS } from "@/features/resumeEditor/editorSections";
import { ResumeInfoContext } from "@/features/resumeEditor/ResumeInfoContext";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  createEmptyResumeInfo,
  normalizeResumeInfo,
} from "@/lib/normalizeResume";
import { useResumeAutosave } from "@/features/resumeEditor/useResumeAutosave";
import ScorePanel from "@/features/resumeEditor/ScorePanel";
import { calculateResumeScore } from "@/lib/scoring";
import { useSessionMode } from "@/features/auth/useSessionMode";
import { getGuestResume } from "@/lib/guestStorage";

export default function EditResume() {
  const { id } = useParams();
  const { isGuest, isSignedIn } = useSessionMode();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobilePane, setMobilePane] = useState("edit");
  const [resumeInfo, setResumeInfo] = useState(createEmptyResumeInfo());
  const [resumeMeta, setResumeMeta] = useState({ id: "", title: "" });
  const [hydrated, setHydrated] = useState(false);
  const [guestMissing, setGuestMissing] = useState(false);

  const fetchedResume = useQuery(
    api.resumes.getResumeById,
    id && isAuthenticated && !isGuest ? { resumeId: id } : "skip"
  );

  useEffect(() => {
    if (isGuest && id) {
      const guest = getGuestResume(id);
      if (guest) {
        setResumeInfo(normalizeResumeInfo(guest.resumeInfo));
        setResumeMeta({ id: guest.id, title: guest.title });
        setGuestMissing(false);
      } else {
        setGuestMissing(true);
      }
      setHydrated(true);
      return;
    }

    if (fetchedResume?.resumeInfo) {
      setResumeInfo(normalizeResumeInfo(fetchedResume.resumeInfo));
      setResumeMeta({
        id: fetchedResume.id,
        title: fetchedResume.title,
      });
      setHydrated(true);
    } else if (fetchedResume === null) {
      setHydrated(true);
    }
  }, [fetchedResume, isGuest, id]);

  const { status, saveNow } = useResumeAutosave(
    id,
    resumeInfo,
    hydrated && (isGuest ? !guestMissing : Boolean(fetchedResume)),
    { isGuest }
  );

  const score = useMemo(() => calculateResumeScore(resumeInfo), [resumeInfo]);

  if (isSignedIn && (authLoading || fetchedResume === undefined)) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Loading resume editor...
      </div>
    );
  }

  if (isGuest && guestMissing) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold mb-2">Resume not found</h2>
        <p className="text-muted-foreground">
          This guest resume is not on this device.
        </p>
      </div>
    );
  }

  if (!isGuest && fetchedResume === null) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold mb-2">Resume not found</h2>
        <p className="text-muted-foreground">
          This resume does not exist or you do not have access.
        </p>
      </div>
    );
  }

  return (
    <ResumeInfoContext.Provider
      value={{ resumeInfo, setResumeInfo, resumeMeta, isGuest }}
    >
      <div className="editor-shell pb-24 sm:pb-8">
        <div className="lg:hidden sticky top-[57px] z-30 -mx-4 px-4 py-2 bg-[var(--app-bg)]/95 backdrop-blur border-b border-border mb-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "edit", label: "Edit" },
              { id: "preview", label: "Preview" },
              { id: "score", label: "Score" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMobilePane(tab.id)}
                className={`rounded-md py-2.5 text-sm font-medium border min-h-[44px] ${
                  mobilePane === tab.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white border-border"
                }`}
              >
                {tab.label}
                {tab.id === "score" && score.ready ? ` ${score.total}` : ""}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[180px_minmax(0,1fr)_minmax(320px,1fr)] xl:grid-cols-[200px_minmax(0,1.1fr)_minmax(380px,0.95fr)] gap-6 lg:gap-8">
          <aside className="hidden lg:block">
            <nav
              className="sticky top-24 space-y-1"
              aria-label="Resume sections"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 px-2">
                Sections
              </p>
              {EDITOR_SECTIONS.map((section, index) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`w-full text-left rounded-md px-3 py-2 text-sm transition focus-visible:ring-2 focus-visible:ring-ring ${
                    activeIndex === index
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary text-foreground"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </aside>

          <section
            className={`${
              mobilePane === "edit" ? "block" : "hidden"
            } lg:block min-w-0`}
          >
            <FormSection
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              saveStatus={status}
              onSaveNow={saveNow}
              resumeInfo={resumeInfo}
            />
          </section>

          <section
            className={`${
              mobilePane === "preview" ? "block" : "hidden"
            } lg:block min-w-0`}
          >
            <div className="lg:sticky lg:top-24 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 hidden lg:block">
                Live preview
              </p>
              <ResumePreview mode="edit" />
            </div>
          </section>
        </div>

        <div
          className={`${
            mobilePane === "score" ? "block" : "hidden"
          } lg:hidden mt-2`}
        >
          <ScorePanel
            score={score}
            onNavigateSection={(i) => {
              setActiveIndex(i);
              setMobilePane("edit");
            }}
          />
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
}
