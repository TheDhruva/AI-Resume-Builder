import { createContext } from "react";
import { createEmptyResumeInfo } from "@/lib/normalizeResume";

export const ResumeInfoContext = createContext({
  resumeInfo: createEmptyResumeInfo(),
  setResumeInfo: () => {},
  resumeMeta: { id: "", title: "" },
});

export default ResumeInfoContext;
