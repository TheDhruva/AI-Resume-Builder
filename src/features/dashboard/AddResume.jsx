import React, { useState } from "react";
import { PlusSquare, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { v4 as uuidv4 } from "uuid";
import { api } from "../../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSessionMode } from "@/features/auth/useSessionMode";
import { createGuestResume } from "@/lib/guestStorage";

function AddResume({ onGuestChange }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const createResume = useMutation(api.resumes.createResume);
  const { isGuest } = useSessionMode();

  const onCreate = async () => {
    if (!resumeTitle.trim() || loading) return;

    try {
      setLoading(true);
      let resumeId;

      if (isGuest) {
        resumeId = createGuestResume(resumeTitle.trim()).id;
        onGuestChange?.();
      } else {
        resumeId = uuidv4();
        await createResume({
          id: resumeId,
          title: resumeTitle.trim(),
        });
      }

      setOpenDialog(false);
      setResumeTitle("");
      navigate(`/dashboard/resume/${resumeId}`);
    } catch (err) {
      console.error("Error creating resume:", err);
      toast.error(err?.message || "Could not create resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="h-[240px] w-full border border-dashed border-border
          bg-white rounded-lg flex flex-col items-center justify-center
          cursor-pointer hover:border-primary/50 hover:bg-secondary/40
          transition-all text-center px-4 min-h-[44px]"
        >
          <PlusSquare size={32} className="text-primary mb-3" />
          <p className="font-medium">Create Resume</p>
          <p className="text-sm text-muted-foreground mt-1">
            Start a job-targeted resume
          </p>
        </button>
      </DialogTrigger>

      <DialogContent className="responsive-dialog">
        <DialogHeader>
          <DialogTitle>Create new resume</DialogTitle>
          <DialogDescription>
            Give it a clear title — usually the role you are applying for.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2">
          <label
            htmlFor="resume-title"
            className="text-sm font-medium block mb-1.5"
          >
            Title
          </label>
          <input
            id="resume-title"
            value={resumeTitle}
            onChange={(e) => setResumeTitle(e.target.value)}
            placeholder="Ex. Full Stack Developer — Acme"
            disabled={loading}
            className="field-input"
            onKeyDown={(e) => {
              if (e.key === "Enter") onCreate();
            }}
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-6">
          <Button
            variant="ghost"
            onClick={() => setOpenDialog(false)}
            disabled={loading}
            className="min-h-[44px]"
          >
            Cancel
          </Button>
          <Button
            disabled={!resumeTitle.trim() || loading}
            onClick={onCreate}
            className="min-h-[44px]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                Creating...
              </span>
            ) : (
              "Create resume"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddResume;
