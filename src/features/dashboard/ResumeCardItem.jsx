import React, { useState } from "react";
import { Notebook } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
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

import { Button } from "@/components/ui/button";
import Card from "@/components/layout/Card";

function ResumeCardItem({ resume }) {
  const navigate = useNavigate();
  const deleteResume = useMutation(api.resumes.deleteResume);

  const [openAlert, setOpenAlert] = useState(false);

  const handleView = () => navigate(`/dashboard/resume/${resume.id}/view`);
  const handleEdit = () => navigate(`/dashboard/resume/${resume.id}`);
  const handleDownload = () =>
    navigate(`/dashboard/resume/${resume.id}/view?download=true`);

  const handleConfirmDelete = async () => {
    try {
      await deleteResume({ resumeId: resume.id });
      setOpenAlert(false);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-lg transition-all duration-200 group">

      {/* ---------- CARD PREVIEW ---------- */}
      <div
        className="h-[260px] flex items-center justify-center cursor-pointer
        bg-brand-bg border-b border-brand-border
        group-hover:bg-brand-primary/5 transition-colors"
        onClick={handleEdit}
      >
        <Notebook
          size={36}
          className="text-brand-primary/70 group-hover:text-brand-primary transition"
        />
      </div>

      {/* ---------- CARD FOOTER ---------- */}
      <div className="flex items-center justify-between p-4 bg-white">

        <h2 className="font-semibold text-brand-text truncate pr-2">
          {resume.title}
        </h2>

        <DropdownMenu>

          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Options
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">

            <DropdownMenuItem onClick={handleEdit}>
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleView}>
              View
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleDownload}>
              Download
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-error focus:text-error focus:bg-error/10"
              onClick={() => setOpenAlert(true)}
            >
              Delete
            </DropdownMenuItem>

          </DropdownMenuContent>

        </DropdownMenu>

      </div>

      {/* ---------- DELETE CONFIRM DIALOG ---------- */}
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>

        <AlertDialogContent>

          <AlertDialogHeader>

            <AlertDialogTitle>
              Delete this resume?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently delete the resume and cannot be undone.
            </AlertDialogDescription>

          </AlertDialogHeader>

          <AlertDialogFooter>

            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              className="bg-error text-white hover:bg-error/90"
              onClick={handleConfirmDelete}
            >
              Delete
            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>

      </AlertDialog>

    </Card>
  );
}

export default ResumeCardItem;
