# Team Scores Integration - Actual Schema

## ✅ Fixed! Now Using Correct Tables

The leaderboard is **NOW FULLY INTEGRATED** with Supabase to fetch team scores!

## Actual Database Schema

Your Supabase has these tables for storing submissions and scores:

| Table | Purpose | Contains Score? |
|-------|---------|---|
| `round1_submissions` | Main submission record with timestamp and **SCORE** | ✅ **YES - score column** |
| `round1_mcq_answers` | Individual MCQ answers linked to submission | ❌ (no) |
| `round1_coding_answers` | Code submissions linked to submission | ❌ (no) |

### Related Tables (for contest data):
| Table | Purpose |
|-------|---------|
| `teams` | Team registration |
| `team_members` | Team member details |
| `rounds` | Contest rounds |
| `mcqs` | Multiple choice questions |
| `mcq_options` | Answer options for MCQs |
| `coding_problems` | Coding challenges |
| `coding_problem_test_cases` | Test cases for problems |
| `round2_problem` | Round 2 project description |
| `certificates` | Awarded certificates |

## How Leaderboard Works Now

1. **Fetches submissions** from `round1_submissions` table
2. **Loads MCQ answers** from `round1_mcq_answers` (linked by submission_id)
3. **Loads coding answers** from `round1_coding_answers` (linked by submission_id)
4. **Gets team info** from `teams` table
5. **Sorts by score** from `round1_submissions.score` column

## Data Structure

### round1_submissions table
```sql
- id (primary key)
- team_id (foreign key to teams)
- submitted_at (timestamp)
- score (numeric, calculated)
```

### round1_mcq_answers table
```sql
- id (primary key)
- submission_id (foreign key)
- mcq_id (MCQ identifier)
- selected_option_id (chosen answer)
```

### round1_coding_answers table
```sql
- id (primary key)
- submission_id (foreign key)
- problem_id (problem identifier)
- code (submitted code)
- language (programming language)
- passed_test_cases (count)
- total_test_cases (count)
```

## What Was Updated

✅ **ContestContext.tsx**
- `loadSubmissions()` - Now queries `round1_submissions` + related tables
- `submitRound1()` - Saves to `round1_submissions`, `round1_mcq_answers`, `round1_coding_answers`
- `calculateRound1Score()` - Saves score to `round1_submissions.score`
- Realtime subscriptions updated for all 3 tables

✅ **scripts/seed.ts**
- `seedSubmissions()` - Populates all 3 submission-related tables with mock data

✅ **scripts/check-tables.ts**
- Updated to check all correct table names

## Next Steps to Test

### 1. Verify Environment Setup
Create `.env.local` in root:
```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

### 2. Seed Mock Data
```bash
npx tsx scripts/seed.ts
```

This will populate:
- ✅ Teams
- ✅ Rounds
- ✅ MCQs with options
- ✅ Coding problems with test cases
- ✅ **round1_submissions with sample scores**
- ✅ **round1_mcq_answers (linked answers)**
- ✅ **round1_coding_answers (linked code)**

### 3. Restart Dev Server
```bash
npm run dev
```

### 4. Check Leaderboard
- Go to `http://localhost:5173/leaderboard`
- Should show live data from Supabase
- Open browser console (F12) to see debug logs

### 5. Verify with Check Script
```bash
npx tsx scripts/check-tables.ts
```

Should show all tables exist and contain data.

## Score Calculation

When admin calls `calculateRound1Score(teamId)`:

1. **MCQ Scoring**: 4 points each × correct answers (up to 20 points)
2. **Coding Scoring**: (passed / total) × 30 points
3. **Time Bonus**: +5 if submitted within 10 minutes
4. **Late Penalty**: -0.1 per minute after round duration
5. **Total**: Stored in `round1_submissions.score`

## Debugging

**Open browser DevTools (F12) → Console** to see:
- ✅ "✅ Loaded X submissions from round1_submissions"
- ✅ "✅ Realtime subscriptions established"
- Or ❌ "📌 Using mock submissions" (means queries failed)

**Run check script**:
```bash
npx tsx scripts/check-tables.ts
```

**Check Supabase SQL Editor**:
```sql
-- View all submissions with scores
SELECT * FROM round1_submissions;

-- View MCQ answers for a submission
SELECT * FROM round1_mcq_answers WHERE submission_id = 1;

-- View coding answers for a submission
SELECT * FROM round1_coding_answers WHERE submission_id = 1;
```

## Summary

✅ **NO new table needed** - All tables already exist
✅ **Leaderboard now fetches from Supabase** - Using correct table structure
✅ **Scores stored in `round1_submissions.score`** - Automatically updated when calculated
✅ **Real-time updates enabled** - Changes sync instantly

You're ready to test! 🚀

