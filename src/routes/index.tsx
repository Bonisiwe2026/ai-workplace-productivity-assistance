import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Search, MessagesSquare, ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Write emails, research topics and chat with AI. Work smarter, communicate better, get more done — no sign-up required.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Smart email generation, AI research and a workplace chatbot in one simple tool.",
      },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/email" as const,
    icon: Mail,
    title: "Smart Email Generator",
    desc: "Turn a short brief into a polished, professional email with the right tone and length.",
  },
  {
    to: "/research" as const,
    icon: Search,
    title: "AI Research Assistant",
    desc: "Summarise topics or articles into insights, recommendations and considerations.",
  },
  {
    to: "/chat" as const,
    icon: MessagesSquare,
    title: "AI Workplace Chat",
    desc: "Ask workplace questions and plan your day in a natural conversation with AI.",
  },
];

function Dashboard() {
  return (
    <AppLayout>
      <section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          AI Workplace Productivity Assistant
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Work smarter. Communicate better. Get more done.
        </p>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ to, icon: Icon, title, desc }) => (
          <div
            key={to}
            className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-foreground">{title}</h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{desc}</p>
            <Button asChild variant="accent" className="mt-5 w-full">
              <Link to={to}>
                Open tool <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
