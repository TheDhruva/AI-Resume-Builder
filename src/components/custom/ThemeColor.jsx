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
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF",
    "#33FFA1", "#FF7133", "#71FF33", "#7133FF", "#FF3371",
    "#33FF71", "#3371FF", "#A1FF33", "#33A1FF", "#FF5733",
    "#5733FF", "#33FF5A", "#5A33FF", "#FF335A", "#335AFF"
  ];

  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { id } = useParams();

  // Convex mutation
  const updateResume = useMutation(api.resumes.updateResumeInfo);

  const [selectedColor, setSelectedColor] = useState(
    resumeInfo?.resumeInfo?.themeColor || "#000000"
  );

  // Sync local state when resume loads from DB
  useEffect(() => {
    if (resumeInfo?.resumeInfo?.themeColor) {
      setSelectedColor(resumeInfo.resumeInfo.themeColor);
    }
  }, [resumeInfo]);

  const onColorSelect = async (color) => {
    setSelectedColor(color);

    // update global state (preview)
    setResumeInfo((prev) => ({
      ...prev,
      resumeInfo: {
        ...prev.resumeInfo,
        themeColor: color,
      },
    }));

    // update DB
    try {
      await updateResume({
        resumeId: id,
        field: "resumeInfo",
        value: {
          ...resumeInfo.resumeInfo,
          themeColor: color,
        },
      });

      toast.success("Theme color updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update theme color");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2">
          <LayoutGrid size={16} /> Theme
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        <h2 className="mb-2 text-sm font-bold">Select Theme Color</h2>
        <div className="grid grid-cols-5 gap-3">
          {colors.map((item) => (
            <div
              key={item}
              onClick={() => onColorSelect(item)}
              className={`h-5 w-5 rounded-full cursor-pointer border 
              hover:scale-110 transition
              ${selectedColor === item ? "border-black" : "border-gray-300"}`}
              style={{ background: item }}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ThemeColor;
