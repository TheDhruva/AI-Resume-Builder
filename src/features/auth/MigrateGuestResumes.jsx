import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { api } from "../../../convex/_generated/api";
import {
  hasPendingGuestMigration,
  listGuestResumes,
  markGuestMigrationDone,
} from "@/lib/guestStorage";
import { sanitizeResumeInfoForSave } from "@/lib/normalizeResume";
import { toast } from "sonner";

/** Module lock survives React StrictMode remounts. */
let migrationLock = null;

/**
 * After Clerk sign-in, push any local guest resumes into Convex once.
 */
export default function MigrateGuestResumes() {
  const { isSignedIn, isLoaded } = useUser();
  const createResume = useMutation(api.resumes.createResume);
  const updateResumeInfo = useMutation(api.resumes.updateResumeInfo);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (!hasPendingGuestMigration()) return;
    if (migrationLock) {
      setBusy(true);
      migrationLock.finally(() => setBusy(false));
      return;
    }

    setBusy(true);

    migrationLock = (async () => {
      const guests = listGuestResumes();
      for (const resume of guests) {
        await createResume({
          id: resume.id,
          title: resume.title || "My Resume",
        });
        await updateResumeInfo({
          resumeId: resume.id,
          resumeInfo: sanitizeResumeInfoForSave(resume.resumeInfo),
        });
      }
      markGuestMigrationDone();
      window.dispatchEvent(new Event("arb-guest-change"));
      return guests.length;
    })()
      .then((count) => {
        if (count > 0) {
          toast.success(
            count === 1
              ? "Guest resume saved to your account"
              : `${count} guest resumes saved to your account`
          );
        }
      })
      .catch((err) => {
        console.error("Guest migration failed:", err);
        toast.error(
          "Could not save guest resumes. Refresh the dashboard to retry."
        );
      })
      .finally(() => {
        migrationLock = null;
        setBusy(false);
      });
  }, [isLoaded, isSignedIn, createResume, updateResumeInfo]);

  if (!busy) return null;

  return (
    <div className="mb-4 rounded-lg border border-border bg-white px-4 py-3 text-sm text-muted-foreground">
      Saving your guest resumes to your account…
    </div>
  );
}
