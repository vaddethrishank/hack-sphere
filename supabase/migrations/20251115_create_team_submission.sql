-- Migration: create team_submission table for Round 2
-- Run this in Supabase SQL editor or via psql connected to your Supabase DB

BEGIN;

CREATE TABLE IF NOT EXISTS public.team_submission (
  id bigint generated always as identity primary key,
  team_id text NOT NULL,
  solution_file_url text NOT NULL,
  mae double precision,
  rmse double precision,
  rmsle double precision,
  score double precision,
  rank integer,
  created_at timestamp without time zone DEFAULT now()
);

-- Optional: add foreign key to teams if your teams.id is text
-- ALTER TABLE public.team_submission
--   ADD CONSTRAINT team_submission_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams (id);

-- Unique constraint: only one submission per team
ALTER TABLE public.team_submission
  ADD CONSTRAINT uq_team_submission_team_id UNIQUE(team_id);

-- Index to speed queries by team
CREATE INDEX IF NOT EXISTS idx_team_submission_team_id ON public.team_submission(team_id);

COMMIT;

-- Verification queries:
-- 1) Check table exists:
-- SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name='team_submission';
-- 2) See columns:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='public' AND table_name='team_submission';
-- 3) Read recent rows:
-- SELECT * FROM public.team_submission ORDER BY created_at DESC LIMIT 10;
