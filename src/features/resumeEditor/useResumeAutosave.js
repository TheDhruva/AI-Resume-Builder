import { useEffect, useRef, useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { sanitizeResumeInfoForSave } from "@/lib/normalizeResume";
import { updateGuestResumeInfo } from "@/lib/guestStorage";

/**
 * Debounced autosave — Convex when signed in, localStorage for guests.
 */
export function useResumeAutosave(
  resumeId,
  resumeInfo,
  enabled = true,
  { isGuest = false } = {}
) {
  const updateResumeInfo = useMutation(api.resumes.updateResumeInfo);
  const [status, setStatus] = useState("idle");
  const lastSavedJson = useRef(null);
  const timer = useRef(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const saveNow = useCallback(async () => {
    if (!resumeId || !resumeInfo || !enabled) return;

    const payload = sanitizeResumeInfoForSave(resumeInfo);
    const json = JSON.stringify(payload);
    if (json === lastSavedJson.current) {
      if (mounted.current) setStatus("saved");
      return;
    }

    if (mounted.current) setStatus("saving");

    try {
      if (isGuest) {
        updateGuestResumeInfo(resumeId, payload);
      } else {
        await updateResumeInfo({ resumeId, resumeInfo: payload });
      }
      lastSavedJson.current = json;
      if (mounted.current) setStatus("saved");
    } catch (err) {
      console.error("Autosave failed:", err);
      if (mounted.current) setStatus("error");
    }
  }, [resumeId, resumeInfo, enabled, isGuest, updateResumeInfo]);

  useEffect(() => {
    if (!enabled || !resumeId || !resumeInfo) return;

    const payload = sanitizeResumeInfoForSave(resumeInfo);
    const json = JSON.stringify(payload);

    if (lastSavedJson.current === null) {
      lastSavedJson.current = json;
      setStatus("saved");
      return;
    }

    if (json === lastSavedJson.current) return;

    setStatus("unsaved");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      saveNow();
    }, 900);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [resumeInfo, resumeId, enabled, saveNow]);

  return { status, saveNow, setStatus };
}
