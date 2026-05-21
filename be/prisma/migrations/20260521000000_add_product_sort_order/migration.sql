-- Add admin list sort order for products
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "sort_order" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS "products_sort_order_idx" ON "products"("sort_order");

WITH ranked AS (
  SELECT id, (ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1)::int AS rn
  FROM products
)
UPDATE products p
SET sort_order = ranked.rn
FROM ranked
WHERE p.id = ranked.id;
