-- Add missing enum values without removing existing ones
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    WHERE t.typname = 'SubscriptionStatus' AND e.enumlabel = 'EXPIRED'
  ) THEN
    ALTER TYPE "SubscriptionStatus" ADD VALUE 'EXPIRED';
  END IF;
END$$;

-- New enums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CostCategory') THEN
    CREATE TYPE "CostCategory" AS ENUM ('SERVER', 'PAYMENT', 'MARKETING', 'OTHER');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'LogSeverity') THEN
    CREATE TYPE "LogSeverity" AS ENUM ('INFO', 'WARN', 'ERROR');
  END IF;
END$$;

-- ChildProfile updates (remove PIN, add avatarKey)
ALTER TABLE "ChildProfile" ADD COLUMN IF NOT EXISTS "avatarKey" TEXT;
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'ChildProfile'
      AND column_name = 'avatar'
  ) THEN
    EXECUTE 'UPDATE "ChildProfile" SET "avatarKey" = COALESCE("avatar", ''avatar-1'') WHERE "avatarKey" IS NULL';
  ELSE
    EXECUTE 'UPDATE "ChildProfile" SET "avatarKey" = COALESCE("avatarKey", ''avatar-1'') WHERE "avatarKey" IS NULL';
  END IF;
END$$;
ALTER TABLE "ChildProfile" ALTER COLUMN "avatarKey" SET NOT NULL;
ALTER TABLE "ChildProfile" DROP COLUMN IF EXISTS "pinHash";
ALTER TABLE "ChildProfile" DROP COLUMN IF EXISTS "avatar";

-- KidDeviceSession
CREATE TABLE IF NOT EXISTS "KidDeviceSession" (
  "id" TEXT NOT NULL,
  "deviceId" TEXT NOT NULL,
  "activeChildId" TEXT,
  "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "KidDeviceSession_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "KidDeviceSession_deviceId_key" ON "KidDeviceSession"("deviceId");
CREATE INDEX IF NOT EXISTS "KidDeviceSession_activeChildId_idx" ON "KidDeviceSession"("activeChildId");
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'KidDeviceSession_activeChildId_fkey'
  ) THEN
    ALTER TABLE "KidDeviceSession" ADD CONSTRAINT "KidDeviceSession_activeChildId_fkey"
      FOREIGN KEY ("activeChildId") REFERENCES "ChildProfile"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END$$;

-- Plan updates
ALTER TABLE "Plan" ADD COLUMN IF NOT EXISTS "key" TEXT;
ALTER TABLE "Plan" ADD COLUMN IF NOT EXISTS "nameFa" TEXT;
ALTER TABLE "Plan" ADD COLUMN IF NOT EXISTS "priceMonthlyToman" INTEGER;
ALTER TABLE "Plan" ADD COLUMN IF NOT EXISTS "maxChildren" INTEGER;
ALTER TABLE "Plan" ADD COLUMN IF NOT EXISTS "featuresJson" JSONB;
ALTER TABLE "Plan" ADD COLUMN IF NOT EXISTS "quotasJson" JSONB;

UPDATE "Plan" SET "nameFa" = COALESCE("nameFa", "name");
UPDATE "Plan" SET "priceMonthlyToman" = COALESCE("priceMonthlyToman", "priceMonthly");
UPDATE "Plan" SET "featuresJson" = COALESCE("featuresJson", "features", '{}'::jsonb);
UPDATE "Plan" SET "quotasJson" = COALESCE("quotasJson", "limits", '{}'::jsonb);
UPDATE "Plan" SET "maxChildren" = COALESCE("maxChildren", 1);

