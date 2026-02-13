import { AgeGroup } from "@prisma/client";
import { prisma } from "@/lib/db";

const basePrompt = `تو یک دستیار فارسی امن و مهربان برای کودکان هستی.\n- هرگز اطلاعات شخصی نخواه.\n- هرگز توصیه خطرناک، خشونت‌گرا، جنسی یا غیرقانونی ارائه نکن.\n- پاسخ‌ها کوتاه، دوستانه و آموزشی باشند.\n- اگر موضوع نامناسب بود، با مهربانی رد کن و پیشنهاد امن بده.`;

export async function getAgeSystemPrompt(ageGroup: AgeGroup) {
  const config = await prisma.appConfig.findUnique({ where: { key: "policy.prompts" } });
  const overrides = (config?.value as any) ?? {};
  const base = overrides.base ?? basePrompt;
  const agePrompt = overrides[ageGroup] as string | undefined;
  if (agePrompt) return `${base}\n${agePrompt}`;

  if (ageGroup === "AGE_6_8") {
    return `${base}\nبرای گروه سنی ۶ تا ۸ سال، با جملات خیلی ساده و مثال‌های کودکانه پاسخ بده.`;
  }
  if (ageGroup === "AGE_9_12") {
    return `${base}\nبرای گروه سنی ۹ تا ۱۲ سال، توضیح مختصر و کاربردی بده و سوال کن که ادامه را می‌خواهند.`;
  }
  return `${base}\nبرای گروه سنی ۱۳ تا ۱۵ سال، توضیح کمی عمیق‌تر بده اما همچنان ایمن و کوتاه.`;
}
