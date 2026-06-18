-- CreateTable
CREATE TABLE "cards" (
    "id" SERIAL NOT NULL,
    "character" TEXT NOT NULL,
    "trend" TEXT NOT NULL,
    "phrase" TEXT NOT NULL,
    "video" TEXT,
    "image" TEXT,
    "voice_type" TEXT,
    "voice_emotion" TEXT,
    "audio" TEXT,
    "color" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cards_is_active_idx" ON "cards"("is_active");

-- CreateIndex
CREATE INDEX "cards_difficulty_idx" ON "cards"("difficulty");
