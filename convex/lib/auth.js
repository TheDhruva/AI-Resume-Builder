export async function requireIdentity(ctx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized: sign in required");
  }
  return identity;
}

export function getUserId(identity) {
  return identity.subject;
}

export async function requireResumeOwner(ctx, resumeId) {
  const identity = await requireIdentity(ctx);
  const userId = getUserId(identity);

  const matches = await ctx.db
    .query("resumes")
    .withIndex("by_publicId", (q) => q.eq("id", resumeId))
    .collect();

  const resume = matches.find((doc) => doc.userId === userId) || null;

  return { identity, userId, resume };
}
