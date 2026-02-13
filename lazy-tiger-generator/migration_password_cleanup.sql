-- 1. CLEANUP: Delete prompts with no image (null or empty string)
DELETE FROM prompts WHERE image_url IS NULL OR image_url = '';

-- 2. SCHEMA: Add password column (text)
ALTER TABLE prompts 
ADD COLUMN IF NOT EXISTS password text;

-- 3. RPC: Create a function to verify password and delete
-- This function returns TRUE if deleted, FALSE if password wrong
CREATE OR REPLACE FUNCTION delete_prompt_verified(
  p_id uuid,
  p_password text
) RETURNS boolean AS $$
DECLARE
  v_stored_password text;
BEGIN
  -- Get the stored password for the prompt
  SELECT password INTO v_stored_password FROM prompts WHERE id = p_id;

  -- Logic:
  -- 1. If stored password matches input password -> DELETE
  -- 2. If input password matches MASTER KEY 'lazytiger_admin' -> DELETE
  IF v_stored_password = p_password OR p_password = 'lazytiger_admin' THEN
    DELETE FROM prompts WHERE id = p_id;
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. RPC: Create a function to verify password and update (optional but good to have)
CREATE OR REPLACE FUNCTION update_prompt_verified(
  p_id uuid,
  p_password text,
  p_title text,
  p_description text
) RETURNS boolean AS $$
DECLARE
  v_stored_password text;
BEGIN
  SELECT password INTO v_stored_password FROM prompts WHERE id = p_id;

  IF v_stored_password = p_password OR p_password = 'lazytiger_admin' THEN
    UPDATE prompts 
    SET title = p_title, description = p_description
    WHERE id = p_id;
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. CACHE: Reload schema cache to recognize new functions
NOTIFY pgrst, 'reload config';
