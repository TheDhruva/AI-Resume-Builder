import React, { useEffect, useContext, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResumeInfoContext } from "@/features/resumeEditor/ResumeInfoContext";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useParams } from "react-router-dom";
import { Brain, Loader2 } from "lucide-react";
import { generateText } from "@/lib/AIModel"; // ✅ Gemini helper

function Summary({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const updateResumeInfo = useMutation(api.resumes.updateResumeInfo);
  const { id: resumeId } = useParams();

  const [summary, setSummary] = useState(
    resumeInfo?.summary ?? resumeInfo?.resumeInfo?.summary ?? ""
  );
  const [loading, setLoading] = useState(false);
  const [aiGeneratedSummaries, setAiGeneratedSummaries] = useState(null);
  const debounceRef = useRef(null);

  // ✅ Keep summary in sync with context
  useEffect(() => {
    setSummary(resumeInfo?.summary ?? resumeInfo?.resumeInfo?.summary ?? "");
  }, [resumeInfo]);

  // ✅ Update context for live preview
  useEffect(() => {
    setResumeInfo((prev) => {
      const hasNested = !!prev?.resumeInfo;
      return hasNested
        ? { ...prev, resumeInfo: { ...prev.resumeInfo, summary } }
        : { ...prev, summary };
    });
  }, [summary, setResumeInfo]);

  // ✅ Generate summaries using Gemini API
  const GenerateSummaryFromAI = async () => {
    const jobTitle =
      resumeInfo?.personalDetails?.jobTitle ||
      resumeInfo?.resumeInfo?.personalDetails?.jobTitle ||
      "Software Engineer";

    const prompt = `
      Act as an expert resume writer.
      Generate 3 professional resume summaries for the Job Title: "${jobTitle}".
      Construct them for 'EntryLevel', 'MidLevel', and 'SeniorLevel'.
      Constraints:
      1. Strictly avoid clichés like "passionate", "team player", etc.
      2. Focus on measurable impact, core hard skills, and action verbs.
      3. Keep it to 2–3 sentences max.
      4. Return ONLY a raw JSON object with keys 'EntryLevel', 'MidLevel', and 'SeniorLevel'. No extra text.
    `;

    try {
      setLoading(true);
      const aiResponse = await generateText(prompt);

      // ✅ Clean & safely parse Gemini output
      const cleanText = aiResponse.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanText);

      setAiGeneratedSummaries(parsed);
      toast.success("✅ AI summaries generated!");
    } catch (err) {
      console.error("❌ AI generation error:", err);
      toast.error("AI failed to generate. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save to Convex
  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateResumeInfo({
        resumeId,
        field: "resumeInfo",
        value: { ...resumeInfo?.resumeInfo, summary },
      });
      toast.success("✅ Summary saved!");
      enabledNext && enabledNext(true);
    } catch (err) {
      console.error("❌ Error saving summary:", err);
      toast.error("Failed to save summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-4 border-primary mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-bold text-lg text-gray-800">Summary</h2>
        <Button
          variant="outline"
          onClick={GenerateSummaryFromAI}
          disabled={loading}
          size="sm"
          className="flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Brain className="h-4 w-4" />
          )}
          Improve with AI
        </Button>
      </div>

      <p className="text-gray-500 mb-4">
        Add a concise 2–4 line professional summary tailored to your target role.
      </p>

      {/* Form */}
      <form className="mt-7" onSubmit={onSave}>
        <Textarea
          className="mt-2 min-h-[140px]"
          placeholder="Ex: Full-stack developer (React/Node) with 10+ shipped features..."
          required
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />

        <div className="mt-3 flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>

      <div className="mt-2 text-xs text-gray-500 text-right">
        {summary.length} chars
      </div>

      {/* ✅ AI Suggestions */}
      {aiGeneratedSummaries && (
        <div className="mt-6">
          <h2 className="font-bold text-lg mb-3">AI Suggestions</h2>
          {Object.entries(aiGeneratedSummaries).map(([level, text], index) => (
            <div
              key={index}
              className="mb-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition"
              onClick={() => setSummary(text)}
            >
              <h3 className="font-semibold text-primary">{level}</h3>
              <p className="text-sm text-gray-700">{text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Summary;
