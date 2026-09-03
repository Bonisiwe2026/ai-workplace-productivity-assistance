import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { ResponsibleAiNotice } from "@/components/ResponsibleAiNotice";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Guidance on using AI-generated workplace content responsibly: verify outputs and never share confidential information.",
      },
      { property: "og:title", content: "Responsible AI" },
      {
        property: "og:description",
        content: "Verify AI output and keep confidential workplace information out of prompts.",
      },
    ],
  }),
  component: ResponsibleAiPage,
});

const POINTS = [
  {
    title: "Always review before you send",
    body: "Treat every output as a first draft. Check facts, names, dates and figures against your own sources before acting on them.",
  },
  {
    title: "Keep sensitive information out",
    body: "Do not paste confidential contracts, client data, personal information, credentials or anything covered by an NDA.",
  },
  {
    title: "The AI will not invent details",
    body: "The assistant is instructed to use placeholders instead of guessing specifics, and to say when something is uncertain.",
  },
  {
    title: "You stay accountable",
    body: "AI supports your judgement — it does not replace it. High-impact professional, legal or financial decisions need human review.",
  },
];

function ResponsibleAiPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Responsible AI"
        description="How to get value from this assistant safely and responsibly."
      />
      <div className="space-y-6">
        <ResponsibleAiNotice />
        <div className="grid gap-4 sm:grid-cols-2">
          {POINTS.map((p) => (
            <div key={p.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-foreground">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
