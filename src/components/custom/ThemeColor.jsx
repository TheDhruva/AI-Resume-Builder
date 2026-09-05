import React, { useContext, useState } from "react";
import { ResumeInfoContext } from "@/features/resumeEditor/ResumeInfoContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LayoutGrid } from "lucide-react";

const ACCENTS = [
  { name: "Navy", value: "#1E3A8A" },
  { name: "Charcoal", value: "#374151" },
  { name: "Black", value: "#111827" },
  { name: "Emerald", value: "#065F46" },
  { name: "Burgundy", value: "#7F1D1D" },
  { name: "Slate", value: "#334155" },
];

function MiniPreview({ layout, accent, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left rounded-lg border p-3 transition focus-visible:ring-2 focus-visible:ring-ring ${
        selected
          ? "border-primary ring-1 ring-primary"
          : "border-border hover:border-primary/40"
      }`}
      aria-pressed={selected}
    >
      <div
        className="h-24 rounded-md bg-white border border-border p-2 overflow-hidden"
        style={{ borderTop: `4px solid ${accent}` }}
      >
        <div
          className={`h-2 w-16 mb-2 rounded-sm ${
            layout === "modern" ? "" : "mx-auto"
          }`}
          style={{ backgroundColor: accent }}
        />
        <div className="space-y-1">
          <div className="h-1.5 bg-neutral-200 rounded w-3/4 mx-auto" />
          <div className="h-1 bg-neutral-100 rounded w-full" />
          <div className="h-1 bg-neutral-100 rounded w-5/6" />
        </div>
      </div>
      <p className="mt-2 text-sm font-medium">
        {layout === "classic" ? "ATS Classic" : "Modern"}
      </p>
      <p className="text-xs text-muted-foreground">
        {layout === "classic"
          ? "Single column, ATS-friendly"
          : "Stronger hierarchy, still readable"}
      </p>
    </button>
  );
}

export default function ThemeSelector({ embedded = false }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const theme = resumeInfo?.theme || { layout: "classic", accent: "#1E3A8A" };
  const [open, setOpen] = useState(false);

  const setTheme = (patch) => {
    setResumeInfo((prev) => ({
      ...prev,
      theme: {
        ...(prev.theme || { layout: "classic", accent: "#1E3A8A" }),
        ...patch,
      },
      themeColor: patch.accent || prev.theme?.accent || prev.themeColor,
    }));
  };

  const body = (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold mb-3">Template</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <MiniPreview
            layout="classic"
            accent={theme.accent}
            selected={theme.layout !== "modern"}
            onSelect={() => setTheme({ layout: "classic" })}
          />
          <MiniPreview
            layout="modern"
            accent={theme.accent}
            selected={theme.layout === "modern"}
            onSelect={() => setTheme({ layout: "modern" })}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">Accent</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {ACCENTS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => setTheme({ accent: color.value })}
              className={`flex flex-col items-center gap-1.5 rounded-md p-2 border focus-visible:ring-2 focus-visible:ring-ring ${
                theme.accent === color.value
                  ? "border-primary ring-1 ring-primary"
                  : "border-border"
              }`}
              aria-label={`Accent ${color.name}`}
              aria-pressed={theme.accent === color.value}
            >
              <span
                className="h-6 w-6 rounded-full border border-black/10"
                style={{ backgroundColor: color.value }}
              />
              <span className="text-[10px] text-muted-foreground">
                {color.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (embedded) return body;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="gap-2">
          <LayoutGrid size={16} />
          Theme
        </Button>
      </DialogTrigger>
      <DialogContent className="responsive-dialog">
        <DialogHeader>
          <DialogTitle>Template & accent</DialogTitle>
        </DialogHeader>
        {body}
      </DialogContent>
    </Dialog>
  );
}
