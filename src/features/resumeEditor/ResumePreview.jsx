import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ResumeInfoContext } from "@/features/resumeEditor/ResumeInfoContext";
import ResumeDocument from "@/features/resumeEditor/ResumeDocument";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";

/** A4 width in CSS px at 96dpi (210mm). */
const A4_WIDTH_PX = (210 * 96) / 25.4;
/** A4 height in CSS px at 96dpi (297mm). */
const A4_HEIGHT_PX = (297 * 96) / 25.4;

/**
 * Live preview that keeps the full A4 page visible.
 * - Fit = scale to container width (default)
 * - 100% = actual size with scroll
 * Transform scale is wrapped so layout size matches the *visual* size
 * (avoids clipped edges from unscaled layout boxes).
 */
export default function ResumePreview({
  mode = "edit",
  showZoom = true,
  className = "",
}) {
  const { resumeInfo } = useContext(ResumeInfoContext);
  const frameRef = useRef(null);
  const pageRef = useRef(null);

  const [fitScale, setFitScale] = useState(1);
  const [manualScale, setManualScale] = useState(null); // null => use fit
  const [contentHeightPx, setContentHeightPx] = useState(A4_HEIGHT_PX);

  const scale = manualScale ?? fitScale;
  const isFit = manualScale === null;

  // Measure container → fit-to-width scale
  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const update = () => {
      const available = frame.clientWidth;
      if (available <= 0) return;
      // Leave 2px slack so borders/shadows aren't clipped
      const next = Math.min(1, (available - 2) / A4_WIDTH_PX);
      setFitScale(Number(next.toFixed(4)));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(frame);
    return () => ro.disconnect();
  }, [resumeInfo]);

  // Measure actual document height (content may exceed one A4)
  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const measure = () => {
      const h = page.scrollHeight || page.offsetHeight || A4_HEIGHT_PX;
      setContentHeightPx(h);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(page);
    return () => ro.disconnect();
  }, [resumeInfo]);

  // Re-measure after fonts/images settle
  useEffect(() => {
    const t = setTimeout(() => {
      const page = pageRef.current;
      if (page) setContentHeightPx(page.scrollHeight || A4_HEIGHT_PX);
    }, 100);
    return () => clearTimeout(t);
  }, [resumeInfo]);

  if (!resumeInfo) {
    return (
      <div className="text-center text-muted-foreground py-16 text-sm">
        Preparing preview...
      </div>
    );
  }

  const scaledWidth = A4_WIDTH_PX * scale;
  const scaledHeight = contentHeightPx * scale;

  return (
    <div className={`resume-preview-shell ${className}`}>
      {showZoom && (
        <div className="flex flex-wrap items-center justify-end gap-2 mb-3 print:hidden">
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label="Zoom out"
            onClick={() =>
              setManualScale((s) => {
                const base = s ?? fitScale;
                return Number(Math.max(0.35, base - 0.1).toFixed(2));
              })
            }
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground min-w-[3rem] text-center tabular-nums">
            {Math.round(scale * 100)}%
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label="Zoom in"
            onClick={() =>
              setManualScale((s) => {
                const base = s ?? fitScale;
                return Number(Math.min(1.5, base + 0.1).toFixed(2));
              })
            }
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={isFit ? "default" : "ghost"}
            size="sm"
            onClick={() => setManualScale(null)}
            title="Scale resume to fit the preview panel width"
          >
            Fit
          </Button>
          <Button
            type="button"
            variant={!isFit && manualScale === 1 ? "default" : "ghost"}
            size="sm"
            onClick={() => setManualScale(1)}
            title="Show resume at actual A4 size"
          >
            100%
          </Button>
        </div>
      )}

      <div
        ref={frameRef}
        className="resume-preview-scaler w-full overflow-auto rounded-md bg-secondary/40 p-2"
        style={{
          // Keep preview usable inside sticky column without clipping the page
          maxHeight: "calc(100vh - 8.5rem)",
        }}
      >
        {/* Outer box uses SCALED dimensions so scrollbars match what you see */}
        <div
          className="mx-auto"
          style={{
            width: scaledWidth,
            height: scaledHeight,
            position: "relative",
          }}
        >
          <div
            ref={pageRef}
            className="resume-preview-scale-inner absolute top-0 left-0"
            style={{
              width: A4_WIDTH_PX,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <ResumeDocument
              resumeInfo={resumeInfo}
              mode={mode}
              className="shadow-md border border-border print:shadow-none print:border-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
