-- 1. Create the table (if it doesn't exist)
create table if not exists prompts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  prompt_text text,
  settings jsonb
);

-- 2. Enable Row Level Security (RLS)
-- This fixes the "RLS Disabled in Public" warning.
-- Once enabled, NO ONE can access the table unless a policy exists.
alter table prompts enable row level security;

-- 3. Create Policy: Allow anyone (Anon) to INSERT (Save)
create policy "Enable insert for all users"
on prompts for insert
with check (true);

-- 4. Create Policy: Allow anyone (Anon) to SELECT (View)
create policy "Enable select for all users"
on prompts for select
using (true);

-- Note: In a real production app with user logins, you would likely restrict these policies.
-- But for this public prompt builder, allowing public read/write is the intended behavior.
