-- AlterTable
ALTER TABLE "products" ADD COLUMN     "flash_sale_end_at" TIMESTAMP(3),
ADD COLUMN     "is_daily_flash_sale" BOOLEAN NOT NULL DEFAULT false;
