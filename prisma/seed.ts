import bcrypt from "bcryptjs";
import { PrismaClient, UserRole, AgeGroup, SubscriptionStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@example.com";
  const parentEmail = "parent@example.com";
  const adminPass = "Admin123!";
  const parentPass = "Parent123!";

  const adminHash = await bcrypt.hash(adminPass, 10);
  const parentHash = await bcrypt.hash(parentPass, 10);

  const [admin, parent] = await Promise.all([
    prisma.user.upsert({
      where: { email: adminEmail },
      update: { passwordHash: adminHash, role: UserRole.ADMIN },
      create: {
        email: adminEmail,
        passwordHash: adminHash,
        role: UserRole.ADMIN
      }
    }),
    prisma.user.upsert({
      where: { email: parentEmail },
      update: { passwordHash: parentHash, role: UserRole.PARENT },
      create: {
        email: parentEmail,
        passwordHash: parentHash,
        role: UserRole.PARENT
      }
    })
  ]);

  const parentProfile = await prisma.parentProfile.upsert({
    where: { userId: parent.id },
    update: { displayName: "ولی نمونه" },
    create: {
      userId: parent.id,
      displayName: "ولی نمونه",
      preferences: {
        notifications: true,
        weeklyReport: true
      }
    }
  });

  await prisma.childProfile.upsert({
    where: { id: "demo-child" },
    update: {
      nickname: "آوا",
      ageGroup: AgeGroup.AGE_9_12,
      avatarKey: "star"
    },
    create: {
      id: "demo-child",
      parentId: parentProfile.id,
      nickname: "آوا",
      ageGroup: AgeGroup.AGE_9_12,
      avatarKey: "star",
      settings: {
        allowedHours: {
          start: "08:00",
          end: "20:00"
        },
        topicWhitelist: ["علوم", "داستان", "نقاشی"],
        topicBlacklist: ["خشونت", "مواد مخدر"]
      }
    }
  });

  const plans = [
    {
      name: "رایگان",
      description: "برای شروع امن و رایگان",
      priceMonthly: 0,
      priceYearly: 0,
      limits: {
        messagesPerDay: 20,
        tokensPerMonth: 10000,
        childrenLimit: 1
      },
      features: {
        reports: "basic",
        scheduling: false
      }
    },
    {
      name: "استاندارد",
      description: "برای خانواده‌های تک فرزند با گزارش هفتگی",
      priceMonthly: 1500000,
      priceYearly: 15000000,
      limits: {
        messagesPerDay: 200,
        tokensPerMonth: 200000,
        childrenLimit: 1
      },
      features: {
        reports: "weekly",
        scheduling: false
      }
    },
    {
      name: "خانوادگی",
      description: "برای خانواده‌های پر جمعیت با گزارش روزانه",
      priceMonthly: 3500000,
      priceYearly: 35000000,
      limits: {
        messagesPerDayPerChild: 300,
        tokensPerMonth: 500000,
        childrenLimit: 4
      },
      features: {
        reports: "daily",
        scheduling: true
      }
    },
    {
      name: "مدرسه",
      description: "نسخه سازمانی با سهمیه قابل تنظیم",
      priceMonthly: 0,
      priceYearly: 0,
      limits: {
        seats: 0,
        configurable: true
      },
      features: {
        reports: "custom",
        scheduling: true
      }
    }
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: {
        description: plan.description,
        priceMonthly: plan.priceMonthly,
        priceYearly: plan.priceYearly,
        limits: plan.limits,
        features: plan.features,
        isActive: true
      },
      create: {
        name: plan.name,
        description: plan.description,
        priceMonthly: plan.priceMonthly,
        priceYearly: plan.priceYearly,
        limits: plan.limits,
        features: plan.features,
        isActive: true
      }
    });
  }

  const freePlan = await prisma.plan.findFirst({ where: { name: "رایگان" } });
  if (freePlan) {
    await prisma.subscription.upsert({
      where: { parentId: parentProfile.id },
      update: { planId: freePlan.id, status: SubscriptionStatus.ACTIVE },
      create: {
        parentId: parentProfile.id,
        planId: freePlan.id,
        status: SubscriptionStatus.ACTIVE
      }
    });
  }

  await prisma.appConfig.upsert({
    where: { key: "ai.models" },
    update: {
      value: {
        defaultModel: "gpt-4o-mini",
        safetyModel: "gpt-4o-mini",
        temperature: 0.6,
        maxTokens: 800
      }
    },
    create: {
      key: "ai.models",
      value: {
        defaultModel: "gpt-4o-mini",
        safetyModel: "gpt-4o-mini",
        temperature: 0.6,
        maxTokens: 800
      }
    }
  });

  await prisma.appConfig.upsert({
    where: { key: "policy.prompts" },
    update: {
      value: {
        base:
          "تو یک دستیار فارسی امن و مهربان برای کودکان هستی. همیشه کوتاه، روشن و بدون اطلاعات شخصی پاسخ بده.",
        AGE_6_8: "برای گروه سنی ۶ تا ۸ سال ساده و با مثال‌های کودکانه پاسخ بده.",
        AGE_9_12: "برای گروه سنی ۹ تا ۱۲ سال توضیح کوتاه و کاربردی بده.",
        AGE_13_15: "برای گروه سنی ۱۳ تا ۱۵ سال توضیح کمی عمیق‌تر اما امن بده."
      }
    },
    create: {
      key: "policy.prompts",
      value: {
        base:
          "تو یک دستیار فارسی امن و مهربان برای کودکان هستی. همیشه کوتاه، روشن و بدون اطلاعات شخصی پاسخ بده.",
        AGE_6_8: "برای گروه سنی ۶ تا ۸ سال ساده و با مثال‌های کودکانه پاسخ بده.",
        AGE_9_12: "برای گروه سنی ۹ تا ۱۲ سال توضیح کوتاه و کاربردی بده.",
        AGE_13_15: "برای گروه سنی ۱۳ تا ۱۵ سال توضیح کمی عمیق‌تر اما امن بده."
      }
    }
  });

  await prisma.appConfig.upsert({
    where: { key: "safety.keywords" },
    update: {
      value: {
        blocklist: ["سکس", "خشونت شدید", "مواد مخدر"]
      }
    },
    create: {
      key: "safety.keywords",
      value: {
        blocklist: ["سکس", "خشونت شدید", "مواد مخدر"]
      }
    }
  });

  await prisma.appConfig.upsert({
    where: { key: "app.announcement" },
    update: { value: { text: "به GPTKids خوش آمدید! تجربه امن برای کودکان." } },
    create: { key: "app.announcement", value: { text: "به GPTKids خوش آمدید! تجربه امن برای کودکان." } }
  });

  await prisma.appConfig.upsert({
    where: { key: "app.flags" },
    update: { value: { reportsV2: true, showMascot: true } },
    create: { key: "app.flags", value: { reportsV2: true, showMascot: true } }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
