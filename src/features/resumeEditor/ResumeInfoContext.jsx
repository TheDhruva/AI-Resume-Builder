// ResumeInfoContext.jsx
import { createContext } from "react";

/**
 * The context value shape:
 * {
 *   resumeInfo: <resumeDocumentFromDB|defaultDoc>,
 *   setResumeInfo: () => {}
 * }
 *
 * resumeDocumentFromDB should be the Convex document which contains:
 * { id, title, userId, createdAt, updatedAt, resumeInfo: { personalDetails, experience, education, skills, themeColor, summary } }
 */

export const ResumeInfoContext = createContext({
  // default resume document (matches Convex schema shape)
  resumeInfo: {
    // top-level fields that might exist on the resume document
    id: "",
    title: "",
    userId: "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    // nested resumeInfo object (this is what components consume)
    resumeInfo: {
      personalDetails: {
        firstName: "",
        lastName: "",
        jobTitle: "",
        email: "",
        phone: "",
        address: "",
      },
      experience: [],
      education: [],
      skills: [],
      themeColor: "#000000",
      summary: "",
    },
  },
  setResumeInfo: () => {},
});

export default ResumeInfoContext;
