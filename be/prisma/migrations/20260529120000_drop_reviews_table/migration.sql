-- Drop unused reviews table (no Prisma model / API in app)
DROP TABLE IF EXISTS "reviews";
DROP TYPE IF EXISTS "ReviewStatus";
