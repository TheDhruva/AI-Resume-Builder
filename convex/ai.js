import { action } from "./_generated/server";
import { v } from "convex/values";

async function requireAuth(ctx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized: sign in required");
  return identity;
}

async function callGemini(prompt) {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing GOOGLE_AI_API_KEY. Set it with: npx convex env set GOOGLE_AI_API_KEY <key>"
    );
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("Gemini error:", res.status, body);
    throw new Error("AI generation failed");
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts
    ?.map((p) => p.text || "")
    .join("");

  if (!text) throw new Error("AI returned an empty response");
  return text;
}

function stripFences(text) {
  return String(text || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

function extractJson(text) {
  const cleaned = stripFences(text);
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!match) throw new Error("AI returned invalid JSON");
    return JSON.parse(match[0]);
  }
}

function extractHtmlList(text) {
  const cleaned = stripFences(text);
  const match = cleaned.match(/<ul[\s\S]*?<\/ul>/i);
  return match ? match[0] : cleaned;
}

function jobContext(targetJob) {
  if (!targetJob) return "No target job provided.";
  const insights = targetJob.insights
    ? JSON.stringify(targetJob.insights)
    : "none";
  return `Target job title: ${targetJob.title || "n/a"}
Job description (excerpt): ${(targetJob.description || "").slice(0, 2500)}
JD insights JSON: ${insights}`;
}

export const generateText = action({
  args: { prompt: v.string() },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const prompt = args.prompt.trim();
    if (!prompt || prompt.length > 12000) throw new Error("Invalid prompt");
    return callGemini(prompt);
  },
});

export const generateSummaries = action({
  args: {
    jobTitle: v.string(),
    targetJob: v.optional(v.any()),
    resumeFacts: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const prompt = `Act as an expert resume writer.
Generate 3 professional resume summaries for the Job Title: "${args.jobTitle}".
${jobContext(args.targetJob)}

Resume evidence (use only these facts — do NOT invent employers, degrees, or metrics):
${(args.resumeFacts || "No additional facts provided.").slice(0, 4000)}

Construct them for EntryLevel, MidLevel, and SeniorLevel.
Constraints:
1. Avoid clichés like "passionate", "team player".
2. Ground claims in the resume evidence above. If evidence is thin, write a modest truthful summary.
3. Keep each to 2–3 sentences.
4. Return ONLY a raw JSON object with keys EntryLevel, MidLevel, SeniorLevel.`;
    return extractJson(await callGemini(prompt));
  },
});

export const generateExperienceBullets = action({
  args: {
    positionTitle: v.string(),
    companyName: v.optional(v.string()),
    targetJob: v.optional(v.any()),
    existingSummary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const prompt = `Position Title: ${args.positionTitle}
Company: ${args.companyName || "n/a"}
Existing summary HTML (may be empty): ${args.existingSummary || "none"}
${jobContext(args.targetJob)}
Generate 5–7 professional resume bullet points for this role.
Rules:
- Use action verbs
- Include measurable impact where plausible
- Tailor wording toward the target job when insights exist
- Return ONLY valid HTML (<ul><li>...</li></ul>)`;
    return extractHtmlList(await callGemini(prompt));
  },
});

export const analyzeJobDescription = action({
  args: {
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    if (!args.description.trim()) throw new Error("Job description is required");
    const prompt = `Analyze this job posting and extract structured hiring signals.
Job title: ${args.title}
Job description:
${args.description.slice(0, 8000)}
Return ONLY valid JSON:
{
  "requiredSkills": string[],
  "preferredSkills": string[],
  "keywords": string[],
  "responsibilities": string[],
  "experienceRequirements": string[]
}
Deduplicate, keep concise (max 15 items per array).`;
    const parsed = extractJson(await callGemini(prompt));
    return {
      requiredSkills: parsed.requiredSkills || [],
      preferredSkills: parsed.preferredSkills || [],
      keywords: parsed.keywords || [],
      responsibilities: parsed.responsibilities || [],
      experienceRequirements: parsed.experienceRequirements || [],
    };
  },
});

export const improveSection = action({
  args: {
    section: v.string(),
    action: v.string(),
    content: v.string(),
    context: v.optional(v.any()),
    targetJob: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const actionGuide = {
      improve: "Improve clarity, impact, and professionalism.",
      rewrite: "Rewrite with stronger wording while preserving facts.",
      concise: "Make more concise without losing key achievements.",
      professional: "Make more professional and polished.",
      technical: "Make more technical and skill-focused.",
      metrics:
        "Add measurable impact where plausible; do not invent contradictory metrics.",
      tailor: "Tailor wording to the target job and JD insights.",
      bullets: "Turn into 3–5 strong resume bullet points as HTML <ul><li>.",
    };
    const instruction = actionGuide[args.action] || actionGuide.improve;
    const wantsHtml =
      args.section === "experience" ||
      args.action === "bullets" ||
      (args.content || "").includes("<li");
    const prompt = `You are an expert resume writer.
Section: ${args.section}
Action: ${args.action} — ${instruction}
Extra context JSON: ${JSON.stringify(args.context || {})}
${jobContext(args.targetJob)}
Current content:
${args.content || "(empty)"}
Return ONLY the improved content${
      wantsHtml
        ? " as HTML <ul><li>...</li></ul> when producing bullets, otherwise plain text."
        : " as plain text (no markdown fences)."
    }`;
    const text = await callGemini(prompt);
    return wantsHtml && args.action === "bullets"
      ? extractHtmlList(text)
      : stripFences(text);
  },
});

export const generateProjectBullets = action({
  args: {
    name: v.string(),
    description: v.string(),
    technologies: v.optional(v.array(v.string())),
    role: v.optional(v.string()),
    targetJob: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const prompt = `Turn this project into 3–5 strong resume bullets.
Project: ${args.name}
Role: ${args.role || "n/a"}
Technologies: ${(args.technologies || []).join(", ") || "n/a"}
Description: ${args.description}
${jobContext(args.targetJob)}
Rules:
- HTML only: <ul><li>...</li></ul>
- Emphasize technical impact
- Do not invent technologies not mentioned`;
    return extractHtmlList(await callGemini(prompt));
  },
});
