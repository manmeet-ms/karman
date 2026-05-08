-- CreateEnum
CREATE TYPE "GlobalPostType" AS ENUM ('QUOTE', 'TECHNIQUE', 'ACHIEVEMENT', 'ADVICE');

-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "description" TEXT,
ADD COLUMN     "time" TEXT;

-- CreateTable
CREATE TABLE "GlobalPost" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "GlobalPostType" NOT NULL,
    "content" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GlobalPost_userId_type_idx" ON "GlobalPost"("userId", "type");

-- AddForeignKey
ALTER TABLE "GlobalPost" ADD CONSTRAINT "GlobalPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
