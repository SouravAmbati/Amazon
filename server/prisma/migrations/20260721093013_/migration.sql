-- AlterTable
ALTER TABLE "public"."verification_challenges" ADD COLUMN     "maxAttempts" INTEGER NOT NULL DEFAULT 5;
