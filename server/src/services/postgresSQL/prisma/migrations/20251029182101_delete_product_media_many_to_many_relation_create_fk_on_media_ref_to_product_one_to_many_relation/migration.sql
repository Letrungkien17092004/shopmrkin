/*
  Warnings:

  - You are about to drop the `Product_Media` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product_Media" DROP CONSTRAINT "Product_Media_mediaId_fkey";

-- DropForeignKey
ALTER TABLE "Product_Media" DROP CONSTRAINT "Product_Media_productId_fkey";

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "productId" TEXT;

-- DropTable
DROP TABLE "Product_Media";

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
