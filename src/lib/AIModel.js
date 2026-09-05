import { useAction } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { api } from "../../convex/_generated/api";

const SIGN_IN_AI_MSG =
  "Sign in to use AI. Guest mode keeps editing on this device only.";

/** Client AI helpers — Gemini runs in Convex actions (signed-in only). */
export function useAI() {
  const { isSignedIn } = useUser();
  const generateSummariesAction = useAction(api.ai.generateSummaries);
  const generateExperienceBulletsAction = useAction(
    api.ai.generateExperienceBullets
  );
  const analyzeJobDescriptionAction = useAction(api.ai.analyzeJobDescription);
  const improveSectionAction = useAction(api.ai.improveSection);
  const generateProjectBulletsAction = useAction(api.ai.generateProjectBullets);
  const generateTextAction = useAction(api.ai.generateText);

  const requireAuth = async (fn, args) => {
    if (!isSignedIn) throw new Error(SIGN_IN_AI_MSG);
    return fn(args);
  };

  return {
    generateSummaries: (args) => requireAuth(generateSummariesAction, args),
    generateExperienceBullets: (args) =>
      requireAuth(generateExperienceBulletsAction, args),
    analyzeJobDescription: (args) =>
      requireAuth(analyzeJobDescriptionAction, args),
    improveSection: (args) => requireAuth(improveSectionAction, args),
    generateProjectBullets: (args) =>
      requireAuth(generateProjectBulletsAction, args),
    generateText: (prompt) =>
      requireAuth(generateTextAction, { prompt }),
  };
}

export function useGenerateText() {
  const { generateText } = useAI();
  return generateText;
}
