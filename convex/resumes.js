import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserId, requireIdentity, requireResumeOwner } from "./lib/auth";
import { resumeInfoValidator } from "./lib/validators";

const emptyResumeInfo = {
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

export const createResume = mutation({
  args: {
    id: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const userId = getUserId(identity);
    const now = Date.now();
    const title = args.title.trim() || "My Resume";

    // Idempotent: guest migration / StrictMode retries must not duplicate ids
    const existing = await ctx.db
      .query("resumes")
      .withIndex("by_publicId", (q) => q.eq("id", args.id))
      .first();

    if (existing) {
      if (existing.userId !== userId) {
        throw new Error("A resume with this id already exists");
      }
      await ctx.db.patch(existing._id, {
        title,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert("resumes", {
      id: args.id,
      title,
      userId,
      createdAt: now,
      updatedAt: now,
      resumeInfo: emptyResumeInfo,
    });
  },
});

export const getAllResumes = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);
    const userId = getUserId(identity);

    return await ctx.db
      .query("resumes")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getResumeById = query({
  args: { resumeId: v.string() },
  handler: async (ctx, args) => {
    const { resume } = await requireResumeOwner(ctx, args.resumeId);
    return resume;
  },
});

export const getPublicResumeById = query({
  args: { resumeId: v.string() },
  handler: async (ctx, args) => {
    const resume = await ctx.db
      .query("resumes")
      .withIndex("by_publicId", (q) => q.eq("id", args.resumeId))
      .first();

    if (!resume) return null;

    return {
      id: resume.id,
      title: resume.title,
      resumeInfo: resume.resumeInfo ?? emptyResumeInfo,
      updatedAt: resume.updatedAt,
    };
  },
});

export const updateResumeInfo = mutation({
  args: {
    resumeId: v.string(),
    resumeInfo: resumeInfoValidator,
  },
  handler: async (ctx, args) => {
    const { resume } = await requireResumeOwner(ctx, args.resumeId);
    if (!resume) throw new Error("Resume not found");

    const prev = resume.resumeInfo || emptyResumeInfo;
    const next = args.resumeInfo;

    const merged = {
      ...prev,
      ...next,
      personalDetails: next.personalDetails
        ? { ...(prev.personalDetails || {}), ...next.personalDetails }
        : prev.personalDetails,
      targetJob: next.targetJob
        ? { ...(prev.targetJob || {}), ...next.targetJob }
        : prev.targetJob,
      theme: next.theme
        ? { ...(prev.theme || {}), ...next.theme }
        : prev.theme,
    };

    if (merged.theme?.accent) {
      merged.themeColor = merged.theme.accent;
    }

    await ctx.db.patch(resume._id, {
      resumeInfo: merged,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

export const updateThemeColor = mutation({
  args: {
    resumeId: v.string(),
    themeColor: v.string(),
  },
  handler: async (ctx, args) => {
    const { resume } = await requireResumeOwner(ctx, args.resumeId);
    if (!resume) throw new Error("Resume not found");

    const prev = resume.resumeInfo || emptyResumeInfo;

    await ctx.db.patch(resume._id, {
      resumeInfo: {
        ...prev,
        themeColor: args.themeColor,
        theme: {
          ...(prev.theme || { layout: "classic" }),
          accent: args.themeColor,
        },
      },
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

export const deleteResume = mutation({
  args: { resumeId: v.string() },
  handler: async (ctx, args) => {
    const { resume } = await requireResumeOwner(ctx, args.resumeId);
    if (!resume) throw new Error("Resume not found");
    await ctx.db.delete(resume._id);
    return { success: true };
  },
});

export const renameResume = mutation({
  args: {
    resumeId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const { resume } = await requireResumeOwner(ctx, args.resumeId);
    if (!resume) throw new Error("Resume not found");
    const title = args.title.trim();
    if (!title) throw new Error("Title is required");
    await ctx.db.patch(resume._id, { title, updatedAt: Date.now() });
    return { success: true };
  },
});

export const duplicateResume = mutation({
  args: {
    resumeId: v.string(),
    newId: v.string(),
  },
  handler: async (ctx, args) => {
    const { resume, userId } = await requireResumeOwner(ctx, args.resumeId);
    if (!resume) throw new Error("Resume not found");
    const now = Date.now();
    await ctx.db.insert("resumes", {
      id: args.newId,
      title: `${resume.title} (Copy)`,
      userId,
      createdAt: now,
      updatedAt: now,
      resumeInfo: resume.resumeInfo || emptyResumeInfo,
    });
    return { id: args.newId };
  },
});
