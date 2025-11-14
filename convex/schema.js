import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  }).index("by_userId", ["userId"]),

  resumes: defineTable({
    id: v.string(),
    title: v.string(),
    userId: v.string(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),

    resumeInfo: v.optional(
      v.object({
        // -------------------------
        // Personal Details
        // -------------------------
        personalDetails: v.optional(
          v.object({
            firstName: v.optional(v.string()),
            lastName: v.optional(v.string()),
            email: v.optional(v.string()),
            phone: v.optional(v.string()),
            address: v.optional(v.string()),
            jobTitle: v.optional(v.string()),
          })
        ),

        themeColor: v.optional(v.string()),

        // -------------------------
        // Experience Section
        // -------------------------
        experience: v.optional(
          v.array(
            v.object({
              title: v.optional(v.string()),
              companyName: v.optional(v.string()),
              city: v.optional(v.string()),
              state: v.optional(v.string()),
              startDate: v.optional(v.string()),
              endDate: v.optional(v.string()),
              workSummary: v.optional(v.string()),
            })
          )
        ),

        // -------------------------
        // Education Section
        // -------------------------
        education: v.optional(
          v.array(
            v.object({
              universityName: v.optional(v.string()),
              degree: v.optional(v.string()),
              major: v.optional(v.string()),
              startDate: v.optional(v.string()),
              endDate: v.optional(v.string()),
              description: v.optional(v.string()),
            })
          )
        ),

        // -------------------------
        // Skills Section
        // -------------------------
        skills: v.optional(
          v.array(
            v.object({
              category: v.optional(v.string()),
              items: v.optional(v.array(v.string())),
            })
          )
        ),

        // -------------------------
        // Summary
        // -------------------------
        summary: v.optional(v.string()),
      })
    ),
  }).index("by_userId", ["userId"]),
});
