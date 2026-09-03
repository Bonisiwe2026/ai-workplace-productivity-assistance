import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { Send, Plus, Trash2, Copy, AlertTriangle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { AppLayout, PageHeader } from "@/components/AppLayout";
import { ResponsibleAiNotice } from "@/components/ResponsibleAiNotice";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chatWithAI } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chat | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Ask workplace questions, plan your day and get clear AI answers in a simple chat interface.",
      },
      { property: "og:title", content: "AI Workplace Chat" },
      {
        property: "og:description",
        content: "A workplace chatbot for emails, planning and productivity questions.",
      },
    ],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Help me write a professional email.",
  "Summarise this information.",
  "How can I improve my productivity?",
  "Help me plan my workday.",
];

function ChatPage() {
  const send = useServerFn(chatWithAI);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function ask(history: Msg[]) {
    setLoading(true);
    setError(null);
    try {
      const res = await send({ data: { messages: history } });
      setMessages([...history, { role: "assistant", content: res.text }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    void ask(next);
  }

  function retry() {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    const idx = messages.lastIndexOf(lastUser);
    void ask(messages.slice(0, idx + 1));
  }

  function reset() {
    setMessages([]);
    setInput("");
    setError(null);
  }

  return (
    <AppLayout>
      <PageHeader
        title="AI Workplace Chat"
        description="Ask anything about your work — writing, planning, prioritising or summarising."
      />
      <div className="space-y-4">
        <ResponsibleAiNotice />

        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={reset}>
            <Plus className="h-4 w-4" /> New Chat
          </Button>
          <Button size="sm" variant="ghost" onClick={reset} disabled={messages.length === 0}>
            <Trash2 className="h-4 w-4" /> Clear Chat
          </Button>
        </div>

        <div className="flex min-h-[420px] flex-col rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.length === 0 && !loading && (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <p className="mt-4 text-sm font-medium text-foreground">
                  Start a conversation
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Try one of these prompts:</p>
                <div className="mx-auto mt-4 flex max-w-lg flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => submit(s)}
                      className="rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "flex justify-end" : "flex flex-col items-start"}
              >
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                      : "max-w-[90%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-secondary px-4 py-2.5 text-sm text-foreground"
                  }
                >
                  {m.content}
                </div>
                {m.role === "assistant" && (
                  <button
                    onClick={() => {
                      void navigator.clipboard.writeText(m.content);
                      toast.success("Response copied");
                    }}
                    className="mt-1.5 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Copy className="h-3 w-3" /> Copy Response
                  </button>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                AI is thinking...
              </div>
            )}

            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
                <div className="space-y-2">
                  <p className="text-sm text-foreground">{error}</p>
                  <Button size="sm" variant="accent" onClick={retry}>
                    Try Again
                  </Button>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="flex items-end gap-2 border-t border-border p-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(input);
                }
              }}
              placeholder="Ask a workplace question..."
              className="max-h-40 min-h-[44px] resize-none"
            />
            <Button
              variant="accent"
              size="icon"
              aria-label="Send message"
              onClick={() => submit(input)}
              disabled={loading || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
