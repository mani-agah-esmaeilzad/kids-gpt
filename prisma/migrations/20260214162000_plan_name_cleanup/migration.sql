-- Ensure legacy Plan.name does not block inserts
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Plan' AND column_name = 'name'
  ) THEN
    EXECUTE 'UPDATE "Plan" SET "name" = COALESCE("name", "nameFa", "key", ''Plan'')';
  END IF;
END$$;

-- Drop any UNIQUE constraint on Plan.name
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT c.conname
    FROM pg_constraint c
    JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY (c.conkey)
    WHERE c.conrelid = '"Plan"'::regclass
      AND c.contype = 'u'
      AND a.attname = 'name'
  LOOP
    EXECUTE 'ALTER TABLE "Plan" DROP CONSTRAINT ' || quote_ident(r.conname);
  END LOOP;
END$$;

-- Drop any UNIQUE index on Plan.name
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT indexname
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename = 'Plan'
      AND indexdef ILIKE '%UNIQUE%'
      AND indexdef ILIKE '%(name)%'
  LOOP
    EXECUTE 'DROP INDEX IF EXISTS ' || quote_ident(r.indexname);
  END LOOP;
END$$;

-- Keep a safe default for name if column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Plan' AND column_name = 'name'
  ) THEN
    EXECUTE 'ALTER TABLE "Plan" ALTER COLUMN "name" SET DEFAULT ''Plan''';
  END IF;
END$$;
