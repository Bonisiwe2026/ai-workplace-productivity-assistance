import { createFileRoute } from "@tanstack/react-router";
import { AppLayout, PageHeader } from "@/components/AppLayout";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "How the AI Workplace Productivity Assistant works: no accounts, no data storage, AI-powered tools.",
      },
      { property: "og:title", content: "Settings | AI Workplace Assistant" },
      {
        property: "og:description",
        content: "No accounts, no stored data — see how this assistant works.",
      },
    ],
  }),
  component: SettingsPage,
});

const ITEMS = [
  {
    title: "No account needed",
    body: "The assistant is open to use immediately. There is no sign-in, registration or user profile.",
  },
  {
    title: "Nothing is stored",
    body: "Your inputs and AI outputs live only in this browser tab. Refreshing or closing the page clears them.",
  },
  {
    title: "AI model",
    body: "Responses are generated live by Lovable AI. Output quality depends on the detail you provide in your prompt.",
  },
  {
    title: "Tone and length",
    body: "Tone and length are chosen per request inside the Smart Email Generator, so there is nothing to configure globally.",
  },
];

function SettingsPage() {
  return (
    <AppLayout>
      <PageHeader
        title="Settings"
        description="How this assistant works and what it does with your input."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {ITEMS.map((i) => (
          <div key={i.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">{i.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{i.body}</p>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
