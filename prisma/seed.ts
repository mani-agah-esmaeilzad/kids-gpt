import bcrypt from "bcryptjs";
import { PrismaClient, UserRole, AgeGroup, SubscriptionStatus, CostCategory } from "@prisma/client";

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
      key: "base_monthly",
      nameFa: "پلن پایه",
      priceMonthlyToman: 249000,
      maxChildren: 1,
      quotasJson: {
        dailyMessagesPerChild: 60,
        dailyTokensPerChild: 25000,
        monthlyTokenCap: 600000,
        rateLimits: {
          parentRPM: 30,
          childRPM: 10,
          childConcurrency: 2,
          ipAuthRPM: 8
        }
      },
      featuresJson: {
        progressReport: false,
        smartStory: false,
        pdfReport: false,
        priority: false
      }
    },
    {
      key: "pro_monthly",
      nameFa: "پلن حرفه‌ای",
      priceMonthlyToman: 399000,
      maxChildren: 3,
      quotasJson: {
        dailyMessagesPerChild: 200,
        dailyTokensPerChild: 80000,
        monthlyTokenCap: 2000000,
        rateLimits: {
          parentRPM: 60,
          childRPM: 20,
          childConcurrency: 4,
          ipAuthRPM: 12
        }
      },
      featuresJson: {
        progressReport: true,
        smartStory: true,
        pdfReport: false,
        priority: false
      }
    },
    {
      key: "family_plus_monthly",
      nameFa: "پلن خانواده پلاس",
      priceMonthlyToman: 599000,
      maxChildren: 5,
      quotasJson: {
        dailyMessagesPerChild: 300,
        dailyTokensShared: 200000,
        monthlyTokenCap: 4000000,
        rateLimits: {
          parentRPM: 90,
          childRPM: 30,
          childConcurrency: 6,
          ipAuthRPM: 16
        }
      },
      featuresJson: {
        progressReport: true,
        smartStory: true,
        pdfReport: true,
        priority: true
      }
    }
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { key: plan.key },
      update: {
        nameFa: plan.nameFa,
        priceMonthlyToman: plan.priceMonthlyToman,
        maxChildren: plan.maxChildren,
        quotasJson: plan.quotasJson,
        featuresJson: plan.featuresJson,
        isActive: true
      },
      create: {
        key: plan.key,
        nameFa: plan.nameFa,
        priceMonthlyToman: plan.priceMonthlyToman,
        maxChildren: plan.maxChildren,
        quotasJson: plan.quotasJson,
        featuresJson: plan.featuresJson,
        isActive: true
      }
    });
  }

  const basePlan = await prisma.plan.findFirst({ where: { key: "base_monthly" } });
  if (basePlan) {
    const subscription = await prisma.subscription.upsert({
      where: { parentId: parentProfile.id },
      update: {
        planId: basePlan.id,
        status: SubscriptionStatus.ACTIVE,
        userId: parent.id
      },
      create: {
        userId: parent.id,
        parentId: parentProfile.id,
        planId: basePlan.id,
        status: SubscriptionStatus.ACTIVE,
        startAt: new Date(),
        renewAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        provider: "manual",
        providerRef: "seed"
      }
    });

    await prisma.payment.create({
      data: {
        userId: parent.id,
        subscriptionId: subscription.id,
        amountToman: basePlan.priceMonthlyToman,
        status: "PAID",
        provider: "manual",
        providerRef: "seed",
        feeToman: 0
      }
    });

    await prisma.revenueLedger.create({
      data: {
        userId: parent.id,
        subscriptionId: subscription.id,
        amountToman: basePlan.priceMonthlyToman,
        notes: "Seed activation"
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

  await prisma.appConfig.upsert({
    where: { key: "rate.limits" },
    update: { value: { globalMultiplier: 1, emergencyThrottle: false, ipAuthRPM: 8 } },
    create: { key: "rate.limits", value: { globalMultiplier: 1, emergencyThrottle: false, ipAuthRPM: 8 } }
  });

  await prisma.modelPricing.upsert({
    where: { modelName: "gpt-4o-mini" },
    update: {
      inputCostPer1MTokensToman: 120000,
      outputCostPer1MTokensToman: 180000,
      isActive: true
    },
    create: {
      modelName: "gpt-4o-mini",
      inputCostPer1MTokensToman: 120000,
      outputCostPer1MTokensToman: 180000,
      isActive: true
    }
  });

  await prisma.modelPricing.upsert({
    where: { modelName: "gpt-4o" },
    update: {
      inputCostPer1MTokensToman: 240000,
      outputCostPer1MTokensToman: 360000,
      isActive: true
    },
    create: {
      modelName: "gpt-4o",
      inputCostPer1MTokensToman: 240000,
      outputCostPer1MTokensToman: 360000,
      isActive: true
    }
  });

  await prisma.costLedger.createMany({
    data: [
      {
        category: CostCategory.SERVER,
        amountToman: 1800000,
        notes: "سرور ماهانه"
      },
      {
        category: CostCategory.MARKETING,
        amountToman: 900000,
        notes: "کمپین اینستاگرام"
      },
      {
        category: CostCategory.PAYMENT,
        amountToman: 120000,
        notes: "کارمزد پرداخت"
      }
    ],
    skipDuplicates: true
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
