-- AlterTable
ALTER TABLE "products" ADD COLUMN     "rating" DECIMAL(2,1),
ADD COLUMN     "sold_count" INTEGER NOT NULL DEFAULT 0;
