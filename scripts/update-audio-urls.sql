-- Update all song audio URLs to use the enhanced audio samples
-- Maps all 248 songs to 30 enhanced audio files in round-robin fashion

-- First, let's create a temporary sequence to map songs to audio files
WITH numbered_songs AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY "createdAt") as row_num
  FROM songs
),
audio_mapping AS (
  SELECT
    id,
    '/uploads/audio/song-sample-' ||
    LPAD(((row_num - 1) % 30 + 1)::text, 3, '0') ||
    '.wav' as new_audio_url
  FROM numbered_songs
)
UPDATE songs s
SET "audioFileUrl" = am.new_audio_url
FROM audio_mapping am
WHERE s.id = am.id;

-- Verify the update
SELECT COUNT(*) as total_songs,
       COUNT(DISTINCT "audioFileUrl") as unique_audio_files
FROM songs;
