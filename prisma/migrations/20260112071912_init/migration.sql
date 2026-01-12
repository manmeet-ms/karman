/*
  Warnings:

  - You are about to drop the column `accessToken` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `accessTokenExpires` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `providerType` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `avatar` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,providerAccountId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provider` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `moodType` on the `Mood` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `Timer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "MoodTypeEnum" ADD VALUE 'STRESSED';

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "HourlyCheckin" DROP CONSTRAINT "HourlyCheckin_userId_fkey";

-- DropForeignKey
ALTER TABLE "Mood" DROP CONSTRAINT "Mood_hourlyCheckinId_fkey";

-- DropForeignKey
ALTER TABLE "MoodTracker" DROP CONSTRAINT "MoodTracker_userId_fkey";

-- DropForeignKey
ALTER TABLE "PointsTxn" DROP CONSTRAINT "PointsTxn_userId_fkey";

-- DropForeignKey
ALTER TABLE "Ritual" DROP CONSTRAINT "Ritual_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "TimeBlock" DROP CONSTRAINT "TimeBlock_userId_fkey";

-- DropForeignKey
ALTER TABLE "Timer" DROP CONSTRAINT "Timer_userId_fkey";

-- DropForeignKey
ALTER TABLE "Urge" DROP CONSTRAINT "Urge_userId_fkey";

-- DropForeignKey
ALTER TABLE "Violation" DROP CONSTRAINT "Violation_userId_fkey";

-- DropIndex
DROP INDEX "Account_providerId_providerAccountId_key";

-- DropIndex
DROP INDEX "TimeBlock_date_task_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "accessToken",
DROP COLUMN "accessTokenExpires",
DROP COLUMN "providerId",
DROP COLUMN "providerType",
DROP COLUMN "refreshToken",
ADD COLUMN     "access_token" TEXT,
ADD COLUMN     "expires_at" INTEGER,
ADD COLUMN     "id_token" TEXT,
ADD COLUMN     "provider" TEXT NOT NULL,
ADD COLUMN     "refresh_token" TEXT,
ADD COLUMN     "scope" TEXT,
ADD COLUMN     "session_state" TEXT,
ADD COLUMN     "token_type" TEXT,
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Mood" DROP COLUMN "moodType",
ADD COLUMN     "moodType" "MoodTypeEnum" NOT NULL;

-- AlterTable
ALTER TABLE "MoodTracker" ADD COLUMN     "date" TEXT;

-- AlterTable
ALTER TABLE "Timer" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "failures" SET DEFAULT 0,
ALTER COLUMN "perks" DROP NOT NULL,
ALTER COLUMN "punishments" DROP NOT NULL,
ALTER COLUMN "alternates" DROP NOT NULL,
ALTER COLUMN "quoteFlashingAllowed" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Urge" ADD COLUMN     "date" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatar",
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "image" TEXT,
ADD COLUMN     "password" TEXT;

-- AlterTable
ALTER TABLE "Violation" ADD COLUMN     "dateString" TEXT,
ALTER COLUMN "tauntStatement" DROP DEFAULT;

-- DropEnum
DROP TYPE "MoodType";

-- CreateTable
CREATE TABLE "LoggedQuote" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "philosopher" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoggedQuote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE INDEX "HourlyCheckin_userId_entryDate_idx" ON "HourlyCheckin"("userId", "entryDate");

-- CreateIndex
CREATE INDEX "MoodTracker_userId_date_idx" ON "MoodTracker"("userId", "date");

-- CreateIndex
CREATE INDEX "PointsTxn_userId_idx" ON "PointsTxn"("userId");

-- CreateIndex
CREATE INDEX "Ritual_userId_date_idx" ON "Ritual"("userId", "date");

-- CreateIndex
CREATE INDEX "TimeBlock_userId_date_idx" ON "TimeBlock"("userId", "date");

-- CreateIndex
CREATE INDEX "Timer_userId_idx" ON "Timer"("userId");

-- CreateIndex
CREATE INDEX "Urge_userId_date_idx" ON "Urge"("userId", "date");

-- CreateIndex
CREATE INDEX "Violation_userId_dateString_idx" ON "Violation"("userId", "dateString");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeBlock" ADD CONSTRAINT "TimeBlock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ritual" ADD CONSTRAINT "Ritual_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timer" ADD CONSTRAINT "Timer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HourlyCheckin" ADD CONSTRAINT "HourlyCheckin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Violation" ADD CONSTRAINT "Violation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointsTxn" ADD CONSTRAINT "PointsTxn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoodTracker" ADD CONSTRAINT "MoodTracker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Urge" ADD CONSTRAINT "Urge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mood" ADD CONSTRAINT "Mood_hourlyCheckinId_fkey" FOREIGN KEY ("hourlyCheckinId") REFERENCES "HourlyCheckin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
