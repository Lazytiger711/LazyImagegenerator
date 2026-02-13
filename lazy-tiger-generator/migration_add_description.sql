-- Add description column to prompts table
alter table prompts 
add column if not exists description text;

-- Add title column to prompts table (if not already present, though previous plan mentioned it)
alter table prompts 
add column if not exists title text;

-- Existing columns for reference:
-- id, created_at, prompt_text, settings, is_public, image_url
