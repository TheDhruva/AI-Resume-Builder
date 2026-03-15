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

Generate 5–7 professional resume bullet points for this role.

Rules:
- Use action verbs
- Include measurable impact
- Do not include experience level
- Return ONLY valid HTML (<ul><li>...</li></ul>)
`;

function RichTextEditor({ onRichTextEditorChange, index, defaultValue = "" }) {

  const { resumeInfo } = useContext(ResumeInfoContext);

  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(false);

  const generateAIContent = async () => {

    const experience = resumeInfo?.experience?.[index];

    if (!experience?.title) {
      toast.error("Please fill Position Title first.");
      return;
    }

    try {

      setLoading(true);

      const prompt = PROMPT.replace(
        "{positionTitle}",
        experience.title
      );

      const responseText = await generateText(prompt);

      // Extract <ul> block safely
      const match = responseText.match(/<ul[\s\S]*<\/ul>/i);
      const cleanHTML = match ? match[0] : responseText.trim();

      setValue(cleanHTML);
      onRichTextEditorChange(cleanHTML);

      toast.success("AI generated experience bullets!");

    } catch (err) {

      console.error("AI Error:", err);
      toast.error("AI generation failed.");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div>

      {/* Header */}
      <div className="flex justify-between items-center my-2">

        <label className="text-xs font-medium text-brand-muted">
          Summary
        </label>

        <Button
          variant="outline"
          size="sm"
          onClick={generateAIContent}
          disabled={loading}
          className="flex gap-2"
        >

          {loading ? (
            <>
              <LoaderCircle className="animate-spin h-4 w-4" />
              Generating
            </>
          ) : (
            <>
              <Brain className="h-4 w-4" />
              Generate with AI
            </>
          )}

        </Button>

      </div>

      {/* Editor */}
      <div className="border border-brand-border rounded-md overflow-hidden bg-white">

        <EditorProvider>

          <Editor
            value={value}
            onChange={(e) => {

              const html = e.target.value;

              setValue(html);
              onRichTextEditorChange(html);

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

    </div>
  );
}

export default RichTextEditor;
