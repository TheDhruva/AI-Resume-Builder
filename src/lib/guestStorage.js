import { v4 as uuidv4 } from "uuid";
import {
  createEmptyResumeInfo,
  normalizeResumeInfo,
  sanitizeResumeInfoForSave,
} from "@/lib/normalizeResume";

const GUEST_FLAG = "arb_guest_mode";
const GUEST_RESUMES = "arb_guest_resumes";
const MIGRATION_DONE = "arb_guest_migrated";

function readJson(key, fallback) {
  try {
    if (typeof localStorage === "undefined") return fallback;
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    if (typeof localStorage === "undefined") return false;
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // Safari private mode / blocked storage
    return false;
  }
}

export function isGuestMode() {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(GUEST_FLAG) === "1";
  } catch {
    return false;
  }
}

export function enableGuestMode() {
  try {
    localStorage.setItem(GUEST_FLAG, "1");
  } catch {
    // Guest mode still works in-memory for the session via callers
  }
}

export function clearGuestMode() {
  try {
    localStorage.removeItem(GUEST_FLAG);
  } catch {
    /* ignore */
  }
}

export function listGuestResumes() {
  const list = readJson(GUEST_RESUMES, []);
  return Array.isArray(list) ? list : [];
}

function saveGuestList(list) {
  writeJson(GUEST_RESUMES, list);
}

export function getGuestResume(resumeId) {
  return listGuestResumes().find((r) => r.id === resumeId) || null;
}

export function createGuestResume(title = "My Resume") {
  const now = Date.now();
  const resume = {
    id: uuidv4(),
    title: title.trim() || "My Resume",
    createdAt: now,
    updatedAt: now,
    resumeInfo: createEmptyResumeInfo(),
  };
  const list = listGuestResumes();
  list.unshift(resume);
  saveGuestList(list);
  enableGuestMode();
  return resume;
}

export function updateGuestResumeInfo(resumeId, resumeInfo) {
  const list = listGuestResumes();
  const idx = list.findIndex((r) => r.id === resumeId);
  if (idx < 0) throw new Error("Guest resume not found");

  list[idx] = {
    ...list[idx],
    resumeInfo: sanitizeResumeInfoForSave(resumeInfo),
    updatedAt: Date.now(),
  };
  saveGuestList(list);
  return list[idx];
}

export function updateGuestThemeColor(resumeId, themeColor) {
  const resume = getGuestResume(resumeId);
  if (!resume) throw new Error("Guest resume not found");
  const info = normalizeResumeInfo(resume.resumeInfo);
  return updateGuestResumeInfo(resumeId, {
    ...info,
    themeColor,
    theme: { ...(info.theme || {}), accent: themeColor },
  });
}

export function renameGuestResume(resumeId, title) {
  const list = listGuestResumes();
  const idx = list.findIndex((r) => r.id === resumeId);
  if (idx < 0) throw new Error("Guest resume not found");
  const next = title.trim();
  if (!next) throw new Error("Title is required");
  list[idx] = { ...list[idx], title: next, updatedAt: Date.now() };
  saveGuestList(list);
  return list[idx];
}

export function duplicateGuestResume(resumeId, newId = uuidv4()) {
  const source = getGuestResume(resumeId);
  if (!source) throw new Error("Guest resume not found");
  const now = Date.now();
  const copy = {
    id: newId,
    title: `${source.title} (Copy)`,
    createdAt: now,
    updatedAt: now,
    resumeInfo: normalizeResumeInfo(source.resumeInfo),
  };
  const list = listGuestResumes();
  list.unshift(copy);
  saveGuestList(list);
  return copy;
}

export function deleteGuestResume(resumeId) {
  const list = listGuestResumes().filter((r) => r.id !== resumeId);
  saveGuestList(list);
  return { success: true };
}

export function clearGuestResumes() {
  try {
    localStorage.removeItem(GUEST_RESUMES);
  } catch {
    /* ignore */
  }
}

export function hasPendingGuestMigration() {
  if (typeof window === "undefined") return false;
  try {
    if (localStorage.getItem(MIGRATION_DONE) === "1") return false;
    return listGuestResumes().length > 0;
  } catch {
    return false;
  }
}

export function markGuestMigrationDone() {
  try {
    localStorage.setItem(MIGRATION_DONE, "1");
  } catch {
    /* ignore */
  }
  clearGuestMode();
  clearGuestResumes();
}

/** Start guest session with one starter resume; returns resume id. */
export function startGuestSession() {
  enableGuestMode();
  try {
    localStorage.removeItem(MIGRATION_DONE);
  } catch {
    /* ignore */
  }
  const existing = listGuestResumes();
  if (existing.length > 0) return existing[0].id;
  return createGuestResume("My Resume").id;
}
