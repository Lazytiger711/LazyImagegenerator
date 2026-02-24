-- Migration: Add View Count RPC
-- Run this in Supabase Dashboard → SQL Editor

-- Create function to increment view count (Atomic update)
CREATE OR REPLACE FUNCTION increment_view_count(p_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE prompts
    SET view_count = view_count + 1
    WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;

-- Grant execution to public
GRANT EXECUTE ON FUNCTION increment_view_count TO public;
GRANT EXECUTE ON FUNCTION increment_view_count TO anon;