-- Ensure legacy NOT NULL columns have defaults to avoid insert failures
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Plan' AND column_name = 'name'
  ) THEN
    EXECUTE 'ALTER TABLE "Plan" ALTER COLUMN "name" SET DEFAULT ''Plan''';
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Plan' AND column_name = 'description'
  ) THEN
    EXECUTE 'ALTER TABLE "Plan" ALTER COLUMN "description" SET DEFAULT ''''';
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Plan' AND column_name = 'priceMonthly'
  ) THEN
    EXECUTE 'ALTER TABLE "Plan" ALTER COLUMN "priceMonthly" SET DEFAULT 0';
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Plan' AND column_name = 'priceYearly'
  ) THEN
    EXECUTE 'ALTER TABLE "Plan" ALTER COLUMN "priceYearly" SET DEFAULT 0';
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Plan' AND column_name = 'limits'
  ) THEN
    EXECUTE 'ALTER TABLE "Plan" ALTER COLUMN "limits" SET DEFAULT ''{}''::jsonb';
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Plan' AND column_name = 'features'
  ) THEN
    EXECUTE 'ALTER TABLE "Plan" ALTER COLUMN "features" SET DEFAULT ''{}''::jsonb';
  END IF;
END$$;

ALTER TABLE "Plan" ALTER COLUMN "nameFa" SET NOT NULL;
ALTER TABLE "Plan" ALTER COLUMN "priceMonthlyToman" SET NOT NULL;
ALTER TABLE "Plan" ALTER COLUMN "maxChildren" SET NOT NULL;
ALTER TABLE "Plan" ALTER COLUMN "featuresJson" SET NOT NULL;
ALTER TABLE "Plan" ALTER COLUMN "quotasJson" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "Plan_key_key" ON "Plan"("key");

-- Subscription updates
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "userId" TEXT;
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "startAt" TIMESTAMP(3);
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "renewAt" TIMESTAMP(3);
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "endAt" TIMESTAMP(3);
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "provider" TEXT;
ALTER TABLE "Subscription" ADD COLUMN IF NOT EXISTS "providerRef" TEXT;

UPDATE "Subscription" s
SET "userId" = p."userId"
FROM "ParentProfile" p
WHERE s."parentId" = p."id" AND s."userId" IS NULL;

UPDATE "Subscription" SET "startAt" = COALESCE("startAt", "currentPeriodStart", NOW());
UPDATE "Subscription" SET "endAt" = COALESCE("endAt", "currentPeriodEnd");

ALTER TABLE "Subscription" ALTER COLUMN "userId" SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Subscription_userId_fkey'
  ) THEN
    ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END$$;

CREATE INDEX IF NOT EXISTS "Subscription_userId_idx" ON "Subscription"("userId");

-- Payment updates
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "userId" TEXT;
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "amountToman" INTEGER;
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "providerRef" TEXT;
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "feeToman" INTEGER DEFAULT 0;

UPDATE "Payment" SET "amountToman" = COALESCE("amountToman", "amount");

UPDATE "Payment" pay
SET "userId" = u."id"
FROM "Subscription" s
JOIN "ParentProfile" p ON p."id" = s."parentId"
JOIN "User" u ON u."id" = p."userId"
WHERE pay."subscriptionId" = s."id" AND pay."userId" IS NULL;

ALTER TABLE "Payment" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "Payment" ALTER COLUMN "subscriptionId" DROP NOT NULL;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Payment_subscriptionId_fkey') THEN
    ALTER TABLE "Payment" DROP CONSTRAINT "Payment_subscriptionId_fkey";
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Payment_subscriptionId_fkey'
  ) THEN
    ALTER TABLE "Payment" ADD CONSTRAINT "Payment_subscriptionId_fkey"
      FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Payment_userId_fkey'
  ) THEN
    ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END$$;

-- UsageLedger updates
ALTER TABLE "UsageLedger" ADD COLUMN IF NOT EXISTS "userId" TEXT;
ALTER TABLE "UsageLedger" ADD COLUMN IF NOT EXISTS "messagesCount" INTEGER DEFAULT 0;
ALTER TABLE "UsageLedger" ADD COLUMN IF NOT EXISTS "inputTokens" INTEGER DEFAULT 0;
ALTER TABLE "UsageLedger" ADD COLUMN IF NOT EXISTS "outputTokens" INTEGER DEFAULT 0;
ALTER TABLE "UsageLedger" ADD COLUMN IF NOT EXISTS "totalTokens" INTEGER DEFAULT 0;
ALTER TABLE "UsageLedger" ADD COLUMN IF NOT EXISTS "estimatedTokenCostToman" INTEGER DEFAULT 0;
ALTER TABLE "UsageLedger" ADD COLUMN IF NOT EXISTS "modelUsed" TEXT;
ALTER TABLE "UsageLedger" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

UPDATE "UsageLedger" SET "messagesCount" = COALESCE("messagesCount", "messages");
UPDATE "UsageLedger" SET "totalTokens" = COALESCE("totalTokens", "tokens");
UPDATE "UsageLedger" SET "estimatedTokenCostToman" = COALESCE("estimatedTokenCostToman", ("costEstimate"::numeric)::int);
UPDATE "UsageLedger" SET "modelUsed" = COALESCE("modelUsed", "model");

UPDATE "UsageLedger" u
SET "userId" = p."userId"
FROM "ParentProfile" p
WHERE u."parentId" = p."id" AND u."userId" IS NULL;

ALTER TABLE "UsageLedger" ALTER COLUMN "userId" SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'UsageLedger_userId_fkey'
  ) THEN
    ALTER TABLE "UsageLedger" ADD CONSTRAINT "UsageLedger_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END$$;

CREATE INDEX IF NOT EXISTS "UsageLedger_userId_date_idx" ON "UsageLedger"("userId", "date");

-- ModelPricing
CREATE TABLE IF NOT EXISTS "ModelPricing" (
  "id" TEXT NOT NULL,
  "modelName" TEXT NOT NULL,
  "inputCostPer1MTokensToman" INTEGER NOT NULL,
  "outputCostPer1MTokensToman" INTEGER NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ModelPricing_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ModelPricing_modelName_key" ON "ModelPricing"("modelName");

-- CostLedger
CREATE TABLE IF NOT EXISTS "CostLedger" (
  "id" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "category" "CostCategory" NOT NULL,
  "amountToman" INTEGER NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CostLedger_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "CostLedger_category_date_idx" ON "CostLedger"("category", "date");

-- RevenueLedger
CREATE TABLE IF NOT EXISTS "RevenueLedger" (
  "id" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "userId" TEXT NOT NULL,
  "subscriptionId" TEXT,
  "amountToman" INTEGER NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RevenueLedger_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "RevenueLedger_userId_date_idx" ON "RevenueLedger"("userId", "date");
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'RevenueLedger_userId_fkey'
  ) THEN
    ALTER TABLE "RevenueLedger" ADD CONSTRAINT "RevenueLedger_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END$$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'RevenueLedger_subscriptionId_fkey'
  ) THEN
    ALTER TABLE "RevenueLedger" ADD CONSTRAINT "RevenueLedger_subscriptionId_fkey"
      FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END$$;

-- FinancialSnapshot
CREATE TABLE IF NOT EXISTS "FinancialSnapshot" (
  "id" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "revenueToman" INTEGER NOT NULL DEFAULT 0,
  "tokenCostToman" INTEGER NOT NULL DEFAULT 0,
  "serverCostToman" INTEGER NOT NULL DEFAULT 0,
  "paymentCostToman" INTEGER NOT NULL DEFAULT 0,
  "marketingCostToman" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "FinancialSnapshot_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "FinancialSnapshot_date_key" ON "FinancialSnapshot"("date");

-- LogEvent
CREATE TABLE IF NOT EXISTS "LogEvent" (
  "id" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "severity" "LogSeverity" NOT NULL DEFAULT 'INFO',
  "message" TEXT,
  "userId" TEXT,
  "childId" TEXT,
  "requestId" TEXT,
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LogEvent_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "LogEvent_eventType_createdAt_idx" ON "LogEvent"("eventType", "createdAt");
CREATE INDEX IF NOT EXISTS "LogEvent_userId_createdAt_idx" ON "LogEvent"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "LogEvent_childId_createdAt_idx" ON "LogEvent"("childId", "createdAt");
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'LogEvent_userId_fkey'
  ) THEN
    ALTER TABLE "LogEvent" ADD CONSTRAINT "LogEvent_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END$$;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'LogEvent_childId_fkey'
  ) THEN
    ALTER TABLE "LogEvent" ADD CONSTRAINT "LogEvent_childId_fkey"
      FOREIGN KEY ("childId") REFERENCES "ChildProfile"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END$$;
