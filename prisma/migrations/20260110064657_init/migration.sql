/*
  Warnings:

  - The values [Happy,Anxious,Angry,Stressed,Sad,Neutral,Excited] on the enum `MoodType` will be removed. If these variants are still used in the database, this will fail.
  - The values [happy,anxious,angry,sad,neutral,excited] on the enum `MoodTypeEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [bedroom,workspace,library,college,commute,living_room,alone,in_public] on the enum `UrgeLocationEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [boredom,stress,anxiety,habitual_time,social_media_notification,being_alone,seeing_others_online,avoiding_hard_task,tiredness,mindless_routine,dopamine_craving,overwhelmed,no_clear_goal,peer_influence,seeking_comfort] on the enum `UrgeTriggerEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [procrastination,distraction,doomscroll,browsing,addiction,other] on the enum `UrgeTypeEnum` will be removed. If these variants are still used in the database, this will fail.
  - The values [missed_block,missed_ritual,failed_timer] on the enum `ViolationTypeEnum` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `uid` on the `HourlyCheckin` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `MoodTracker` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `PointsTxn` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `PointsTxn` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `Ritual` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `TimeBlock` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `Timer` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `Urge` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `Violation` table. All the data in the column will be lost.
  - You are about to drop the `LoggedQuote` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `HourlyCheckin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `MoodTracker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `PointsTxn` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Ritual` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `TimeBlock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Timer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Urge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Violation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MoodType_new" AS ENUM ('HAPPY', 'ANXIOUS', 'ANGRY', 'STRESSED', 'SAD', 'NEUTRAL', 'EXCITED');
ALTER TABLE "Mood" ALTER COLUMN "moodType" TYPE "MoodType_new" USING ("moodType"::text::"MoodType_new");
ALTER TYPE "MoodType" RENAME TO "MoodType_old";
ALTER TYPE "MoodType_new" RENAME TO "MoodType";
DROP TYPE "public"."MoodType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "MoodTypeEnum_new" AS ENUM ('HAPPY', 'ANXIOUS', 'ANGRY', 'SAD', 'NEUTRAL', 'EXCITED');
ALTER TABLE "MoodTracker" ALTER COLUMN "moodType" TYPE "MoodTypeEnum_new" USING ("moodType"::text::"MoodTypeEnum_new");
ALTER TYPE "MoodTypeEnum" RENAME TO "MoodTypeEnum_old";
ALTER TYPE "MoodTypeEnum_new" RENAME TO "MoodTypeEnum";
DROP TYPE "public"."MoodTypeEnum_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UrgeLocationEnum_new" AS ENUM ('BEDROOM', 'WORKSPACE', 'LIBRARY', 'COLLEGE', 'COMMUTE', 'LIVING_ROOM', 'ALONE', 'IN_PUBLIC');
ALTER TABLE "Urge" ALTER COLUMN "urgeLocation" TYPE "UrgeLocationEnum_new" USING ("urgeLocation"::text::"UrgeLocationEnum_new");
ALTER TYPE "UrgeLocationEnum" RENAME TO "UrgeLocationEnum_old";
ALTER TYPE "UrgeLocationEnum_new" RENAME TO "UrgeLocationEnum";
DROP TYPE "public"."UrgeLocationEnum_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UrgeTriggerEnum_new" AS ENUM ('BOREDOM', 'STRESS', 'ANXIETY', 'HABITUAL_TIME', 'SOCIAL_MEDIA_NOTIFICATION', 'BEING_ALONE', 'SEEING_OTHERS_ONLINE', 'AVOIDING_HARD_TASK', 'TIREDNESS', 'MINDLESS_ROUTINE', 'DOPAMINE_CRAVING', 'OVERWHELMED', 'NO_CLEAR_GOAL', 'PEER_INFLUENCE', 'SEEKING_COMFORT');
ALTER TABLE "Urge" ALTER COLUMN "urgeTrigger" TYPE "UrgeTriggerEnum_new" USING ("urgeTrigger"::text::"UrgeTriggerEnum_new");
ALTER TYPE "UrgeTriggerEnum" RENAME TO "UrgeTriggerEnum_old";
ALTER TYPE "UrgeTriggerEnum_new" RENAME TO "UrgeTriggerEnum";
DROP TYPE "public"."UrgeTriggerEnum_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UrgeTypeEnum_new" AS ENUM ('PROCRASTINATION', 'DISTRACTION', 'DOOMSCROLL', 'BROWSING', 'ADDICTION', 'OTHER');
ALTER TABLE "public"."Urge" ALTER COLUMN "urgeType" DROP DEFAULT;
ALTER TABLE "Urge" ALTER COLUMN "urgeType" TYPE "UrgeTypeEnum_new" USING ("urgeType"::text::"UrgeTypeEnum_new");
ALTER TYPE "UrgeTypeEnum" RENAME TO "UrgeTypeEnum_old";
ALTER TYPE "UrgeTypeEnum_new" RENAME TO "UrgeTypeEnum";
DROP TYPE "public"."UrgeTypeEnum_old";
ALTER TABLE "Urge" ALTER COLUMN "urgeType" SET DEFAULT 'OTHER';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ViolationTypeEnum_new" AS ENUM ('MISSED_BLOCK', 'MISSED_RITUAL', 'FAILED_TIMER');
ALTER TABLE "Violation" ALTER COLUMN "type" TYPE "ViolationTypeEnum_new" USING ("type"::text::"ViolationTypeEnum_new");
ALTER TYPE "ViolationTypeEnum" RENAME TO "ViolationTypeEnum_old";
ALTER TYPE "ViolationTypeEnum_new" RENAME TO "ViolationTypeEnum";
DROP TYPE "public"."ViolationTypeEnum_old";
COMMIT;

-- AlterTable
ALTER TABLE "HourlyCheckin" DROP COLUMN "uid",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MoodTracker" DROP COLUMN "uid",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PointsTxn" DROP COLUMN "uid",
DROP COLUMN "user",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ritual" DROP COLUMN "uid",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TimeBlock" DROP COLUMN "uid",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Timer" DROP COLUMN "uid",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Urge" DROP COLUMN "uid",
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "urgeType" SET DEFAULT 'OTHER';

-- AlterTable
ALTER TABLE "Violation" DROP COLUMN "uid",
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "LoggedQuote";

-- AddForeignKey
ALTER TABLE "TimeBlock" ADD CONSTRAINT "TimeBlock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ritual" ADD CONSTRAINT "Ritual_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timer" ADD CONSTRAINT "Timer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HourlyCheckin" ADD CONSTRAINT "HourlyCheckin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Violation" ADD CONSTRAINT "Violation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointsTxn" ADD CONSTRAINT "PointsTxn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoodTracker" ADD CONSTRAINT "MoodTracker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Urge" ADD CONSTRAINT "Urge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
