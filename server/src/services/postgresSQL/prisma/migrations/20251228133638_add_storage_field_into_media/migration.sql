-- CreateEnum
CREATE TYPE "MediaStorage" AS ENUM ('internal', 'external');

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "storage" "MediaStorage" NOT NULL DEFAULT 'internal';
