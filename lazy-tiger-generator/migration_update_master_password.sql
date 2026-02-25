-- Update the delete function with the new master password
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
  -- 2. If input password matches MASTER KEY 'LAZY' -> DELETE
  IF v_stored_password = p_password OR p_password = 'LAZY' THEN
    DELETE FROM prompts WHERE id = p_id;
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the update function with the new master password
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

  IF v_stored_password = p_password OR p_password = 'LAZY' THEN
    UPDATE prompts 
    SET title = p_title, description = p_description
    WHERE id = p_id;
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reload schema cache to recognize new functions
NOTIFY pgrst, 'reload config';
