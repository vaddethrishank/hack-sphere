# ✅ Integration Verification Checklist

## Pre-Flight Checks

- [ ] `.env.local` file created in root directory
- [ ] Contains `VITE_SUPABASE_URL` (from Supabase Settings → API)
- [ ] Contains `VITE_SUPABASE_ANON_KEY` (from Supabase Settings → API)
- [ ] `.env.local` is NOT committed to Git (in .gitignore)

## Database Verification

- [ ] Run: `npx tsx scripts/check-tables.ts`
- [ ] Output shows all tables exist:
  - [ ] `teams`
  - [ ] `rounds`
  - [ ] `mcqs`
  - [ ] `mcq_options`
  - [ ] `coding_problems`
  - [ ] `coding_problem_test_cases`
  - [ ] `round1_submissions` (with data count > 0)
  - [ ] `round1_mcq_answers` (with data count > 0)
  - [ ] `round1_coding_answers` (with data count > 0)
  - [ ] `round2_problem`
  - [ ] `certificates`

## Data Seeding

- [ ] Run: `npx tsx scripts/seed.ts`
- [ ] Output shows ✅ success for all tables:
  - [ ] ✅ Seeded 4 teams
  - [ ] ✅ Seeded 3 rounds
  - [ ] ✅ Seeded 2 MCQs with options
  - [ ] ✅ Seeded 1 coding problems with test cases
  - [ ] ✅ Seeded Round 2 problem
  - [ ] ✅ Seeded 1 certificates
  - [ ] ✅ Seeded 2 submissions with answers
- [ ] No errors reported

## Application Startup

- [ ] Run: `npm run dev`
- [ ] Dev server starts without errors
- [ ] No TypeScript compilation errors
- [ ] Navigate to `http://localhost:5173`

## Browser Console Verification

Open DevTools (F12) → Console and look for:

- [ ] `🚀 ContestContext: Initializing data from Supabase...`
- [ ] `📥 Loading submissions from Supabase...`
- [ ] `✅ Loaded 2 submissions from round1_submissions`
- [ ] `📡 Setting up realtime subscriptions...`
- [ ] `✅ Realtime subscriptions established`
- [ ] `✨ ContestContext: Data initialization complete`

**If you see any ❌ errors instead, note them for troubleshooting**

## Leaderboard Page Test

- [ ] Navigate to `/leaderboard` page
- [ ] Table displays with columns: Rank, Team Name, College, Score
- [ ] Scores are **NOT** "undefined" or "null"
- [ ] Teams are sorted by score (highest first)
- [ ] Row count matches number of submissions (should be 2)
- [ ] Team names appear correctly (Code Wizards, Binary Bandits, etc.)

## Interactivity Tests

- [ ] Click "Round 1" button - page doesn't error
- [ ] Click "All Colleges" dropdown - works
- [ ] Select a college from dropdown - filters leaderboard
- [ ] Select "All Colleges" again - shows all teams
- [ ] Scroll table horizontally (on mobile) - no issues

## Code Changes Validation

- [ ] Check: `contexts/ContestContext.tsx` - Uses `round1_submissions` ✅
- [ ] Check: `contexts/ContestContext.tsx` - Has `loadSubmissions()` with Supabase query ✅
- [ ] Check: `contexts/ContestContext.tsx` - Has realtime subscriptions ✅
- [ ] Check: `scripts/seed.ts` - Populates `round1_submissions` ✅
- [ ] Check: `scripts/seed.ts` - Populates `round1_mcq_answers` ✅
- [ ] Check: `scripts/seed.ts` - Populates `round1_coding_answers` ✅

## Supabase Dashboard Verification

In Supabase Console:

- [ ] Go to **SQL Editor**
- [ ] Run: `SELECT COUNT(*) FROM round1_submissions;`
- [ ] Result shows: `count = 2` (or more if seeded multiple times)
- [ ] Run: `SELECT * FROM round1_submissions;`
- [ ] Results show:
  - [ ] `team_id` values (team-1, team-2)
  - [ ] `submitted_at` timestamps
  - [ ] `score` values (numbers like 10, 20, etc.)
- [ ] Run: `SELECT COUNT(*) FROM round1_mcq_answers;`
- [ ] Result shows count > 0
- [ ] Run: `SELECT COUNT(*) FROM round1_coding_answers;`
- [ ] Result shows count > 0

## Real-Time Updates Test

- [ ] In Supabase SQL Editor, run:
  ```sql
  UPDATE round1_submissions 
  SET score = 999 
  WHERE team_id = 'team-1';
  ```
- [ ] Leaderboard page **automatically updates** within 2 seconds
- [ ] team-1 now shows score of 999
- [ ] team-1 moved to rank 1 (if highest score)

## Rollback & Clean Test (Optional)

- [ ] In Supabase SQL Editor:
  ```sql
  DELETE FROM round1_submissions;
  DELETE FROM round1_mcq_answers;
  DELETE FROM round1_coding_answers;
  ```
- [ ] Leaderboard shows "No scores calculated yet" message
- [ ] Run: `npx tsx scripts/seed.ts` again
- [ ] Leaderboard repopulates with data ✅

---

## Summary

**✅ All checks passed?** → Integration is complete and working!

**❌ Some checks failed?** 
- Check browser console for error messages
- Check `.env.local` has correct credentials
- Run `npx tsx scripts/check-tables.ts` to diagnose
- Check Supabase SQL Editor for data

**🎉 Success Indicators:**
- Leaderboard shows team names and scores from Supabase
- Console shows successful Supabase queries
- No mock data being used
- Real-time updates work when data changes
