-- Migration: add member_id and duration_in_minutes to round1_submissions
-- Run this in Supabase SQL editor or via psql connected to your Supabase DB
BEGIN;

ALTER TABLE public.round1_submissions
  ADD COLUMN IF NOT EXISTS member_id text,
  ADD COLUMN IF NOT EXISTS duration_in_minutes integer;

COMMIT;

-- Verification: run this to confirm the columns exist
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='public' AND table_name='round1_submissions';
