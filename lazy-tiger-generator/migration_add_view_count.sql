-- Add view_count column if it doesn't exist
alter table prompts 
add column if not exists view_count integer default 0;

-- Force schema cache reload (sometimes this helps, but UI button is better)
NOTIFY pgrst, 'reload config';
