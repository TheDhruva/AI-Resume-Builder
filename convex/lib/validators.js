import { v } from "convex/values";

export const personalDetailsValidator = v.object({
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  email: v.optional(v.string()),
  phone: v.optional(v.string()),
  address: v.optional(v.string()),
  jobTitle: v.optional(v.string()),
  linkedin: v.optional(v.string()),
  github: v.optional(v.string()),
  portfolio: v.optional(v.string()),
});

export const jdInsightsValidator = v.object({
  requiredSkills: v.optional(v.array(v.string())),
  preferredSkills: v.optional(v.array(v.string())),
  keywords: v.optional(v.array(v.string())),
  responsibilities: v.optional(v.array(v.string())),
  experienceRequirements: v.optional(v.array(v.string())),
});

export const targetJobValidator = v.object({
  title: v.optional(v.string()),
  description: v.optional(v.string()),
  insights: v.optional(jdInsightsValidator),
});

export const experienceItemValidator = v.object({
  title: v.optional(v.string()),
  companyName: v.optional(v.string()),
  city: v.optional(v.string()),
  state: v.optional(v.string()),
  startDate: v.optional(v.string()),
  endDate: v.optional(v.string()),
  currentlyWorking: v.optional(v.boolean()),
  workSummary: v.optional(v.string()),
});

export const projectItemValidator = v.object({
  name: v.optional(v.string()),
  description: v.optional(v.string()),
  technologies: v.optional(v.array(v.string())),
  role: v.optional(v.string()),
  projectUrl: v.optional(v.string()),
  githubUrl: v.optional(v.string()),
});

export const educationItemValidator = v.object({
  universityName: v.optional(v.string()),
  degree: v.optional(v.string()),
  major: v.optional(v.string()),
  startDate: v.optional(v.string()),
  endDate: v.optional(v.string()),
  description: v.optional(v.string()),
});

export const skillGroupValidator = v.object({
  category: v.optional(v.string()),
  items: v.optional(v.array(v.string())),
});

export const themeValidator = v.object({
  layout: v.optional(v.string()),
  accent: v.optional(v.string()),
});

export const resumeInfoValidator = v.object({
  personalDetails: v.optional(personalDetailsValidator),
  targetJob: v.optional(targetJobValidator),
  summary: v.optional(v.string()),
  experience: v.optional(v.array(experienceItemValidator)),
  projects: v.optional(v.array(projectItemValidator)),
  education: v.optional(v.array(educationItemValidator)),
  skills: v.optional(v.array(skillGroupValidator)),
  theme: v.optional(themeValidator),
  // Legacy
  themeColor: v.optional(v.string()),
});
