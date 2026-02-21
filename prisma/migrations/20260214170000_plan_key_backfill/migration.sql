-- Backfill Plan.key for existing rows and enforce non-null
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Plan' AND column_name = 'key'
  ) THEN
    UPDATE "Plan"
    SET "key" = CASE
      WHEN "key" IS NOT NULL THEN "key"
      WHEN "nameFa" = 'پلن پایه' OR "name" = 'پلن پایه' THEN 'base_monthly'
      WHEN "nameFa" = 'پلن حرفه‌ای' OR "name" = 'پلن حرفه‌ای' THEN 'pro_monthly'
      WHEN "nameFa" = 'پلن خانواده پلاس' OR "name" = 'پلن خانواده پلاس' THEN 'family_plus_monthly'
      ELSE 'plan_' || "id"
    END
    WHERE "key" IS NULL;

    -- Ensure NOT NULL if possible
    BEGIN
      EXECUTE 'ALTER TABLE "Plan" ALTER COLUMN "key" SET NOT NULL';
    EXCEPTION WHEN others THEN
      NULL;
    END;
  END IF;
END$$;
