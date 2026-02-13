import { z } from "zod";
import { createChatCompletion, getAiConfig } from "@/lib/avalai";
import type { IncidentType } from "@prisma/client";
import { prisma } from "@/lib/db";

export type SafetyAction = "ALLOW" | "REFUSE" | "ESCALATE";

export type SafetyResult = {
  action: SafetyAction;
  type: IncidentType;
  reason: string;
  matched?: string[];
};

const piiPatterns: { label: string; regex: RegExp }[] = [
  { label: "email", regex: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi },
  { label: "phone", regex: /(?:(?:\+98|0098|0)?9\d{9})/g },
  { label: "address", regex: /(خیابان|کوچه|پلاک|کدپستی|آدرس|محله|بلوار|چهارراه)/gi }
];

const ruleSets: { type: IncidentType; patterns: RegExp[]; action: SafetyAction }[] = [
  {
    type: "SEXUAL",
    action: "REFUSE",
    patterns: [
      /سکس|sex|nude|nudes|porn|porno|برهنه|پورن|تصاویر\s+18/gi
    ]
  },
  {
    type: "VIOLENCE",
    action: "REFUSE",
    patterns: [/خون|قتل|کشتن|بمب|خودکشی|gore|blood/gi]
  },
  {
    type: "SELF_HARM",
    action: "ESCALATE",
    patterns: [/خودکشی|آسیب\s+زدن\s+به\s+خود|self-harm/gi]
  },
  {
    type: "ILLEGAL",
    action: "REFUSE",
    patterns: [/مواد\s+مخدر|ساخت\s+مواد|هک|سرقت|قفل\s+شکنی|hack/gi]
  },
  {
    type: "GROOMING",
    action: "REFUSE",
    patterns: [/دوست\s+پسر|دوست\s+دختر|رابطه\s+مخفی|مخفی\s+نگه\s+دار|secret/gi]
  }
];

const safetySchema = z.object({
  action: z.enum(["ALLOW", "REFUSE", "ESCALATE"]),
  type: z.enum(["PII", "SELF_HARM", "SEXUAL", "VIOLENCE", "ILLEGAL", "GROOMING", "OTHER"]),
  reason: z.string().min(2),
  confidence: z.number().min(0).max(1).optional()
});

export function detectPII(text: string) {
  const matches: string[] = [];
  for (const { regex } of piiPatterns) {
    const found = text.match(regex);
    if (found) matches.push(...found);
  }
  return matches;
}

export function rulesClassify(text: string): SafetyResult | null {
  for (const rule of ruleSets) {
    for (const pattern of rule.patterns) {
      if (pattern.test(text)) {
        return {
          action: rule.action,
          type: rule.type,
          reason: "rule-match"
        };
      }
    }
  }
  return null;
}

export async function safetyClassify(text: string): Promise<SafetyResult> {
  const pii = detectPII(text);
  if (pii.length > 0) {
    return {
      action: "REFUSE",
      type: "PII",
      reason: "pii-detected",
      matched: pii
    };
  }

  const ruleResult = rulesClassify(text);
  if (ruleResult) return ruleResult;

  try {
    const keywordConfig = await prisma.appConfig.findUnique({
      where: { key: "safety.keywords" }
    });
    const blocklist = (keywordConfig?.value as any)?.blocklist ?? [];
    if (blocklist.some((keyword: string) => keyword && text.includes(keyword))) {
      return { action: "REFUSE", type: "OTHER", reason: "keyword-block" };
    }
  } catch {
    // ignore keyword config failures
  }

  const config = await getAiConfig();
  if (!process.env.AVALAI_API_KEY) {
    return { action: "ALLOW", type: "OTHER", reason: "no-safety-key" };
  }

  try {
    const safetyPrompt = `You are a safety classifier for a Persian child-safe chatbot (under 16).\nClassify the message. Return JSON only with: action (ALLOW|REFUSE|ESCALATE), type (PII|SELF_HARM|SEXUAL|VIOLENCE|ILLEGAL|GROOMING|OTHER), reason, confidence (0-1).`;
    const result = await createChatCompletion(
      [
        { role: "system", content: safetyPrompt },
        { role: "user", content: text }
      ],
      { model: config.safetyModel, temperature: 0.1, maxTokens: 120 }
    );

    const jsonMatch = result.content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { action: "ALLOW", type: "OTHER", reason: "safety-parse" };
    }
    const parsed = safetySchema.safeParse(JSON.parse(jsonMatch[0]));
    if (!parsed.success) {
      return { action: "ALLOW", type: "OTHER", reason: "safety-parse" };
    }
    return parsed.data as SafetyResult;
  } catch {
    return { action: "ALLOW", type: "OTHER", reason: "safety-error" };
  }
}

export function buildRefusalMessage(action: SafetyAction, type: IncidentType) {
  if (action === "ESCALATE") {
    return "الان نمی‌تونم کمک کنم. بیا با یک بزرگ‌تر قابل اعتماد صحبت کنیم. اگر دوست داری باهم یک فعالیت امن و آرامش‌بخش انجام بدیم.";
  }
  if (type === "PII") {
    return "من نمی‌تونم اطلاعات شخصی رو بگیرم یا ذخیره کنم. لطفا چیزهای شخصی مثل شماره، آدرس یا مدرسه‌ات رو نگوییم. بیا درباره یک موضوع امن حرف بزنیم.";
  }
  return "متأسفم، نمی‌تونم درباره این موضوع کمک کنم. بیا درباره چیزهای امن مثل داستان، علم، هنر یا بازی صحبت کنیم.";
}
