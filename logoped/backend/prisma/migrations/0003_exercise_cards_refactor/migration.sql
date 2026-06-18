UPDATE "cards"
SET
  "image" = COALESCE("image", '/images/hero.png'),
  "voice_type" = COALESCE("voice_type", 'default'),
  "voice_emotion" = COALESCE("voice_emotion", 'neutral');

ALTER TABLE "cards"
ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "voice_type" SET NOT NULL,
ALTER COLUMN "voice_emotion" SET NOT NULL;

ALTER TABLE "cards"
DROP COLUMN IF EXISTS "video",
DROP COLUMN IF EXISTS "audio",
DROP COLUMN IF EXISTS "is_active";
