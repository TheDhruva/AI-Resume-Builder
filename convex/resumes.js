import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/* ------------------------------------------
   CREATE RESUME
------------------------------------------ */
export const createResume = mutation({
  args: {
    id: v.string(),
    title: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("resumes", {
      id: args.id,
      title: args.title,
      userId: args.userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      resumeInfo: {
        personalDetails: {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          jobTitle: "",
        },
        themeColor: "#000000",
        summary: "",
        experience: [],
        education: [],
        skills: [],
      },
    });
  },
});

/* ------------------------------------------
   GET ALL RESUMES
------------------------------------------ */
export const getAllResumes = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("resumes")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

/* ------------------------------------------
   GET ONE RESUME BY PUBLIC ID
------------------------------------------ */
export const getResumeById = query({
  args: { resumeId: v.string() },
  handler: async (ctx, args) => {
    const doc = await ctx.db
      .query("resumes")
      .filter((q) => q.eq(q.field("id"), args.resumeId))
      .first();

    if (!doc) throw new Error("❌ Resume not found");

    return doc;
  },
});

/* ------------------------------------------
   UPDATE RESUME INFO (Correct patch!)
------------------------------------------ */
export const updateResumeInfo = mutation({
  args: {
    resumeId: v.string(),
    field: v.string(), 
    value: v.any(),
  },
  handler: async (ctx, args) => {
    // 1. Fetch doc
    const resume = await ctx.db
      .query("resumes")
      .filter((q) => q.eq(q.field("id"), args.resumeId))
      .first();

    if (!resume) throw new Error("❌ Resume not found");

    // 2. Deep merge helper
    const deepMerge = (target, source) => {
      if (!source) return target;
      const output = { ...target };

      for (const key in source) {
        if (
          typeof source[key] === "object" &&
          source[key] !== null &&
          !Array.isArray(source[key])
        ) {
          output[key] = deepMerge(target[key] || {}, source[key]);
        } else {
          output[key] = source[key];
        }
      }
      return output;
    };

    let patchObject = {};

    // 3. If updating nested resumeInfo
    if (args.field.startsWith("resumeInfo")) {
      patchObject.resumeInfo = deepMerge(resume.resumeInfo || {}, args.value);
    } else {
      patchObject[args.field] = args.value;
    }

    patchObject.updatedAt = Date.now();

    // 4. PATCH ONLY THE TARGETED KEYS
    await ctx.db.patch(resume._id, patchObject);

    return { success: true };
  },
});

/* ------------------------------------------
   DELETE RESUME
------------------------------------------ */
export const deleteResume = mutation({
  args: { resumeId: v.string() },
  handler: async (ctx, args) => {
    const resume = await ctx.db
      .query("resumes")
      .filter((q) => q.eq(q.field("id"), args.resumeId))
      .first();

    if (!resume) throw new Error("❌ Resume not found");

    await ctx.db.delete(resume._id);

    return { success: true };
  },
});
