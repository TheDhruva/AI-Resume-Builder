import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from "@/features/resumeEditor/ResumeInfoContext";
import { Brain, LoaderCircle } from "lucide-react";
import React, { useContext, useState } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnUnderline,
  Editor,
  EditorProvider,
  Separator,
  Toolbar
} from "react-simple-wysiwyg";

import { generateText } from "@/lib/AIModel";
import { toast } from "sonner";

const PROMPT = `
Position Title: {positionTitle}
Generate 5–7 resume bullet points for this job.

Rules:
- No experience level
- No JSON
- Return ONLY valid HTML (<ul><li>…</li></ul>)
- Bullets must use action verbs + measurable impact
`;

function RichTextEditor({ onRichTextEditorChange, index, defaultValue = "" }) {
  const [value, setValue] = useState(defaultValue);
  const { resumeInfo } = useContext(ResumeInfoContext);
  const [loading, setLoading] = useState(false);

  const generateAIContent = async () => {
    const experience =
      resumeInfo?.resumeInfo?.experience?.[index];  // ✅ FIXED PATH

    if (!experience?.title) {
      toast.error("Please fill Position Title first.");
      return;
    }

    try {
      setLoading(true);

      const prompt = PROMPT.replace("{positionTitle}", experience.title);

      const responseText = await generateText(prompt);

      // Clean any markdown/formatting
      const cleanHTML = responseText.replace(/```html|```json|```/g, "").trim();

      setValue(cleanHTML);
      onRichTextEditorChange(cleanHTML); // pass HTML string upward

      toast.success("AI generated experience summary!");
    } catch (err) {
      console.error("AI Error:", err);
      toast.error("AI generation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between my-2">
        <label className="text-xs">Summary</label>

        <Button
          variant="outline"
          size="sm"
          onClick={generateAIContent}
          disabled={loading}
          className="flex gap-2 border-primary text-primary"
        >
          {loading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <>
              <Brain className="h-4 w-4" /> Generate with AI
            </>
          )}
        </Button>
      </div>

      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => {
            const html = e.target.value;
            setValue(html);
            onRichTextEditorChange(html); // send plain HTML
          }}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />

            <Separator />

            <BtnNumberedList />
            <BtnBulletList />

            <Separator />

            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
}

export default RichTextEditor;
