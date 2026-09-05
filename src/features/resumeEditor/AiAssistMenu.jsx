import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAI } from "@/lib/AIModel";
import { toast } from "sonner";

const ACTIONS = [
  { id: "improve", label: "Improve" },
  { id: "rewrite", label: "Rewrite" },
  { id: "concise", label: "Make concise" },
  { id: "professional", label: "More professional" },
  { id: "technical", label: "More technical" },
  { id: "metrics", label: "Add measurable impact" },
  { id: "tailor", label: "Tailor to job" },
  { id: "bullets", label: "Turn into bullets" },
];

/**
 * Compact AI assist control — opens a menu of actions.
 */
export default function AiAssistMenu({
  section,
  content,
  context,
  targetJob,
  onResult,
  allowedActions,
  label = "Improve with AI",
  size = "sm",
}) {
  const { improveSection } = useAI();
  const [loading, setLoading] = useState(false);

  const actions = ACTIONS.filter((a) =>
    allowedActions ? allowedActions.includes(a.id) : a.id !== "bullets"
  );

  const run = async (actionId) => {
    try {
      setLoading(true);
      const result = await improveSection({
        section,
        action: actionId,
        content: content || "",
        context: context || {},
        targetJob: targetJob || null,
      });
      onResult?.(result);
      toast.success("AI suggestion applied");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "AI request failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size={size}
          disabled={loading}
          aria-busy={loading}
          className="gap-1.5 shrink-0"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 text-accent-ai" />
          )}
          <span className="hidden xs:inline sm:inline">{label}</span>
          <span className="sm:hidden">AI</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>AI assistance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.id}
            onSelect={(e) => {
              e.preventDefault();
              run(action.id);
            }}
          >
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
