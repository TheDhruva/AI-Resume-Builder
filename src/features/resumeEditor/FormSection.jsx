import React from "react";
import PersonalDetail from "./form/PersonalDetail";
import TargetJob from "./form/TargetJob";
import Summery from "./form/Summery";
import Experience from "./form/Experience";
import Projects from "./form/Projects";
import Education from "./form/Education";
import Skills from "./form/Skills";
import Review from "./form/Review";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ChevronDown, Home } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeSelector from "@/components/custom/ThemeColor";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EDITOR_SECTIONS,
} from "@/features/resumeEditor/editorSections";

function SaveStatus({ status }) {
  const map = {
    saved: { text: "✓ Saved", className: "text-emerald-700" },
    saving: { text: "Saving...", className: "text-muted-foreground" },
    unsaved: { text: "Unsaved changes", className: "text-amber-700" },
    error: { text: "Save failed", className: "text-destructive" },
    idle: { text: "", className: "" },
  };
  const item = map[status] || map.idle;
  if (!item.text) return null;
  return (
    <span className={`text-xs font-medium ${item.className}`} aria-live="polite">
      {item.text}
    </span>
  );
}

function ProgressBar({ index, total }) {
  const pct = ((index + 1) / total) * 100;
  return (
    <div
      className="h-1 w-full max-w-[140px] rounded-full bg-border overflow-hidden"
      role="progressbar"
      aria-valuenow={index + 1}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Step ${index + 1} of ${total}`}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-200"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function FormSection({
  activeIndex,
  setActiveIndex,
  saveStatus,
  onSaveNow,
}) {
  const go = (index) => {
    setActiveIndex(Math.max(0, Math.min(EDITOR_SECTIONS.length - 1, index)));
  };

  const current = EDITOR_SECTIONS[activeIndex] || EDITOR_SECTIONS[0];
  const total = EDITOR_SECTIONS.length;

  const content = (() => {
    switch (EDITOR_SECTIONS[activeIndex]?.id) {
      case "basics":
        return <PersonalDetail />;
      case "target":
        return <TargetJob />;
      case "experience":
        return <Experience />;
      case "projects":
        return <Projects />;
      case "education":
        return <Education />;
      case "skills":
        return <Skills />;
      case "summary":
        return <Summery />;
      case "review":
        return <Review onNavigateSection={(i) => go(i)} />;
      default:
        return <PersonalDetail />;
    }
  })();

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Builder header */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4">
        <Link to="/dashboard" className="shrink-0">
          <Button variant="outline" size="sm" className="gap-2 min-h-[40px]">
            <Home size={16} />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>
        </Link>

        <div className="flex flex-col gap-1 min-w-0 flex-1">
          {/* Mobile: section dropdown */}
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5 min-h-[40px] max-w-full"
                >
                  <span className="truncate">{current.label}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {EDITOR_SECTIONS.map((section, index) => (
                  <DropdownMenuItem
                    key={section.id}
                    onSelect={() => go(index)}
                    className={
                      activeIndex === index
                        ? "bg-primary text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                        : ""
                    }
                  >
                    {index + 1}. {section.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-foreground leading-none">
              {current.label}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs text-muted-foreground">
              Step {activeIndex + 1} of {total}
            </p>
            <ProgressBar index={activeIndex} total={total} />
            <SaveStatus status={saveStatus} />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <ThemeSelector />
          {saveStatus === "error" && (
            <Button type="button" size="sm" variant="outline" onClick={onSaveNow}>
              Retry
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 pb-2">{content}</div>

      {/* Desktop / tablet footer */}
      <div className="hidden sm:flex items-center justify-between gap-3 mt-6 pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          disabled={activeIndex === 0}
          onClick={() => go(activeIndex - 1)}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </Button>
        <Button
          type="button"
          onClick={() => go(activeIndex + 1)}
          disabled={activeIndex >= total - 1}
          className="gap-2"
        >
          Continue
          <ArrowRight size={16} />
        </Button>
      </div>

      {/* Mobile bottom bar */}
      <div
        className="sm:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-white/95 backdrop-blur px-4 py-3 flex justify-between gap-3"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <Button
          type="button"
          variant="outline"
          disabled={activeIndex === 0}
          onClick={() => go(activeIndex - 1)}
          className="min-h-[44px] min-w-[44px]"
        >
          Back
        </Button>
        <Button
          type="button"
          disabled={activeIndex >= total - 1}
          onClick={() => go(activeIndex + 1)}
          className="flex-1 max-w-[220px] min-h-[44px]"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
