/**
 * Canonical resumeInfo shape + migration from legacy flat/nested documents.
 */

export const EMPTY_PERSONAL = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  jobTitle: "",
  linkedin: "",
  github: "",
  portfolio: "",
};

export const EMPTY_TARGET_JOB = {
  title: "",
  description: "",
  insights: null,
};

export const EMPTY_THEME = {
  layout: "classic",
  accent: "#1E3A8A",
};

export function createEmptyResumeInfo() {
  return {
    personalDetails: { ...EMPTY_PERSONAL },
    targetJob: { ...EMPTY_TARGET_JOB },
    summary: "",
    experience: [],
    projects: [],
    education: [],
    skills: [],
    theme: { ...EMPTY_THEME },
  };
}

function unwrapNested(raw) {
  if (!raw || typeof raw !== "object") return {};

  // Legacy pollution: resumeInfo stored inside resumeInfo
  if (
    raw.resumeInfo &&
    typeof raw.resumeInfo === "object" &&
    (raw.resumeInfo.personalDetails ||
      raw.resumeInfo.experience ||
      raw.resumeInfo.summary !== undefined ||
      raw.resumeInfo.education ||
      raw.resumeInfo.skills)
  ) {
    const { resumeInfo: nested, ...rest } = raw;
    return { ...rest, ...nested };
  }

  return { ...raw };
}

function normalizeExperience(list) {
  if (!Array.isArray(list)) return [];
  return list.map((item) => ({
    title: item?.title || "",
    companyName: item?.companyName || "",
    city: item?.city || "",
    state: item?.state || "",
    startDate: item?.startDate || "",
    endDate: item?.endDate || "",
    currentlyWorking: Boolean(item?.currentlyWorking),
    workSummary: item?.workSummary || "",
  }));
}

function normalizeProjects(list) {
  if (!Array.isArray(list)) return [];
  return list.map((item) => ({
    name: item?.name || item?.projectName || "",
    description: item?.description || "",
    technologies: Array.isArray(item?.technologies)
      ? item.technologies
      : typeof item?.technologies === "string"
        ? item.technologies
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    role: item?.role || "",
    projectUrl: item?.projectUrl || item?.url || "",
    githubUrl: item?.githubUrl || item?.github || "",
  }));
}

function normalizeEducation(list) {
  if (!Array.isArray(list)) return [];
  return list.map((item) => ({
    universityName: item?.universityName || "",
    degree: item?.degree || "",
    major: item?.major || "",
    startDate: item?.startDate || "",
    endDate: item?.endDate || "",
    description: item?.description || "",
  }));
}

function normalizeSkills(list) {
  if (!Array.isArray(list)) return [];
  return list.map((item) => ({
    category: item?.category || "",
    items: Array.isArray(item?.items)
      ? item.items.filter(Boolean)
      : typeof item?.itemsText === "string"
        ? item.itemsText
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
  }));
}

function normalizeTheme(raw) {
  const accent =
    raw?.theme?.accent ||
    raw?.themeColor ||
    EMPTY_THEME.accent;

  const layout =
    raw?.theme?.layout === "modern" ? "modern" : "classic";

  return { layout, accent };
}

function normalizeInsights(insights) {
  if (!insights || typeof insights !== "object") return null;
  return {
    requiredSkills: Array.isArray(insights.requiredSkills)
      ? insights.requiredSkills
      : [],
    preferredSkills: Array.isArray(insights.preferredSkills)
      ? insights.preferredSkills
      : [],
    keywords: Array.isArray(insights.keywords) ? insights.keywords : [],
    responsibilities: Array.isArray(insights.responsibilities)
      ? insights.responsibilities
      : [],
    experienceRequirements: Array.isArray(insights.experienceRequirements)
      ? insights.experienceRequirements
      : [],
  };
}

/**
 * Normalize any legacy or current resumeInfo into the canonical shape.
 */
export function normalizeResumeInfo(raw) {
  const data = unwrapNested(raw);

  const personal = {
    ...EMPTY_PERSONAL,
    ...(data.personalDetails || {}),
  };

  const targetJobRaw = data.targetJob || {};
  const targetJob = {
    title: targetJobRaw.title || personal.jobTitle || "",
    description: targetJobRaw.description || "",
    insights: normalizeInsights(targetJobRaw.insights),
  };

  return {
    personalDetails: personal,
    targetJob,
    summary: typeof data.summary === "string" ? data.summary : "",
    experience: normalizeExperience(data.experience),
    projects: normalizeProjects(data.projects),
    education: normalizeEducation(data.education),
    skills: normalizeSkills(data.skills),
    theme: normalizeTheme(data),
  };
}

/**
 * Strip editor-only fields before persisting.
 */
export function sanitizeResumeInfoForSave(info) {
  const normalized = normalizeResumeInfo(info);
  const targetJob = {
    title: normalized.targetJob.title,
    description: normalized.targetJob.description,
  };
  if (normalized.targetJob.insights) {
    targetJob.insights = normalized.targetJob.insights;
  }

  return {
    ...normalized,
    targetJob,
    skills: normalized.skills.map(({ category, items }) => ({
      category,
      items,
    })),
  };
}

/**
 * Public share payload — resume content only.
 */
export function toPublicResume(doc) {
  if (!doc) return null;
  return {
    id: doc.id,
    title: doc.title,
    resumeInfo: normalizeResumeInfo(doc.resumeInfo),
    updatedAt: doc.updatedAt || doc.createdAt || null,
  };
}
