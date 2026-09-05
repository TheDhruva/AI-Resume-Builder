import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { resumeInfoValidator } from "./lib/validators";

export default defineSchema({
  resumes: defineTable({
    id: v.string(),
    title: v.string(),
    userId: v.string(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    resumeInfo: v.optional(resumeInfoValidator),
  })
    .index("by_userId", ["userId"])
    .index("by_publicId", ["id"]),
});
