/** Product flow: summary after evidence (experience/projects). */
export const EDITOR_SECTIONS = [
  { id: "basics", label: "Basics", short: "Basics" },
  { id: "target", label: "Target Job", short: "Target" },
  { id: "experience", label: "Experience", short: "Exp" },
  { id: "projects", label: "Projects", short: "Projects" },
  { id: "education", label: "Education", short: "Edu" },
  { id: "skills", label: "Skills", short: "Skills" },
  { id: "summary", label: "AI Summary", short: "Summary" },
  { id: "review", label: "Review", short: "Review" },
];

/** Map section id → navigation index for ScorePanel / Review deep links */
export const SECTION_INDEX = Object.fromEntries(
  EDITOR_SECTIONS.map((s, i) => [s.id, i])
);
