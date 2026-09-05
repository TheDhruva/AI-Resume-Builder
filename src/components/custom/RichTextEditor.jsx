import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from "@/features/resumeEditor/ResumeInfoContext";
import { Brain, LoaderCircle } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
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
  Toolbar,
} from "react-simple-wysiwyg";
import { useAI } from "@/lib/AIModel";
import { sanitizeHtml } from "@/lib/utils";
import { toast } from "sonner";

function RichTextEditor({ onRichTextEditorChange, index, defaultValue = "" }) {
  const { resumeInfo } = useContext(ResumeInfoContext);
  const { generateExperienceBullets } = useAI();

  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValue(defaultValue || "");
  }, [defaultValue]);

  const generateAIContent = async () => {
    const experience = resumeInfo?.experience?.[index];

    if (!experience?.title) {
      toast.error("Please fill Position Title first.");
      return;
    }

    try {
      setLoading(true);
      const responseText = await generateExperienceBullets({
        positionTitle: experience.title,
        companyName: experience.companyName,
        targetJob: resumeInfo?.targetJob,
        existingSummary: experience.workSummary,
      });
      const cleanHTML = sanitizeHtml(responseText);
      setValue(cleanHTML);
      onRichTextEditorChange(cleanHTML);
      toast.success("AI generated experience bullets!");
    } catch (err) {
      console.error("AI Error:", err);
      toast.error(err?.message || "AI generation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center my-2">
        <label className="text-xs font-medium text-muted-foreground">
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

      <div className="border border-border rounded-md overflow-hidden bg-white">
        <EditorProvider>
          <Editor
            value={value}
            onChange={(e) => {
              const html = sanitizeHtml(e.target.value);
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
