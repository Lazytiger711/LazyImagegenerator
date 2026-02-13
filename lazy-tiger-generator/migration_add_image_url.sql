-- 1. Ensure image_url column exists
alter table prompts 
add column if not exists image_url text;

-- 2. Force schema cache reload
NOTIFY pgrst, 'reload config';
