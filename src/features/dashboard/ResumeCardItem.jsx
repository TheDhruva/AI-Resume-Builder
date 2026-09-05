import React, { useState } from "react";
import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Card from "@/components/layout/Card";
import { normalizeResumeInfo } from "@/lib/normalizeResume";
import {
  deleteGuestResume,
  duplicateGuestResume,
  renameGuestResume,
} from "@/lib/guestStorage";
import { getShareUrl, copyTextToClipboard } from "@/lib/utils";
import { toast } from "sonner";

function formatDate(ts) {
  if (!ts) return "";
  try {
    return new Date(ts).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function ResumeCardItem({ resume, isGuest = false, onGuestChange }) {
  const navigate = useNavigate();
  const deleteResume = useMutation(api.resumes.deleteResume);
  const renameResume = useMutation(api.resumes.renameResume);
  const duplicateResume = useMutation(api.resumes.duplicateResume);

  const [openAlert, setOpenAlert] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [title, setTitle] = useState(resume.title || "");

  const info = normalizeResumeInfo(resume.resumeInfo);
  const subtitle =
    info.targetJob?.title ||
    info.personalDetails?.jobTitle ||
    "No target role yet";

  const handleView = () => navigate(`/dashboard/resume/${resume.id}/view`);
  const handleEdit = () => navigate(`/dashboard/resume/${resume.id}`);
  const handleDownload = () =>
    navigate(`/dashboard/resume/${resume.id}/view?download=true`);

  const handleConfirmDelete = async () => {
    try {
      if (isGuest) {
        deleteGuestResume(resume.id);
        onGuestChange?.();
      } else {
        await deleteResume({ resumeId: resume.id });
      }
      setOpenAlert(false);
      toast.success("Resume deleted");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err?.message || "Delete failed");
    }
  };

  const handleRename = async () => {
    try {
      if (isGuest) {
        renameGuestResume(resume.id, title);
        onGuestChange?.();
      } else {
        await renameResume({ resumeId: resume.id, title });
      }
      setRenameOpen(false);
      toast.success("Renamed");
    } catch (err) {
      toast.error(err?.message || "Rename failed");
    }
  };

  const handleDuplicate = async () => {
    try {
      const newId = uuidv4();
      if (isGuest) {
        duplicateGuestResume(resume.id, newId);
        onGuestChange?.();
      } else {
        await duplicateResume({ resumeId: resume.id, newId });
      }
      toast.success("Resume duplicated");
      navigate(`/dashboard/resume/${newId}`);
    } catch (err) {
      toast.error(err?.message || "Duplicate failed");
    }
  };

  const handleShare = async () => {
    if (isGuest) {
      toast.message("Sign in to get a public share link", {
        action: {
          label: "Sign in",
          onClick: () => navigate("/auth/sign-in"),
        },
      });
      return;
    }
    try {
      await copyTextToClipboard(getShareUrl(resume.id));
      toast.success("Public link copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <button
        type="button"
        className="h-[160px] sm:h-[180px] flex flex-col items-center justify-center
        bg-secondary/50 border-b border-border hover:bg-secondary transition-colors px-4 text-center"
        onClick={handleEdit}
      >
        <FileText size={32} className="text-primary/80 mb-2" />
        <p className="text-xs text-muted-foreground line-clamp-2">{subtitle}</p>
      </button>

      <div className="flex items-start justify-between gap-2 p-4 bg-white">
        <div className="min-w-0">
          <h2 className="font-semibold truncate">{resume.title}</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Updated {formatDate(resume.updatedAt || resume.createdAt)}
            {isGuest ? " · Guest" : ""}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="shrink-0 min-h-[40px]">
              Options
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={handleView}>View</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownload}>Download</DropdownMenuItem>
            <DropdownMenuItem onClick={handleShare}>Share link</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setTitle(resume.title);
                setRenameOpen(true);
              }}
            >
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDuplicate}>Duplicate</DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setOpenAlert(true)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent className="responsive-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this resume?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the resume and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleConfirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="responsive-dialog">
          <DialogHeader>
            <DialogTitle>Rename resume</DialogTitle>
          </DialogHeader>
          <input
            className="field-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Resume title"
          />
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setRenameOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename} disabled={!title.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default ResumeCardItem;
