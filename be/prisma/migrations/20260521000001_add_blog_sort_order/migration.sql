ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "sort_order" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS "blog_posts_sort_order_idx" ON "blog_posts"("sort_order");

WITH ranked AS (
  SELECT id, (ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1)::int AS rn
  FROM blog_posts
)
UPDATE blog_posts p
SET sort_order = ranked.rn
FROM ranked
WHERE p.id = ranked.id;
