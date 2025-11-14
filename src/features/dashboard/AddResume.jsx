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
  const { user } = useUser(); // ✅ lowercase, correct Clerk hook

  const onCreate = async () => {
    if (loading) return;
    if (!resumeTitle.trim()) return alert("Enter a Resume Title");
    if (!user) return alert("Please sign in before creating a resume.");

    try {
      setLoading(true);
      const resumeId = uuidv4();

      await createResume({
        id: resumeId,
        title: resumeTitle,
        userId: user.id, // ✅ Correct usage — not a string literal
      });

      console.log("✅ Resume Created:", resumeId, resumeTitle);

      // ✅ Redirect to Edit Resume page
      navigate(`/dashboard/resume/${resumeId}`);

      // Reset dialog + state
      setOpenDialog(false);
      setResumeTitle("");
    } catch (err) {
      console.error("❌ Error creating resume:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <div
          onClick={() => setOpenDialog(true)}
          className="p-14 py-24 border flex items-center justify-center 
                     rounded-lg bg-secondary h-[280px] cursor-pointer 
                     border-dashed hover:shadow-md transition"
        >
          <PlusSquare size={32} />
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Resume</DialogTitle>
          <DialogDescription>
            <p className="mb-2">Add a title for your new resume.</p>
            <input
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
              className="w-full p-2 border rounded-md outline-none"
              placeholder="Ex. Full Stack Resume"
              disabled={loading}
            />
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={() => !loading && setOpenDialog(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button disabled={!resumeTitle || loading} onClick={onCreate}>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                Creating...
              </div>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddResume;
