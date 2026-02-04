-- Migration: Add Community Features
-- Run this in Supabase Dashboard → SQL Editor

-- Add community-related columns
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS user_id TEXT DEFAULT 'anonymous';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_prompts_is_public ON prompts(is_public);
CREATE INDEX IF NOT EXISTS idx_prompts_view_count ON prompts(view_count);

-- Update existing rows to have default values
UPDATE prompts SET is_public = false WHERE is_public IS NULL;
UPDATE prompts SET view_count = 0 WHERE view_count IS NULL;
UPDATE prompts SET user_id = 'anonymous' WHERE user_id IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN prompts.is_public IS 'Whether this prompt is visible in community explore';
COMMENT ON COLUMN prompts.view_count IS 'Number of times this prompt has been viewed';
COMMENT ON COLUMN prompts.user_id IS 'User identifier (anonymous for now)';
