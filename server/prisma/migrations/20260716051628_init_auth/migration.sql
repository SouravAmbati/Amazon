/*
  Warnings:

  - Added the required column `updatedAt` to the `password_reset_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `verification_challenges` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "password_reset_tokens" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT;

-- AlterTable
ALTER TABLE "verification_challenges" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
