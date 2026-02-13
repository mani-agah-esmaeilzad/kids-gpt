import { prisma } from "@/lib/db";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export type ChatCompletionOptions = {
  model?: string;
  temperature?: number;
  maxTokens?: number;
};

export type CompletionResult = {
  content: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  raw?: any;
};

export async function getAiConfig() {
  const fallback = {
    defaultModel: process.env.AVALAI_DEFAULT_MODEL || "gpt-4o-mini",
    safetyModel: process.env.AVALAI_SAFETY_MODEL || "gpt-4o-mini",
    temperature: 0.6,
    maxTokens: 800
  };
  try {
    const config = await prisma.appConfig.findUnique({
      where: { key: "ai.models" }
    });
    if (!config) return fallback;
    return { ...fallback, ...(config.value as any) };
  } catch {
    return fallback;
  }
}

export async function createChatCompletion(
  messages: ChatMessage[],
  options: ChatCompletionOptions = {}
): Promise<CompletionResult> {
  const config = await getAiConfig();
  const baseUrl = process.env.AVALAI_BASE_URL || "https://api.avalai.ir";
  const apiKey = process.env.AVALAI_API_KEY;
  if (!apiKey) {
    throw new Error("AVALAI_API_KEY is missing");
  }

  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: options.model ?? config.defaultModel,
      messages,
      temperature: options.temperature ?? config.temperature,
      max_tokens: options.maxTokens ?? config.maxTokens,
      stream: false
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AvalAI error: ${response.status} ${text}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content ?? "";
  return {
    content,
    usage: data?.usage,
    raw: data
  };
}

export function streamText(text: string, meta?: Record<string, unknown>) {
  const encoder = new TextEncoder();
  let index = 0;
  const chunkSize = 32;
  let sentMeta = false;
  return new ReadableStream({
    pull(controller) {
      if (!sentMeta && meta) {
        controller.enqueue(
          encoder.encode(`event: meta\ndata: ${JSON.stringify(meta)}\n\n`)
        );
        sentMeta = true;
      }
      if (index >= text.length) {
        controller.enqueue(encoder.encode("event: done\ndata: [DONE]\n\n"));
        controller.close();
        return;
      }
      const chunk = text.slice(index, index + chunkSize);
      index += chunkSize;
      controller.enqueue(
        encoder.encode(`event: delta\ndata: ${JSON.stringify({ content: chunk })}\n\n`)
      );
    }
  });
}
