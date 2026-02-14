import { z } from "zod";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/lib/auth";

const schema = z.object({
  defaultModel: z.string().min(2),
  safetyModel: z.string().min(2),
  temperature: z.string(),
  maxTokens: z.string(),
  basePrompt: z.string().min(2),
  prompt6_8: z.string().min(2),
  prompt9_12: z.string().min(2),
  prompt13_15: z.string().min(2),
  keywordBlocklist: z.string().optional(),
  announcement: z.string().optional(),
  featureFlags: z.string().optional(),
  rateConfig: z.string().optional()
});

async function updateConfig(formData: FormData) {
  "use server";
  const data = {
    defaultModel: String(formData.get("defaultModel") ?? ""),
    safetyModel: String(formData.get("safetyModel") ?? ""),
    temperature: String(formData.get("temperature") ?? "0.6"),
    maxTokens: String(formData.get("maxTokens") ?? "800"),
    basePrompt: String(formData.get("basePrompt") ?? ""),
    prompt6_8: String(formData.get("prompt6_8") ?? ""),
    prompt9_12: String(formData.get("prompt9_12") ?? ""),
    prompt13_15: String(formData.get("prompt13_15") ?? ""),
    keywordBlocklist: String(formData.get("keywordBlocklist") ?? ""),
    announcement: String(formData.get("announcement") ?? ""),
    featureFlags: String(formData.get("featureFlags") ?? "{}"),
    rateConfig: String(formData.get("rateConfig") ?? "{}")
  };
  const parsed = schema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid config");
  await prisma.appConfig.upsert({
    where: { key: "ai.models" },
    update: {
      value: {
        defaultModel: parsed.data.defaultModel,
        safetyModel: parsed.data.safetyModel,
        temperature: Number(parsed.data.temperature),
        maxTokens: Number(parsed.data.maxTokens)
      }
    },
    create: {
      key: "ai.models",
      value: {
        defaultModel: parsed.data.defaultModel,
        safetyModel: parsed.data.safetyModel,
        temperature: Number(parsed.data.temperature),
        maxTokens: Number(parsed.data.maxTokens)
      }
    }
  });

  await prisma.appConfig.upsert({
    where: { key: "policy.prompts" },
    update: {
      value: {
        base: parsed.data.basePrompt,
        AGE_6_8: parsed.data.prompt6_8,
        AGE_9_12: parsed.data.prompt9_12,
        AGE_13_15: parsed.data.prompt13_15
      }
    },
    create: {
      key: "policy.prompts",
      value: {
        base: parsed.data.basePrompt,
        AGE_6_8: parsed.data.prompt6_8,
        AGE_9_12: parsed.data.prompt9_12,
        AGE_13_15: parsed.data.prompt13_15
      }
    }
  });

  await prisma.appConfig.upsert({
    where: { key: "safety.keywords" },
    update: {
      value: {
        blocklist: parsed.data.keywordBlocklist
          ? parsed.data.keywordBlocklist.split(",").map((s) => s.trim())
          : []
      }
    },
    create: {
      key: "safety.keywords",
      value: {
        blocklist: parsed.data.keywordBlocklist
          ? parsed.data.keywordBlocklist.split(",").map((s) => s.trim())
          : []
      }
    }
  });

  await prisma.appConfig.upsert({
    where: { key: "app.announcement" },
    update: { value: { text: parsed.data.announcement ?? "" } },
    create: { key: "app.announcement", value: { text: parsed.data.announcement ?? "" } }
  });

  let flags = {};
  try {
    flags = JSON.parse(parsed.data.featureFlags || "{}");
  } catch {
    flags = {};
  }

  await prisma.appConfig.upsert({
    where: { key: "app.flags" },
    update: { value: flags },
    create: { key: "app.flags", value: flags }
  });

  let rateConfig = {};
  try {
    rateConfig = JSON.parse(parsed.data.rateConfig || "{}");
  } catch {
    rateConfig = {};
  }

  await prisma.appConfig.upsert({
    where: { key: "rate.limits" },
    update: { value: rateConfig },
    create: { key: "rate.limits", value: rateConfig }
  });

  const session = await getServerAuthSession();
  if (session?.user?.id) {
    await prisma.auditLog.create({
      data: {
        actorUserId: session.user.id,
        action: "config.update",
        metadata: { keys: ["ai.models", "policy.prompts", "safety.keywords", "app.announcement", "app.flags", "rate.limits"] }
      }
    });
  }
}

async function upsertModelPricing(formData: FormData) {
  "use server";
  const modelName = String(formData.get("modelName") ?? "");
  const inputCost = Number(formData.get("inputCostPer1M") ?? "0");
  const outputCost = Number(formData.get("outputCostPer1M") ?? "0");
  await prisma.modelPricing.upsert({
    where: { modelName },
    update: {
      inputCostPer1MTokensToman: inputCost,
      outputCostPer1MTokensToman: outputCost,
      isActive: true
    },
    create: {
      modelName,
      inputCostPer1MTokensToman: inputCost,
      outputCostPer1MTokensToman: outputCost,
      isActive: true
    }
  });

  const session = await getServerAuthSession();
  if (session?.user?.id) {
    await prisma.auditLog.create({
      data: {
        actorUserId: session.user.id,
        action: "model_pricing.upsert",
        metadata: { modelName }
      }
    });
  }
}

