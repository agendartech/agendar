ALTER TABLE "employees" ADD COLUMN "color" text DEFAULT '#3b82f6' NOT NULL;--> statement-breakpoint
UPDATE "employees" AS e
SET "color" = (
  ARRAY[
    '#3b82f6', '#ec4899', '#a855f7', '#10b981', '#f97316',
    '#06b6d4', '#f43f5e', '#f59e0b', '#6366f1', '#14b8a6',
    '#ef4444', '#22c55e', '#8b5cf6', '#d946ef', '#84cc16',
    '#0ea5e9', '#eab308', '#78716c', '#92400e', '#1e3a8a'
  ]
)[1 + ((r.rn - 1) % 20)]
FROM (
  SELECT "id", row_number() OVER (
    PARTITION BY "establishment_id" ORDER BY "created_at", "id"
  ) AS rn
  FROM "employees"
) AS r
WHERE e."id" = r."id";
