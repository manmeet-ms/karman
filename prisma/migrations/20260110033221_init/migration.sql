-- CreateEnum
CREATE TYPE "ViolationTypeEnum" AS ENUM ('missed_block', 'missed_ritual', 'failed_timer');

-- CreateEnum
CREATE TYPE "TxnType" AS ENUM ('TIMEBLOCK_COMPLETE_CREDIT', 'ALL_DAILY_COMPLETE_CREDIT', 'VIOLATION_RESOLVED_CREDIT', 'NEW_STREAK_CREDIT', 'EXTEND_STREAK_CREDIT', 'DIARY_WRITING_CREDIT', 'RITUAL_COMPLETE_CREDIT', 'URGE_LOGGED_CREDIT', 'URGE_RESISTED_CREDIT', 'MOOD_LOGGED_CREDIT', 'MOOD_IMPROVEMENT_CREDIT', 'RITUAL_MISS_PENALTY', 'URGE_FAILURE_PENALTY', 'BLOCK_MISS_PENALTY', 'STREAK_BREAK_PENALTY', 'VIOLATION_PENALTY', 'TIMER_RESET_PENALTY', 'PUNISHMENT_TRIGGER_PENALTY', 'DEFAULT');

-- CreateEnum
CREATE TYPE "MoodType" AS ENUM ('Happy', 'Anxious', 'Angry', 'Stressed', 'Sad', 'Neutral', 'Excited');

-- CreateEnum
CREATE TYPE "MoodTypeEnum" AS ENUM ('happy', 'anxious', 'angry', 'sad', 'neutral', 'excited');

-- CreateEnum
CREATE TYPE "UrgeTypeEnum" AS ENUM ('procrastination', 'distraction', 'doomscroll', 'browsing', 'addiction', 'other');

-- CreateEnum
CREATE TYPE "UrgeTriggerEnum" AS ENUM ('boredom', 'stress', 'anxiety', 'habitual_time', 'social_media_notification', 'being_alone', 'seeing_others_online', 'avoiding_hard_task', 'tiredness', 'mindless_routine', 'dopamine_craving', 'overwhelmed', 'no_clear_goal', 'peer_influence', 'seeking_comfort');

-- CreateEnum
CREATE TYPE "UrgeLocationEnum" AS ENUM ('bedroom', 'workspace', 'library', 'college', 'commute', 'living_room', 'alone', 'in_public');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerType" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refreshToken" TEXT,
    "accessToken" TEXT,
    "accessTokenExpires" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "fullname" TEXT,
    "email" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "avatar" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "passwordResetToken" TEXT,
    "passwordResetTokenExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeBlock" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "strict" BOOLEAN NOT NULL DEFAULT true,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ritual" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "vow" TEXT NOT NULL,
    "completedDailyCheckIn" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ritual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Timer" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "codename" TEXT NOT NULL,
    "failures" INTEGER NOT NULL,
    "timerStarted" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "perks" JSONB NOT NULL,
    "punishments" JSONB NOT NULL,
    "alternates" JSONB NOT NULL,
    "quoteFlashingAllowed" BOOLEAN,
    "pulseTheme" TEXT,

    CONSTRAINT "Timer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HourlyCheckin" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT 'def: No Activity Shared',
    "tag" TEXT NOT NULL DEFAULT 'def: No activity',
    "entryDate" TEXT,
    "context" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HourlyCheckin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Violation" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "type" "ViolationTypeEnum" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "tauntStatement" TEXT DEFAULT 'is_null_default',
    "blockData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Violation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PointsTxn" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "user" TEXT,
    "type" "TxnType" NOT NULL,
    "points" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PointsTxn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mood" (
    "id" TEXT NOT NULL,
    "hourlyCheckinId" TEXT NOT NULL,
    "moodType" "MoodType" NOT NULL,
    "intensity" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "tags" TEXT[],
    "trigger" TEXT,
    "location" TEXT,
    "physicalState" TEXT,

    CONSTRAINT "Mood_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "MoodTracker" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "moodType" "MoodTypeEnum" NOT NULL,
    "intensity" INTEGER NOT NULL DEFAULT 6,
    "notes" TEXT,
    "tags" TEXT[],
    "trigger" TEXT,
    "location" TEXT,
    "physicalState" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoodTracker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PushSubscription" (
    "id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "keys" JSONB,

    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Urge" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "urgeTimeStamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "urgeIntensity" INTEGER NOT NULL DEFAULT 6,
    "urgeType" "UrgeTypeEnum" NOT NULL DEFAULT 'other',
    "urgeTrigger" "UrgeTriggerEnum",
    "urgeLocation" "UrgeLocationEnum",
    "urgeResolved" BOOLEAN NOT NULL DEFAULT false,
    "urgeNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Urge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhilosopherQuote" (
    "id" TEXT NOT NULL,
    "philosopher" JSONB NOT NULL,
    "quotes" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhilosopherQuote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_providerId_providerAccountId_key" ON "Account"("providerId", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Session_accessToken_key" ON "Session"("accessToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TimeBlock_date_task_key" ON "TimeBlock"("date", "task");

-- CreateIndex
CREATE UNIQUE INDEX "Mood_hourlyCheckinId_key" ON "Mood"("hourlyCheckinId");

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_endpoint_key" ON "PushSubscription"("endpoint");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mood" ADD CONSTRAINT "Mood_hourlyCheckinId_fkey" FOREIGN KEY ("hourlyCheckinId") REFERENCES "HourlyCheckin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
