import React, { useState } from "react";
import { Notebook } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api"; // adjust path

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

function ResumeCardItem({ resume, refreshData }) {
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
      refreshData && refreshData();
      setOpenAlert(false);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="border border-primary rounded-lg p-4 hover:shadow-lg relative">

      <div
        className="p-14 bg-secondary flex items-center justify-center h-[280px] rounded-lg cursor-pointer hover:scale-105 transition-all"
        onClick={handleEdit}
      >
        <Notebook size={32} />
      </div>

      <h2 className="text-center my-1 font-semibold">{resume.title}</h2>

      <div className="flex justify-center mt-2">

        <DropdownMenu>
          <DropdownMenuTrigger className="px-3 py-1 border rounded">
            Open
          </DropdownMenuTrigger>

          <DropdownMenuContent>

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
              className="text-red-500"
              onClick={() => setOpenAlert(true)}
            >
              Delete
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>

        {/* Actual working delete dialog */}
        <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete resume?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <AlertDialogAction
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={handleConfirmDelete}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  );
}

export default ResumeCardItem;
