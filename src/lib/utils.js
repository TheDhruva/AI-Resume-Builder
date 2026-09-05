import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Strip dangerous HTML from AI/user rich text before rendering.
 * Allows a small resume-safe tag set only.
 */
const ALLOWED_TAGS = new Set([
  "ul",
  "ol",
  "li",
  "p",
  "br",
  "b",
  "strong",
  "i",
  "em",
  "u",
  "s",
  "a",
]);

export function sanitizeHtml(dirty) {
  if (!dirty || typeof dirty !== "string") return "";

  // Remove script/style blocks entirely
  let html = dirty
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/on\w+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/on\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/javascript:/gi, "");

  // Drop disallowed tags, keep allowed ones (strip attrs except href on <a>)
  html = html.replace(/<\/?([a-z0-9]+)(\s[^>]*)?>/gi, (match, tag, attrs = "") => {
    const name = tag.toLowerCase();
    const isClosing = match.startsWith("</");

    if (!ALLOWED_TAGS.has(name)) {
      return "";
    }

    if (isClosing) {
      return `</${name}>`;
    }

    if (name === "br") {
      return "<br />";
    }

    if (name === "a") {
      const hrefMatch = attrs.match(/href\s*=\s*(['"])(.*?)\1/i);
      const href = hrefMatch?.[2] || "";
      const safeHref =
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:")
          ? href
          : "#";
      return `<a href="${safeHref}" rel="noopener noreferrer" target="_blank">`;
    }

    return `<${name}>`;
  });

  return html;
}

/** Prefer the live page origin so Vercel preview/prod share links stay correct. */
export function getShareUrl(resumeId) {
  const base =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : (import.meta.env.VITE_BASE_URL || "").replace(/\/$/, "");
  return `${base}/r/${resumeId}`;
}

/**
 * Clipboard that works in Safari / Brave / insecure contexts with a fallback.
 */
export async function copyTextToClipboard(text) {
  if (!text) throw new Error("Nothing to copy");

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // fall through — Safari often requires fallback outside HTTPS gesture edge cases
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  const ok = document.execCommand("copy");
  document.body.removeChild(textarea);
  if (!ok) throw new Error("Copy failed");
}

export async function shareOrCopy({ title, text, url }) {
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({ title, text, url });
      return "shared";
    } catch (err) {
      if (err?.name === "AbortError") return "aborted";
      // fall through to copy
    }
  }
  await copyTextToClipboard(url);
  return "copied";
}

export const emptyResumeInfo = {
  personalDetails: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    jobTitle: "",
    linkedin: "",
    github: "",
    portfolio: "",
  },
  targetJob: {
    title: "",
    description: "",
    insights: null,
  },
  theme: {
    layout: "classic",
    accent: "#1E3A8A",
  },
  themeColor: "#1E3A8A",
  summary: "",
  experience: [],
  projects: [],
  education: [],
  skills: [],
};
