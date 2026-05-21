-- Remove Room model; Category.slug is globally unique
ALTER TABLE "categories" DROP CONSTRAINT IF EXISTS "categories_room_id_fkey";
DROP INDEX IF EXISTS "categories_room_id_slug_key";
ALTER TABLE "categories" DROP COLUMN IF EXISTS "room_id";
DROP TABLE IF EXISTS "rooms";
CREATE UNIQUE INDEX IF NOT EXISTS "categories_slug_key" ON "categories"("slug");
