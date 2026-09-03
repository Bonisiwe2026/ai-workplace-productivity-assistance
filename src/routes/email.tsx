import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Wand2 } from "lucide-react";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { AiOutput } from "@/components/AiOutput";
import { ResponsibleAiNotice } from "@/components/ResponsibleAiNotice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Generate professional workplace emails with the tone and length you need, ready to edit and send.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Generate professional workplace emails in seconds with AI.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState("Formal");
  const [length, setLength] = useState("Medium");
  const [instructions, setInstructions] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!purpose.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await run({ data: { purpose, recipient, tone, length, instructions } });
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
        title="Smart Email Generator"
        description="Describe what you need to say and get a professional, editable email."
      />
      <div className="space-y-6">
        <ResponsibleAiNotice />

        <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="purpose">Email purpose</Label>
            <Textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Request a deadline extension for the quarterly report"
              className="min-h-[90px]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. My manager"
              />
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Formal", "Friendly", "Persuasive"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Length</Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Short", "Medium", "Detailed"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Additional instructions</Label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Optional: points to include, deadlines you have already confirmed, sign-off name"
            />
          </div>

          <Button
            variant="accent"
            onClick={() => void generate()}
            disabled={loading || !purpose.trim()}
          >
            <Wand2 className="h-4 w-4" /> Generate Email
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
          canRegenerate={!!purpose.trim()}
          emptyState="Your generated email will appear here, ready to edit."
        />
      </div>
    </AppLayout>
  );
}
