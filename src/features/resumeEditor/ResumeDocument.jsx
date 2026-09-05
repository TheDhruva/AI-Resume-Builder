import React from "react";
import { normalizeResumeInfo } from "@/lib/normalizeResume";
import { sanitizeHtml } from "@/lib/utils";

function hasText(v) {
  return Boolean(String(v || "").trim());
}

function SectionTitle({ children, accent, modern }) {
  return (
    <div className="mb-2">
      <h2
        className={`font-semibold uppercase tracking-wide ${
          modern ? "text-[11px]" : "text-[12px]"
        }`}
        style={{ color: accent }}
      >
        {children}
      </h2>
      <hr className="mt-1 border-t" style={{ borderColor: accent }} />
    </div>
  );
}

function PersonalHeader({ info, accent, modern, mode }) {
  const p = info.personalDetails || {};
  const name = [p.firstName, p.lastName].filter(Boolean).join(" ");
  const showPlaceholders = mode === "edit";

  const displayName = name || (showPlaceholders ? "Your Name" : "");
  if (!displayName && !showPlaceholders) return null;

  const contact = [p.address, p.phone, p.email].filter(Boolean).join(" • ");
  const links = [p.linkedin, p.github, p.portfolio].filter(Boolean);

  return (
    <header className={modern ? "mb-5 text-left" : "mb-4 text-center"}>
      {modern && (
        <div
          className="h-1.5 w-16 mb-3 rounded-sm"
          style={{ backgroundColor: accent }}
        />
      )}
      <h1
        className={`font-bold leading-tight ${
          modern ? "text-2xl" : "text-xl"
        }`}
        style={{ color: accent }}
      >
        {displayName}
      </h1>
      {(p.jobTitle || showPlaceholders) && (
        <p
          className={`mt-1 ${modern ? "text-sm font-medium" : "text-sm"}`}
          style={{ color: modern ? "#111827" : accent }}
        >
          {p.jobTitle || (showPlaceholders ? "Target job title" : "")}
        </p>
      )}
      {contact ? (
        <p className="mt-1 text-xs text-neutral-600">{contact}</p>
      ) : showPlaceholders ? (
        <p className="mt-1 text-xs text-neutral-400">
          Location • Phone • Email
        </p>
      ) : null}
      {links.length > 0 && (
        <p className="mt-1 text-xs text-neutral-600 break-all">
          {links.join(" • ")}
        </p>
      )}
      {!modern && (
        <hr
          className="mt-3 border-t-[1.5px]"
          style={{ borderColor: accent }}
        />
      )}
    </header>
  );
}

function SummaryBlock({ info, accent, modern, mode }) {
  const summary = info.summary?.trim();
  if (!summary && mode !== "edit") return null;
  if (!summary && mode === "edit") {
    return (
      <section className="mb-4">
        <SectionTitle accent={accent} modern={modern}>
          Summary
        </SectionTitle>
        <p className="text-xs text-neutral-400">
          Your professional summary will appear here.
        </p>
      </section>
    );
  }

  return (
    <section className="mb-4">
      <SectionTitle accent={accent} modern={modern}>
        Summary
      </SectionTitle>
      <p className="text-xs leading-relaxed text-neutral-800 whitespace-pre-wrap">
        {summary}
      </p>
    </section>
  );
}

function ExperienceBlock({ info, accent, modern, mode }) {
  const list = (info.experience || []).filter(
    (e) =>
      hasText(e.title) ||
      hasText(e.companyName) ||
      hasText(e.workSummary)
  );

  if (!list.length && mode !== "edit") return null;

  return (
    <section className="mb-4">
      <SectionTitle accent={accent} modern={modern}>
        Experience
      </SectionTitle>
      {!list.length ? (
        <p className="text-xs text-neutral-400">No experience added yet.</p>
      ) : (
        list.map((exp, i) => (
          <div key={i} className="mb-3">
            <div className="flex flex-wrap items-baseline justify-between gap-x-2">
              <h3 className="text-sm font-bold text-neutral-900">
                {exp.title || "Role"}
              </h3>
              <span className="text-[11px] text-neutral-600">
                {exp.startDate || ""}
                {(exp.startDate || exp.endDate || exp.currentlyWorking) &&
                  " – "}
                {exp.currentlyWorking ? "Present" : exp.endDate || ""}
              </span>
            </div>
            <p className="text-xs font-medium text-neutral-700">
              {[exp.companyName, exp.city, exp.state].filter(Boolean).join(", ")}
            </p>
            {hasText(exp.workSummary) && (
              <div
                className="resume-richtext mt-1 text-xs text-neutral-800"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(exp.workSummary),
                }}
              />
            )}
          </div>
        ))
      )}
    </section>
  );
}

