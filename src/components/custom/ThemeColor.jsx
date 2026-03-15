import React, { useContext, useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";

import { ResumeInfoContext } from "@/features/resumeEditor/ResumeInfoContext";
import { useParams } from "react-router-dom";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

import { toast } from "sonner";

function ThemeColor() {

  // Professional resume colors
  const colors = [
    "#000000", // black
    "#1E3A8A", // dark blue
    "#334155", // slate
    "#065F46", // emerald
    "#7F1D1D", // burgundy
    "#374151", // charcoal
    "#0F172A", // navy
    "#4B5563", // gray
  ];

  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { id } = useParams();

  const updateResume = useMutation(api.resumes.updateResumeInfo);

  const [selectedColor, setSelectedColor] = useState(
    resumeInfo?.themeColor || "#000000"
  );

  // Sync when DB loads
  useEffect(() => {
    if (resumeInfo?.themeColor) {
      setSelectedColor(resumeInfo.themeColor);
    }
  }, [resumeInfo]);

  const onColorSelect = async (color) => {
    setSelectedColor(color);

    const updated = {
      ...resumeInfo,
      themeColor: color,
    };

    setResumeInfo(updated);

    try {
      await updateResume({
        resumeId: id,
        field: "resumeInfo",
        value: updated,
      });

      toast.success("Theme updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update theme");
    }
  };

  return (
    <Popover>

      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2">
          <LayoutGrid size={16} />
          Theme
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-48">

        <h2 className="text-sm font-semibold mb-3">
          Theme
        </h2>

        <div className="grid grid-cols-4 gap-3">

          {colors.map((color) => (

            <button
              key={color}
              onClick={() => onColorSelect(color)}
              className={`h-6 w-6 rounded-full border transition
              hover:scale-110
              ${selectedColor === color
                ? "ring-2 ring-offset-2 ring-black"
                : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
            />

          ))}

        </div>

      </PopoverContent>

    </Popover>
  );
}

export default ThemeColor;
