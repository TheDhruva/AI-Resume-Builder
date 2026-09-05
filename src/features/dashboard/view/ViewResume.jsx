import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import ResumeDocument from "../../resumeEditor/ResumeDocument";
import { ResumeInfoContext } from "../../resumeEditor/ResumeInfoContext";
import { normalizeResumeInfo } from "@/lib/normalizeResume";
import { getShareUrl, shareOrCopy } from "@/lib/utils";
import { toast } from "sonner";
import { useSessionMode } from "@/features/auth/useSessionMode";
import { getGuestResume } from "@/lib/guestStorage";

function ViewResume() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { isGuest, isSignedIn } = useSessionMode();
  const { isAuthenticated, isLoading } = useConvexAuth();

  const resumeData = useQuery(
    api.resumes.getResumeById,
    id && isAuthenticated && !isGuest ? { resumeId: id } : "skip"
  );

  const [resumeInfo, setResumeInfo] = useState(null);
  const [guestTitle, setGuestTitle] = useState("");
  const [guestMissing, setGuestMissing] = useState(false);

  useEffect(() => {
    if (isGuest && id) {
      const guest = getGuestResume(id);
      if (guest) {
        setResumeInfo(normalizeResumeInfo(guest.resumeInfo));
        setGuestTitle(guest.title || "Resume");
        setGuestMissing(false);
      } else {
        setGuestMissing(true);
      }
      return;
    }

    if (resumeData?.resumeInfo) {
      setResumeInfo(normalizeResumeInfo(resumeData.resumeInfo));
    }
  }, [resumeData, isGuest, id]);

  useEffect(() => {
    if (resumeInfo && searchParams.get("download") === "true") {
      const t = setTimeout(() => window.print(), 400);
      return () => clearTimeout(t);
    }
  }, [resumeInfo, searchParams]);

  const handleDownload = () => window.print();

  const handleShare = async () => {
    if (isGuest) {
      toast.message("Sign in to create a public share link", {
        action: {
          label: "Sign in",
          onClick: () => {
            window.location.href = "/auth/sign-in";
          },
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
      if (result === "copied") toast.success("Public resume link copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  if (isSignedIn && (isLoading || resumeData === undefined)) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Loading resume...
      </div>
    );
  }

  if ((isGuest && guestMissing) || (!isGuest && resumeData === null)) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold mb-2">Resume not found</h2>
        <p className="text-muted-foreground">
          The resume does not exist or you lack access.
        </p>
        <Link to="/dashboard" className="text-primary text-sm mt-4 inline-block">
          Back to dashboard
        </Link>
      </div>
    );
  }

  if (!resumeInfo) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Preparing resume...
      </div>
    );
  }

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo, isGuest }}>
      <div className="min-h-screen">
        <div className="no-print pb-8 print:hidden">
          <div className="max-w-2xl mx-auto text-center mt-6 sm:mt-10 px-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {isGuest ? guestTitle || "Your resume" : "Your resume is ready"}
            </h2>
            <p className="text-muted-foreground mt-3">
              {isGuest
                ? "Download as PDF anytime. Sign in to get a public share link."
                : "Download as PDF or share a public link with recruiters."}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
              <Button onClick={handleDownload} className="rounded-full">
                Download PDF
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                className="rounded-full"
              >
                {isGuest ? "Share (sign in)" : "Copy share link"}
              </Button>
              <Button variant="ghost" asChild className="rounded-full">
                <Link to={`/dashboard/resume/${id}`}>Keep editing</Link>
              </Button>
            </div>
          </div>
        </div>

        <div id="print-area" className="print-area mx-auto">
          <ResumeDocument resumeInfo={resumeInfo} mode="final" />
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default ViewResume;