export default async function AdminConfigPage() {
  const config = await prisma.appConfig.findUnique({
    where: { key: "ai.models" }
  });
  const value = (config?.value as any) ?? {};
  const promptsConfig = await prisma.appConfig.findUnique({
    where: { key: "policy.prompts" }
  });
  const prompts = (promptsConfig?.value as any) ?? {};
  const keywordConfig = await prisma.appConfig.findUnique({
    where: { key: "safety.keywords" }
  });
  const keywordValue = (keywordConfig?.value as any) ?? {};
  const announcementConfig = await prisma.appConfig.findUnique({
    where: { key: "app.announcement" }
  });
  const announcementValue = (announcementConfig?.value as any) ?? {};
  const flagsConfig = await prisma.appConfig.findUnique({
    where: { key: "app.flags" }
  });
  const flagsValue = flagsConfig?.value ?? {};
  const rateConfig = await prisma.appConfig.findUnique({
    where: { key: "rate.limits" }
  });
  const rateValue = rateConfig?.value ?? {};
  const modelPricing = await prisma.modelPricing.findMany({
    orderBy: { modelName: "asc" }
  });

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-card">
        <CardHeader>
          <CardTitle>تنظیمات سیستم</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateConfig} className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label>مدل پیش‌فرض</Label>
            <Input name="defaultModel" defaultValue={value.defaultModel ?? "gpt-4o-mini"} />
          </div>
          <div className="space-y-2">
            <Label>مدل ایمنی</Label>
            <Input name="safetyModel" defaultValue={value.safetyModel ?? "gpt-4o-mini"} />
          </div>
          <div className="space-y-2">
            <Label>Temperature</Label>
            <Input name="temperature" defaultValue={value.temperature ?? 0.6} />
          </div>
          <div className="space-y-2">
            <Label>Max Tokens</Label>
            <Input name="maxTokens" defaultValue={value.maxTokens ?? 800} />
          </div>
          <div className="lg:col-span-2 space-y-2">
            <Label>پرامپت پایه</Label>
            <Input name="basePrompt" defaultValue={prompts.base ?? ""} />
          </div>
          <div className="space-y-2">
            <Label>گروه ۶-۸</Label>
            <Input name="prompt6_8" defaultValue={prompts.AGE_6_8 ?? ""} />
          </div>
          <div className="space-y-2">
            <Label>گروه ۹-۱۲</Label>
            <Input name="prompt9_12" defaultValue={prompts.AGE_9_12 ?? ""} />
          </div>
          <div className="space-y-2">
            <Label>گروه ۱۳-۱۵</Label>
            <Input name="prompt13_15" defaultValue={prompts.AGE_13_15 ?? ""} />
          </div>
          <div className="space-y-2 lg:col-span-2">
            <Label>کلیدواژه‌های مسدود (با کاما جدا کنید)</Label>
            <Input
              name="keywordBlocklist"
              defaultValue={(keywordValue.blocklist ?? []).join(", ")}
            />
          </div>
          <div className="space-y-2 lg:col-span-2">
            <Label>اعلان عمومی</Label>
            <Input name="announcement" defaultValue={announcementValue.text ?? ""} />
          </div>
            <div className="space-y-2 lg:col-span-2">
              <Label>Feature Flags JSON</Label>
              <Input name="featureFlags" defaultValue={JSON.stringify(flagsValue)} />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <Label>تنظیمات Rate Limit JSON</Label>
              <Input name="rateConfig" defaultValue={JSON.stringify(rateValue)} />
            </div>
            <div className="lg:col-span-2">
              <Button className="w-full" type="submit">ذخیره تنظیمات</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-0 bg-card">
        <CardHeader>
          <CardTitle>قیمت مدل‌ها</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 text-sm text-muted-foreground">
            {modelPricing.map((model) => (
              <div key={model.id} className="flex items-center justify-between rounded-xl border px-3 py-2">
                <span>{model.modelName}</span>
                <span>
                  ورودی {model.inputCostPer1MTokensToman.toLocaleString()} | خروجی{" "}
                  {model.outputCostPer1MTokensToman.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <form action={upsertModelPricing} className="grid gap-3 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>نام مدل</Label>
              <Input name="modelName" required />
            </div>
            <div className="space-y-2">
              <Label>هزینه ورودی (۱M توکن)</Label>
              <Input name="inputCostPer1M" required />
            </div>
            <div className="space-y-2">
              <Label>هزینه خروجی (۱M توکن)</Label>
              <Input name="outputCostPer1M" required />
            </div>
            <div className="lg:col-span-3">
              <Button className="w-full" type="submit">ثبت/به‌روزرسانی مدل</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
