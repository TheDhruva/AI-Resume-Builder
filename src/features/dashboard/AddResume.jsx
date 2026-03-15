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
import { useUser } from "@clerk/clerk-react";

function AddResume() {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const createResume = useMutation(api.resumes.createResume);
  const { user } = useUser();

  const onCreate = async () => {
    if (!resumeTitle.trim() || loading || !user) return;

    try {
      setLoading(true);

      const resumeId = uuidv4();

      await createResume({
        id: resumeId,
        title: resumeTitle,
        userId: user.id,
      });

      navigate(`/dashboard/resume/${resumeId}`);

      setOpenDialog(false);
      setResumeTitle("");
    } catch (err) {
      console.error("Error creating resume:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      
      {/* ---------- ADD CARD ---------- */}
      <DialogTrigger asChild>
        <div
          className="h-[280px] border border-dashed border-brand-border
          bg-white rounded-xl flex flex-col items-center justify-center
          cursor-pointer hover:shadow-md hover:border-brand-primary
          transition-all text-center"
        >

          <PlusSquare
            size={36}
            className="text-brand-primary mb-3"
          />

          <p className="font-medium">
            Create Resume
          </p>

          <p className="text-sm text-brand-muted">
            Start a new AI resume
          </p>

        </div>
      </DialogTrigger>

      {/* ---------- DIALOG ---------- */}
      <DialogContent className="sm:max-w-md">

        <DialogHeader>

          <DialogTitle>
            Create New Resume
          </DialogTitle>

          <DialogDescription className="text-brand-muted">
            Give your resume a title to get started.
          </DialogDescription>

        </DialogHeader>

        {/* INPUT */}
        <div className="mt-4">

          <input
            value={resumeTitle}
            onChange={(e) => setResumeTitle(e.target.value)}
            placeholder="Ex. Full Stack Developer Resume"
            disabled={loading}
            className="w-full p-3 rounded-lg border border-brand-border
            focus:outline-none focus:ring-2 focus:ring-brand-primary
            focus:border-brand-primary transition"
          />

        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">

          <Button
            variant="ghost"
            onClick={() => setOpenDialog(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            disabled={!resumeTitle.trim() || loading}
            onClick={onCreate}
          >

            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                Creating...
              </span>
            ) : (
              "Create Resume"
            )}

          </Button>

        </div>

      </DialogContent>
    </Dialog>
  );
}

export default AddResume;
