-- Migration 012: Allow guest attempts with lookup code and sync support
ALTER TABLE jlpt_attempts ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE jlpt_attempts ADD COLUMN IF NOT EXISTS lookup_code text UNIQUE;

CREATE INDEX IF NOT EXISTS jlpt_attempts_lookup_code_idx
  ON jlpt_attempts(lookup_code);
