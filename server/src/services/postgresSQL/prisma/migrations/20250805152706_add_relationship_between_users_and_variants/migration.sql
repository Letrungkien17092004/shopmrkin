/*
  Warnings:

  - Added the required column `authorId` to the `Variants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Variants" ADD COLUMN     "authorId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Variants" ADD CONSTRAINT "Variants_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
