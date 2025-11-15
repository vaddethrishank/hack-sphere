# 📋 Round 2 Database Setup Guide

## Overview

Round 2 now integrates with Supabase. To fully migrate from mock data to database, follow these steps.

---

## Step 1: Add the `problem_file_url` Column

If you haven't already added this column to your `round2_problem` table, do it now:

### In Supabase Dashboard:

1. Go to **SQL Editor**
2. Run this SQL:

```sql
ALTER TABLE round2_problem
ADD COLUMN IF NOT EXISTS problem_file_url TEXT;
```

### What this does:
- Adds an optional `problem_file_url` column to store the path to the problem zip file
- If the column already exists, this does nothing

---

## Step 2: Create the `round2_submissions` Table

This table stores team submissions for Round 2. Run this SQL in Supabase:

```sql
CREATE TABLE IF NOT EXISTS round2_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    solution_file_url TEXT NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id)
);

CREATE INDEX IF NOT EXISTS idx_round2_submissions_team_id ON round2_submissions(team_id);
```

### What this does:
- Creates a table to store each team's Round 2 solution submission
- Each team can only submit once (UNIQUE constraint on team_id)
- Automatically records submission timestamp

---

## Step 3: Seed Round 2 Problem Data

Update your round2_problem table with real data:

```bash
npx tsx scripts/seed.ts
```

This will:
- Insert a sample Round 2 problem into the database
- Set title, description, url, and problem_file_url fields

---

## Step 4: Upload Problem File (Optional)

To allow teams to download the problem file:

1. Go to Supabase Dashboard → Storage
2. Create a bucket called `round2_problems` (if not exists)
3. Upload your problem zip file
4. Copy the public URL
5. Update the `round2_problem` table row with the URL in `problem_file_url`

Example:
```sql
UPDATE round2_problem 
SET problem_file_url = 'https://your-bucket-url/path/to/problem.zip'
WHERE id = 'your-problem-id';
```

---

## Step 5: Enable Storage for Solutions

Teams will upload solution files. Set up a storage bucket:

1. Supabase Dashboard → Storage
2. Create a bucket called `round2_solutions`
3. Set the bucket to **Public** (so URLs are accessible)
4. (Optional) Set a max file size policy

---

## Verification

Once set up, check the browser console for these log messages:

✅ **Success:**
```
✅ Loaded Round 2 problem from Supabase
✅ Round 2 submissions table ready
```

⚠️ **Issues to watch for:**
```
ℹ️  Falling back to mock data. Make sure to:
   1. Add problem_file_url column to round2_problem table if missing
   2. Run: npx tsx scripts/seed.ts
```

---

## What Changed in Code

### Types (`types.ts`)
- `Round2Problem` now includes optional `id` and `problemFileUrl`
- New `Round2Submission` type for storing submissions

### Context (`contexts/ContestContext.tsx`)
- `loadRound2Problem()` now fetches from `round2_problem` table
- `loadRound2Submissions()` fetches all team submissions
- `submitRound2()` uploads solution file and saves to database
- `getTeamRound2Submission()` retrieves a team's submission

### Page (`pages/contest/Round2SubmissionPage.tsx`)
- Downloads problem file from `problemFileUrl` instead of reference link
- Uploads solution zip to Supabase storage
- Persists submission to database via `submitRound2()`
- Checks for existing submission to prevent duplicates

---

## Troubleshooting

### Issue: Still seeing mock data in Round 2

**Solution:**
1. Check browser console for error messages
2. Verify `round2_problem` table has data:
   ```sql
   SELECT * FROM round2_problem;
   ```
3. Run seed script again:
   ```bash
   npx tsx scripts/seed.ts
   ```

### Issue: Upload failing with "bucket not found"

**Solution:**
1. Create `round2_solutions` bucket in Supabase Storage
2. Make it Public (set to allow anonymous access)
3. Try uploading again

### Issue: "Column problem_file_url not found"

**Solution:**
1. Run the ALTER TABLE statement above in Supabase SQL Editor
2. Refresh page and try again

---

## Admin Page for Round 2 Submissions

To view all Round 2 submissions, add an admin page that queries the `round2_submissions` table:

```typescript
// pages/admin/ViewRound2Submissions.tsx
const { data } = await supabase
    .from('round2_submissions')
    .select('*, teams(name)')
    .order('submitted_at', { ascending: false });
```

---

## Summary

| Component | Source | Status |
|-----------|--------|--------|
| Round 2 Problem | `round2_problem` table | ✅ DB |
| Round 2 Submissions | `round2_submissions` table | ✅ DB |
| Problem File Download | `problem_file_url` column | ✅ DB |
| Solution Upload | Supabase Storage | ✅ Storage |

Round 2 is now **fully integrated** with Supabase! 🎉
