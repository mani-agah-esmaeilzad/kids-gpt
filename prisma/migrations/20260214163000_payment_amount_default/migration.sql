-- Fix legacy Payment.amount NOT NULL by ensuring defaults
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Payment' AND column_name = 'amount'
  ) THEN
    EXECUTE 'ALTER TABLE "Payment" ALTER COLUMN "amount" SET DEFAULT 0';
    EXECUTE 'UPDATE "Payment" SET "amount" = COALESCE("amount", "amountToman", 0)';
  END IF;
END$$;
