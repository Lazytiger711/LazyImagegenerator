-- 1. Add missing 'is_public' column (if not exists)
alter table prompts 
add column if not exists is_public boolean default true;

-- 2. Enable RLS for prompts table (if not already enabled)
alter table prompts enable row level security;

-- 3. Create Policy for Public Insert (Prompts)
-- Allows anyone (public/anon) to insert rows into the prompts table
create policy "Public Prompts Insert"
on prompts for insert
to public
with check (true);

-- 4. Create Policy for Public Select (Prompts)
-- Allows anyone to read prompts where is_public is true (or all, depending on pref)
create policy "Public Prompts Select"
on prompts for select
to public
using (true);

-- 5. Create Policy for Storage Upload (Images)
-- Allows anyone to upload files to the 'images' bucket
create policy "Public Images Upload"
on storage.objects for insert
to public
with check (bucket_id = 'images');

-- 6. Create Policy for Storage Select (Images)
-- Allows anyone to view files in the 'images' bucket
create policy "Public Images Select"
on storage.objects for select
to public
using (bucket_id = 'images');
