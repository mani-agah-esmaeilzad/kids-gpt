import Link from "next/link";
import { prisma } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { redirect } from "next/navigation";
import { logEvent } from "@/lib/logger";

const planOrder = ["base_monthly", "pro_monthly", "family_plus_monthly"];

function buildFeatures(plan: any) {
  const features = plan.featuresJson ?? {};
  const quotas = plan.quotasJson ?? {};
  const list = [
    `حداکثر ${plan.maxChildren} کودک`,
    `سقف پیام روزانه: ${quotas.dailyMessagesPerChild ?? "نامشخص"}`,
    quotas.dailyTokensShared
      ? `سقف توکن روزانه مشترک: ${quotas.dailyTokensShared.toLocaleString()}`
      : `سقف توکن روزانه هر کودک: ${(quotas.dailyTokensPerChild ?? 0).toLocaleString()}`,
    features.progressReport ? "گزارش پیشرفت" : "بدون گزارش پیشرفت",
    features.smartStory ? "داستان‌سازی هوشمند" : "بدون داستان‌سازی هوشمند",
    features.pdfReport ? "گزارش PDF" : "بدون گزارش PDF",
    features.priority ? "اولویت پاسخ" : "اولویت پاسخ ندارد"
  ];
  return list;
}

async function selectPlan(formData: FormData) {
  "use server";
  const planKey = String(formData.get("planKey") ?? "");
  const session = await getServerAuthSession();
  if (!session?.user?.id) {
    redirect("/login");
  }
  const plan = await prisma.plan.findUnique({ where: { key: planKey } });
  if (!plan) {
    throw new Error("پلن یافت نشد");
  }
  const parent = await prisma.parentProfile.findFirst({ where: { userId: session.user.id } });
  if (!parent) throw new Error("Parent not found");

  const subscription = await prisma.subscription.upsert({
    where: { parentId: parent.id },
    update: {
      planId: plan.id,
      status: "ACTIVE",
      userId: session.user.id,
      startAt: new Date(),
      renewAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      provider: "manual",
      providerRef: "self-service"
    },
    create: {
      userId: session.user.id,
      parentId: parent.id,
      planId: plan.id,
      status: "ACTIVE",
      startAt: new Date(),
      renewAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      provider: "manual",
      providerRef: "self-service"
    }
  });

  await prisma.payment.create({
    data: {
      userId: session.user.id,
      subscriptionId: subscription.id,
      amountToman: plan.priceMonthlyToman,
      status: "PAID",
      provider: "manual",
      providerRef: "self-service",
      feeToman: 0
    }
  });

  await prisma.revenueLedger.create({
    data: {
      userId: session.user.id,
      subscriptionId: subscription.id,
      amountToman: plan.priceMonthlyToman,
      notes: "Self service activation"
    }
  });

  await logEvent("subscription.activated", {
    userId: session.user.id,
    message: `Activated ${plan.key}`
  });

  redirect("/profiles");
}

export async function PricingCards() {
  const session = await getServerAuthSession();
  const plans = await prisma.plan.findMany({
    where: { key: { in: planOrder }, isActive: true }
  });

  const ordered = planOrder
    .map((key) => plans.find((plan) => plan.key === key))
    .filter(Boolean) as typeof plans;

  return (
    <div className="grid gap-6 md:grid-cols-3 lg:max-w-6xl lg:mx-auto">
      {ordered.map((plan) => {
        const features = buildFeatures(plan);
        return (
          <Card
            key={plan.key}
            className={`flex flex-col ${plan.key === "pro_monthly" ? "border-primary shadow-soft-lg scale-[1.02]" : "shadow-soft"}`}
          >
            <CardHeader>
              <CardTitle className="text-xl">{plan.nameFa}</CardTitle>
              <CardDescription>پرداخت ماهانه</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{plan.priceMonthlyToman.toLocaleString()}</span>
                <span className="text-muted-foreground text-sm">تومان / ماه</span>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {session?.user?.id ? (
                <form action={selectPlan} className="w-full">
                  <input type="hidden" name="planKey" value={plan.key} />
                  <Button className="w-full">انتخاب پلن</Button>
                </form>
              ) : (
                <Button asChild className="w-full">
                  <Link href="/signup">ساخت حساب</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
