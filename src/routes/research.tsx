import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Search } from "lucide-react";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { AiOutput } from "@/components/AiOutput";
import { ResponsibleAiNotice } from "@/components/ResponsibleAiNotice";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { runResearch } from "@/lib/ai.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Summarise topics and articles into key insights, recommendations and considerations with AI.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      {
        property: "og:description",
        content: "Turn topics and articles into structured, useful research summaries.",
      },
    ],
  }),
  component: ResearchPage,
});

const MODES = ["Topic Summary", "Article Summary", "Key Insights", "Recommendations"];

function ResearchPage() {
  const run = useServerFn(runResearch);
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState<string>("Topic Summary");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!topic.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await run({ data: { topic, mode } });
      setOutput(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <PageHeader
        title="AI Research Assistant"
        description="Paste an article or enter a topic and get a structured, editable brief."
      />
      <div className="space-y-6">
        <ResponsibleAiNotice />

        <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="topic">Research topic or article text</Label>
            <Textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Hybrid work policies for mid-size teams — or paste an article here"
              className="min-h-[160px]"
            />
          </div>

          <div className="space-y-2 sm:max-w-xs">
            <Label>Output type</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MODES.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="accent"
            onClick={() => void generate()}
            disabled={loading || !topic.trim()}
          >
            <Search className="h-4 w-4" /> Research with AI
          </Button>
        </div>

        <AiOutput
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          onRegenerate={() => void generate()}
          onClear={() => {
            setOutput("");
            setError(null);
          }}
          canRegenerate={!!topic.trim()}
          emptyState="Your research brief will appear here with a summary, insights, recommendations and considerations."
        />
      </div>
    </AppLayout>
  );
}
