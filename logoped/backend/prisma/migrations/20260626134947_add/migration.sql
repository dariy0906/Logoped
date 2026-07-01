-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('child', 'parent');

-- CreateTable
CREATE TABLE "ExerciseCard" (
    "id" SERIAL NOT NULL,
    "character" TEXT NOT NULL,
    "trend" TEXT NOT NULL,
    "phrase" TEXT NOT NULL,
    "voiceType" TEXT NOT NULL,
    "voiceEmotion" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExerciseCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_email_key" ON "Profile"("email");