function ProjectsBlock({ info, accent, modern, mode }) {
  const list = (info.projects || []).filter(
    (p) => hasText(p.name) || hasText(p.description)
  );

  if (!list.length && mode !== "edit") return null;
  if (!list.length) return null;

  return (
    <section className="mb-4">
      <SectionTitle accent={accent} modern={modern}>
        Projects
      </SectionTitle>
      {list.map((project, i) => (
        <div key={i} className="mb-3">
          <div className="flex flex-wrap items-baseline justify-between gap-x-2">
            <h3 className="text-sm font-bold text-neutral-900">
              {project.name || "Project"}
            </h3>
            {project.role && (
              <span className="text-[11px] text-neutral-600">{project.role}</span>
            )}
          </div>
          {(project.technologies || []).length > 0 && (
            <p className="text-[11px] text-neutral-600">
              {(project.technologies || []).join(" · ")}
            </p>
          )}
          {hasText(project.description) && (
            <div
              className="resume-richtext mt-1 text-xs text-neutral-800"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(
                  project.description.includes("<")
                    ? project.description
                    : `<p>${project.description}</p>`
                ),
              }}
            />
          )}
          <p className="text-[11px] text-neutral-500 mt-0.5">
            {[project.projectUrl, project.githubUrl].filter(Boolean).join(" · ")}
          </p>
        </div>
      ))}
    </section>
  );
}

function EducationBlock({ info, accent, modern, mode }) {
  const list = (info.education || []).filter(
    (e) => hasText(e.universityName) || hasText(e.degree)
  );

  if (!list.length && mode !== "edit") return null;

  return (
    <section className="mb-4">
      <SectionTitle accent={accent} modern={modern}>
        Education
      </SectionTitle>
      {!list.length ? (
        <p className="text-xs text-neutral-400">No education added yet.</p>
      ) : (
        list.map((ed, i) => (
          <div key={i} className="mb-3">
            <div className="flex flex-wrap items-baseline justify-between gap-x-2">
              <h3 className="text-sm font-bold" style={{ color: accent }}>
                {ed.universityName || "University"}
              </h3>
              <span className="text-[11px] text-neutral-600">
                {[ed.startDate, ed.endDate].filter(Boolean).join(" – ")}
              </span>
            </div>
            <p className="text-xs font-semibold text-neutral-800">
              {[ed.degree, ed.major ? `(${ed.major})` : ""].filter(Boolean).join(" ")}
            </p>
            {hasText(ed.description) && (
              <p className="text-xs mt-1 text-neutral-700 whitespace-pre-wrap">
                {ed.description}
              </p>
            )}
          </div>
        ))
      )}
    </section>
  );
}

function SkillsBlock({ info, accent, modern, mode }) {
  const list = (info.skills || []).filter((s) => (s.items || []).length > 0);

  if (!list.length && mode !== "edit") return null;

  return (
    <section className="mb-1">
      <SectionTitle accent={accent} modern={modern}>
        Skills
      </SectionTitle>
      {!list.length ? (
        <p className="text-xs text-neutral-400">No skills added yet.</p>
      ) : (
        <div className="space-y-1.5">
          {list.map((skill, i) => (
            <p key={i} className="text-xs text-neutral-800">
              <span className="font-semibold">
                {skill.category || "Skills"}:
              </span>{" "}
              {(skill.items || []).join(", ")}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}

/**
 * Canonical A4 resume document — used by editor preview, view, print, and public share.
 *
 * mode: "edit" | "final"
 *   edit  → may show soft placeholders (never used for print/share)
 *   final → omit empty sections, no placeholder text
 */
export default function ResumeDocument({
  resumeInfo,
  mode = "final",
  className = "",
}) {
  const info = normalizeResumeInfo(resumeInfo);
  const accent = info.theme?.accent || "#1E3A8A";
  const modern = info.theme?.layout === "modern";

  return (
    <article
      className={`resume-document bg-white text-neutral-900 ${
        modern ? "resume-layout-modern" : "resume-layout-classic"
      } ${className}`}
      data-layout={modern ? "modern" : "classic"}
      style={{
        // Fixed A4 width in px so preview scaling math is stable across browsers
        width: `${(210 * 96) / 25.4}px`,
        minHeight: `${(297 * 96) / 25.4}px`,
        padding: modern ? "14mm 16mm" : "16mm 18mm",
        boxSizing: "border-box",
      }}
    >
      <PersonalHeader
        info={info}
        accent={accent}
        modern={modern}
        mode={mode}
      />
      <SummaryBlock info={info} accent={accent} modern={modern} mode={mode} />
      <ExperienceBlock
        info={info}
        accent={accent}
        modern={modern}
        mode={mode}
      />
      <ProjectsBlock info={info} accent={accent} modern={modern} mode={mode} />
      <EducationBlock
        info={info}
        accent={accent}
        modern={modern}
        mode={mode}
      />
      <SkillsBlock info={info} accent={accent} modern={modern} mode={mode} />
    </article>
  );
}
