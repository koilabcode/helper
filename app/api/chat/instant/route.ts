import { streamText } from "ai";
import { corsOptions, withWidgetAuth } from "@/app/api/widget/utils";
import { CHAT_MODEL } from "@/lib/ai/core";
import { getLaborarioKnowledge } from "@/lib/ai/laborarioKnowledge";
import openai from "@/lib/ai/openai";
import { CHAT_SYSTEM_PROMPT } from "@/lib/ai/prompts";

export const maxDuration = 60;

export const OPTIONS = () => corsOptions("POST");

const buildSystemPrompt = (mailboxName: string): string => {
  let prompt = CHAT_SYSTEM_PROMPT.replace(/MAILBOX_NAME/g, mailboxName).replace(
    "{{CURRENT_DATE}}",
    new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  );

  const knowledge = getLaborarioKnowledge();
  if (knowledge) {
    prompt += `\n\n${knowledge}`;
  }

  return prompt;
};

export const POST = withWidgetAuth(async ({ request }, { mailbox }) => {
  const { messages }: { messages: Array<{ role: "user" | "assistant"; content: string }> } = await request.json();

  const systemPrompt = buildSystemPrompt(mailbox.name);

  const result = streamText({
    model: openai(CHAT_MODEL, { structuredOutputs: false }),
    system: systemPrompt,
    messages,
    maxSteps: 1,
  });

  const response = result.toDataStreamResponse();

  // Add CORS headers
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");

  return response;
});
