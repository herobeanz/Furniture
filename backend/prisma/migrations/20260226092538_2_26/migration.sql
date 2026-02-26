/*
  Warnings:

  - You are about to drop the `reviews` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_product_id_fkey";

-- DropTable
DROP TABLE "reviews";

-- DropEnum
DROP TYPE "ReviewStatus";
