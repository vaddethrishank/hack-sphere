# 🐛 Round 1 Submission Fix

## Problem
Round 1 submissions were not being saved because the submission was missing critical required information:
- **memberId** - The individual team member submitting
- **durationInMinutes** - How long they took to complete

## Root Cause
The `Round1ContestPage.tsx` was calling `submitRound1()` with only `teamId`, `mcqAnswers`, and `codingAnswers`. However, the database schema expects per-member submissions with duration tracking.

## Solution

### 1. Updated Round1ContestPage.tsx
Added logic to:
- **Extract current user's ID** as `memberId` (from `user.id`)
- **Calculate submission duration** from localStorage start time
- **Pass both** to `submitRound1()`

```typescript
const handleSubmit = useCallback(async () => {
    if (user && user.teamId && !existingSubmission && !isSubmitted) {
        try {
            // Calculate duration from localStorage
            const startTimeKey = `round1_startTime_${user.teamId}`;
            const storedStartTime = localStorage.getItem(startTimeKey);
            let durationInMinutes = 0;
            if (storedStartTime) {
                const startTime = parseInt(storedStartTime, 10);
                durationInMinutes = Math.round((Date.now() - startTime) / 60000);
            }

            await submitRound1({ 
                teamId: user.teamId, 
                mcqAnswers, 
                codingAnswers,
                memberId: user.id,        // ✅ ADD: Current user ID
                durationInMinutes,        // ✅ ADD: Time taken
            });
```

### 2. Enhanced ContestContext.tsx
Added detailed logging to track:
- ✅ When submission is received
- ✅ memberId being added
- ✅ Duration calculation
- ✅ DB insertion payload
- ✅ Success/error feedback

## What Gets Saved Now

For each Round 1 submission, the database now stores:

| Field | Value | Purpose |
|-------|-------|---------|
| `id` | UUID | Unique submission ID |
| `team_id` | string | Which team submitted |
| `member_id` | string | **NEW:** Which team member submitted |
| `submitted_at` | timestamp | When it was submitted |
| `duration_in_minutes` | number | **NEW:** How long they took |
| MCQ answers | JSON | Answers to MCQs |
| Coding answers | JSON | Code submissions |
| Scores | number | Per-submission score |

## Testing

To verify it works:

1. **Start Round 1** (set status to 'Active' in admin)
2. **Go to Round 1** as a team member
3. **Complete the contest** and click "Finish & Submit Test"
4. **Check browser DevTools Console** for logs:
   ```
   📤 Submitting Round 1... { submission: ... }
   👤 Adding memberId: user-123
   ⏱️  Adding duration: 45 minutes
   💾 Saving to DB: { team_id: ..., member_id: ..., duration_in_minutes: ... }
   ✅ Submission saved with ID: sub-456
   ```
5. **Check Supabase** → round1_submissions table → verify row has member_id and duration_in_minutes

## Benefits

✅ **Per-member tracking** - Know which team member submitted  
✅ **Time tracking** - Know how long each member took  
✅ **Fair scoring** - Calculate individual and team averages  
✅ **Better analytics** - Identify high/low performers on the team  

## Next Steps (Optional)

- Create admin page to view per-member submissions
- Add team member leaderboard showing individual times
- Adjust scoring to account for individual performance
- Send individual submission confirmations to team members
