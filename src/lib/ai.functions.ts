import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GUARDRAIL =
  "You are a professional workplace productivity assistant. Be clear, concise and useful. " +
  "Never invent facts, names, dates, numbers or details the user has not provided — use neutral placeholders like [Name] instead. " +
  "If something is uncertain or missing, say so plainly. Use plain text (no markdown asterisks).";

async function callAI(messages: Array<{ role: string; content: string }>) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured.");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({ model: "google/gemini-3.7-flash", messages }),
  });

  if (!res.ok) {
    const body = await res.text();
    if (res.status === 429) throw new Error("Too many requests right now. Please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits are exhausted for this workspace.");
    throw new Error(`AI request failed (${res.status}). ${body.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("The AI returned an empty response. Please try again.");
  return text;
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        purpose: z.string().min(1),
        recipient: z.string().default(""),
        tone: z.string().default("Formal"),
        length: z.string().default("Medium"),
        instructions: z.string().default(""),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const text = await callAI([
      { role: "system", content: GUARDRAIL },
      {
        role: "user",
        content: [
          "Write a workplace email.",
          `Purpose: ${data.purpose}`,
          `Recipient: ${data.recipient || "not specified"}`,
          `Tone: ${data.tone}`,
          `Length: ${data.length} (Short = under 100 words, Medium = 100-180 words, Detailed = 200-300 words)`,
          `Additional instructions: ${data.instructions || "none"}`,
          "",
          "Return exactly this structure in plain text:",
          "Subject: <subject line>",
          "",
          "<greeting>",
          "",
          "<email body paragraphs>",
          "",
          "<closing and sign-off>",
        ].join("\n"),
      },
    ]);
    return { text };
  });

export const runResearch = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        topic: z.string().min(1),
        mode: z.string().default("Topic Summary"),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const text = await callAI([
      { role: "system", content: GUARDRAIL },
      {
        role: "user",
        content: [
          `Research task type: ${data.mode}.`,
          "Input from the user (topic or article text):",
          data.topic,
          "",
          "Respond in plain text using exactly these four headings, each followed by concise content:",
          "Summary",
          "Key Insights",
          "Recommendations",
          "Important Considerations",
        ].join("\n"),
      },
    ]);
    return { text };
  });

export const chatWithAI = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        messages: z
          .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
          .min(1),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const text = await callAI([
      {
        role: "system",
        content:
          GUARDRAIL +
          " You are answering workplace questions: email writing, productivity, planning, summarising and communication.",
      },
      ...data.messages.slice(-20),
    ]);
    return { text };
  });
