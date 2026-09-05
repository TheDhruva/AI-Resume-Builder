/**
 * Deterministic ATS-oriented resume scoring.
 * AI must never invent this number — only explain recommendations.
 */

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/<[^>]+>/g, " ")
    .replace(/[^a-z0-9+#.\- ]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function unique(arr) {
  return [...new Set(arr)];
}

function stripHtml(html) {
  return String(html || "").replace(/<[^>]+>/g, " ");
}

function resumeCorpus(info) {
  const parts = [];
  const p = info?.personalDetails || {};
  parts.push(p.firstName, p.lastName, p.jobTitle, p.email, p.phone, p.address);
  parts.push(info?.summary);
  parts.push(info?.targetJob?.title, info?.targetJob?.description);

  (info?.experience || []).forEach((e) => {
    parts.push(e.title, e.companyName, e.city, e.state, stripHtml(e.workSummary));
  });

  (info?.projects || []).forEach((pr) => {
    parts.push(pr.name, pr.role, pr.description, ...(pr.technologies || []));
  });

  (info?.education || []).forEach((ed) => {
    parts.push(ed.universityName, ed.degree, ed.major, ed.description);
  });

  (info?.skills || []).forEach((s) => {
    parts.push(s.category, ...(s.items || []));
  });

  return tokenize(parts.filter(Boolean).join(" "));
}

function jdKeywords(info) {
  const insights = info?.targetJob?.insights;
  if (!insights) {
    return unique(tokenize(info?.targetJob?.description || ""));
  }

  return unique(
    [
      ...(insights.requiredSkills || []),
      ...(insights.preferredSkills || []),
      ...(insights.keywords || []),
    ]
      .flatMap((k) => tokenize(k))
      .filter(Boolean)
  );
}

function hasMetric(text) {
  return /\d/.test(stripHtml(text));
}

function actionVerbStart(text) {
  const plain = stripHtml(text).trim();
  const first = plain.split(/\s+/)[0]?.toLowerCase() || "";
  const verbs = [
    "built",
    "led",
    "designed",
    "developed",
    "created",
    "implemented",
    "improved",
    "optimized",
    "launched",
    "managed",
    "delivered",
    "automated",
    "architected",
    "reduced",
    "increased",
    "collaborated",
    "engineered",
    "shipped",
    "owned",
    "analyzed",
  ];
  return verbs.includes(first);
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function scoreCompleteness(info) {
  const checks = [];
  const p = info?.personalDetails || {};

  const contactOk = Boolean(p.email && p.phone && (p.firstName || p.lastName));
  checks.push({
    id: "contact",
    ok: contactOk,
    label: contactOk
      ? "Contact information complete"
      : "Add name, email, and phone",
  });

  const summaryOk = Boolean((info?.summary || "").trim().length >= 40);
  checks.push({
    id: "summary",
    ok: summaryOk,
    label: summaryOk ? "Summary present" : "Add a professional summary",
  });

  const expOk = (info?.experience || []).some(
    (e) => e.title && e.companyName && stripHtml(e.workSummary).trim()
  );
  checks.push({
    id: "experience",
    ok: expOk,
    label: expOk
      ? "Experience added"
      : "Add at least one experience with bullets",
  });

  const eduOk = (info?.education || []).some((e) => e.universityName || e.degree);
  checks.push({
    id: "education",
    ok: eduOk,
    label: eduOk ? "Education complete" : "Add education details",
  });

  const skillsOk = (info?.skills || []).some((s) => (s.items || []).length > 0);
  checks.push({
    id: "skills",
    ok: skillsOk,
    label: skillsOk ? "Skills added" : "Add skills",
  });

  const projects = info?.projects || [];
  if (projects.length > 0) {
    const projOk = projects.some((pr) => pr.name && (pr.description || "").trim());
    checks.push({
      id: "projects",
      ok: projOk,
      label: projOk ? "Projects added" : "Complete project details",
    });
  }

  const passed = checks.filter((c) => c.ok).length;
  const score = Math.round((passed / checks.length) * 100);

  return { score, checks };
}

function scoreContact(info) {
  const p = info?.personalDetails || {};
  let score = 0;
  if (p.firstName || p.lastName) score += 25;
  if (p.email && /.+@.+\..+/.test(p.email)) score += 35;
  else if (p.email) score += 15;
  if (p.phone) score += 25;
  if (p.address) score += 15;
  return clamp(score, 0, 100);
}

function scoreStructure(info) {
  let score = 40;
  if ((info?.summary || "").trim()) score += 15;
  if ((info?.experience || []).length) score += 15;
  if ((info?.education || []).length) score += 10;
  if ((info?.skills || []).length) score += 10;
  if ((info?.projects || []).length) score += 10;

  const longSummary = (info?.summary || "").length > 900;
  if (longSummary) score -= 10;

  return clamp(score, 0, 100);
}

function scoreKeywordMatch(info) {
  const keywords = jdKeywords(info);
  if (!keywords.length) {
    return {
      score: info?.targetJob?.description ? 50 : 0,
      matched: [],
      missing: [],
      note: info?.targetJob?.description
        ? "Add JD analysis for better keyword scoring"
        : "Paste a job description to enable keyword matching",
    };
  }

  const corpus = new Set(resumeCorpus(info));
  const matched = [];
  const missing = [];

  keywords.forEach((kw) => {
    if (corpus.has(kw) || [...corpus].some((t) => t.includes(kw) || kw.includes(t))) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  });

  const score = Math.round((matched.length / keywords.length) * 100);
  return {
    score,
    matched: unique(matched).slice(0, 20),
    missing: unique(missing).slice(0, 20),
  };
}

function scoreSkillsRelevance(info) {
  const required = (info?.targetJob?.insights?.requiredSkills || []).map((s) =>
    s.toLowerCase()
  );
  const userSkills = unique(
    (info?.skills || []).flatMap((s) => (s.items || []).map((i) => i.toLowerCase()))
  );

  if (!required.length) {
    return {
      score: userSkills.length ? 70 : 30,
      missing: [],
    };
  }

  const matched = required.filter((r) =>
    userSkills.some((u) => u.includes(r) || r.includes(u))
  );
  const missing = required.filter((r) => !matched.includes(r));
  const score = Math.round((matched.length / required.length) * 100);

  return { score, missing };
}

function scoreExperienceQuality(info) {
  const experiences = info?.experience || [];
  if (!experiences.length) return { score: 0, weakBullets: [] };

  const bullets = [];
  experiences.forEach((e) => {
    const html = e.workSummary || "";
    const items = html.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
    if (items.length) {
      items.forEach((li) => bullets.push(stripHtml(li).trim()));
    } else if (stripHtml(html).trim()) {
      bullets.push(stripHtml(html).trim());
    }
  });

  if (!bullets.length) return { score: 20, weakBullets: [] };

  let good = 0;
  const weakBullets = [];

  bullets.forEach((b) => {
    const strong = hasMetric(b) || actionVerbStart(b);
    if (strong) good += 1;
    else if (b.length < 120) weakBullets.push(b);
  });

  const score = Math.round((good / bullets.length) * 100);
  return { score, weakBullets: weakBullets.slice(0, 5) };
}

function scoreReadability(info) {
  const summaryLen = (info?.summary || "").trim().length;
  let score = 70;

  if (summaryLen >= 80 && summaryLen <= 600) score += 15;
  else if (summaryLen > 0) score += 5;

  const skillsCount = (info?.skills || []).reduce(
    (n, s) => n + (s.items || []).length,
    0
  );
  if (skillsCount >= 4 && skillsCount <= 30) score += 10;
  else if (skillsCount > 40) score -= 10;

  return clamp(score, 0, 100);
}

function scoreJdAlignment(info, keywordScore, skillsScore) {
  if (!info?.targetJob?.description && !info?.targetJob?.title) {
    return 0;
  }

  const title = (info?.targetJob?.title || "").toLowerCase();
  const personalTitle = (info?.personalDetails?.jobTitle || "").toLowerCase();
  let titleBoost = 0;
  if (title && personalTitle) {
    titleBoost =
      personalTitle.includes(title) || title.includes(personalTitle) ? 100 : 50;
  } else if (title || personalTitle) {
    titleBoost = 40;
  }

  return Math.round(
    keywordScore * 0.45 + skillsScore * 0.35 + titleBoost * 0.2
  );
}

/**
 * @returns {{ total: number, categories: object, recommendations: array, missingKeywords: string[], weakBullets: string[] }}
 */
export function calculateResumeScore(info) {
  const completeness = scoreCompleteness(info);
  const contact = scoreContact(info);
  const structure = scoreStructure(info);
  const keywords = scoreKeywordMatch(info);
  const skills = scoreSkillsRelevance(info);
  const experience = scoreExperienceQuality(info);
  const readability = scoreReadability(info);
  const alignment = scoreJdAlignment(info, keywords.score, skills.score);

  const weights = {
    completeness: 0.18,
    contact: 0.1,
    structure: 0.1,
    keywordMatch: 0.2,
    skillsRelevance: 0.14,
    experienceQuality: 0.14,
    jdAlignment: 0.1,
    readability: 0.04,
  };

  // If no JD, redistribute JD-related weight into completeness/structure/experience
  const hasJd = Boolean(
    info?.targetJob?.description || info?.targetJob?.insights
  );

  let total;
  if (!hasJd) {
    total = Math.round(
      completeness.score * 0.28 +
        contact * 0.15 +
        structure * 0.17 +
        experience.score * 0.25 +
        readability * 0.15
    );
  } else {
    total = Math.round(
      completeness.score * weights.completeness +
        contact * weights.contact +
        structure * weights.structure +
        keywords.score * weights.keywordMatch +
        skills.score * weights.skillsRelevance +
        experience.score * weights.experienceQuality +
        alignment * weights.jdAlignment +
        readability * weights.readability
    );
  }

  const recommendations = [];

  completeness.checks
    .filter((c) => !c.ok)
    .forEach((c) =>
      recommendations.push({ type: "warn", message: c.label, action: "edit" })
    );

  completeness.checks
    .filter((c) => c.ok)
    .forEach((c) =>
      recommendations.push({ type: "ok", message: c.label, action: null })
    );

  if (keywords.missing?.length) {
    recommendations.push({
      type: "warn",
      message: `Missing keywords: ${keywords.missing.slice(0, 5).join(", ")}`,
      action: "skills",
    });
  }

  if (skills.missing?.length) {
    recommendations.push({
      type: "warn",
      message: `Missing required skills: ${skills.missing.slice(0, 5).join(", ")}`,
      action: "skills",
    });
  }

  if (experience.weakBullets?.length) {
    recommendations.push({
      type: "warn",
      message: "Some experience bullets lack measurable impact",
      action: "experience",
    });
  }

  if (!hasJd) {
    recommendations.push({
      type: "warn",
      message: "Add a target job description to unlock ATS keyword scoring",
      action: "target",
    });
  }

  return {
    total: clamp(total, 0, 100),
    ready: Boolean(
      (info?.personalDetails?.firstName || info?.personalDetails?.lastName) &&
        info?.personalDetails?.email &&
        ((info?.experience || []).some(
          (e) => e.title || e.companyName || stripHtml(e.workSummary).trim()
        ) ||
          (info?.projects || []).some((p) => p.name || p.description) ||
          (info?.summary || "").trim().length >= 40)
    ),
    categories: {
      keywordMatch: keywords.score,
      skillsRelevance: skills.score,
      completeness: completeness.score,
      experienceQuality: experience.score,
      jdAlignment: hasJd ? alignment : null,
      structure,
      contact,
      readability,
    },
    recommendations,
    missingKeywords: keywords.missing || [],
    matchedKeywords: keywords.matched || [],
    weakBullets: experience.weakBullets || [],
    hasJd,
  };
}
