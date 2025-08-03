/*
  Warnings:

  - A unique constraint covering the columns `[account]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "permission" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "roles" ALTER COLUMN "description" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_account_key" ON "users"("account");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
