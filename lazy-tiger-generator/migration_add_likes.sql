-- Migration: Add Likes Feature
-- Run this in Supabase Dashboard → SQL Editor

-- Add likes_count column
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;

-- Create index for performance on popularity sorting
CREATE INDEX IF NOT EXISTS idx_prompts_likes_count ON prompts(likes_count);

-- Update existing rows (safety check)
UPDATE prompts SET likes_count = 0 WHERE likes_count IS NULL;

-- Comment for documentation
COMMENT ON COLUMN prompts.likes_count IS 'Number of likes this prompt has received from the community';

-- Create function to increment likes (Atomic update)
CREATE OR REPLACE FUNCTION increment_likes(p_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE prompts
    SET likes_count = likes_count + 1
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;

-- Grant execution to public
GRANT EXECUTE ON FUNCTION increment_likes TO public;
GRANT EXECUTE ON FUNCTION increment_likes TO anon;
