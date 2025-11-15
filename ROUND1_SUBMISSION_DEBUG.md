# 🔧 Round 1 Submission Debugging Guide

## How to Debug Submission Issues

### Step 1: Check the Browser Console

1. Open browser DevTools (F12 or Cmd+Shift+I)
2. Go to **Console** tab
3. Complete Round 1 and click "Finish & Submit Test"
4. Look for these log messages:

#### ✅ Success Flow
```
📤 handleSubmit called { hasUser: true, hasTeamId: true, memberAlreadySubmitted: false, isSubmitted: false }
📊 Preparing submission... { teamId: ..., memberId: ..., mcqAnswersCount: ..., codingAnswersCount: ... }
⏱️  Duration: 45 minutes
🚀 Calling submitRound1...
📤 Submitting Round 1... { submission: ... }
👤 Adding memberId: user-123
💾 Saving to DB: { team_id: ..., member_id: ..., duration_in_minutes: 45 }
✅ Submission saved with ID: sub-456
✅ Submission successfully saved to Supabase
✅ submitRound1 returned successfully
```

#### ❌ Error Messages & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `❌ No user found` | Not logged in | Login first |
| `❌ User has no teamId` | Not part of a team | Register a team first |
| `❌ Member already submitted` | Already submitted | Normal - can't submit twice |
| `❌ No stored start time found` | Contest timer issue | Clear localStorage and refresh |
| `❌ Error saving submission: ...` | Database error | Check Supabase status & permissions |
| `❌ No submission ID returned from Supabase` | DB insert failed | Check table schema |

### Step 2: Check localStorage

In console, run:
```javascript
// Check if start time is stored
localStorage.getItem('round1_startTime_' + 'YOUR_TEAM_ID')

// Check all localStorage
Object.entries(localStorage).forEach(([k,v]) => console.log(k, v))
```

### Step 3: Verify Supabase Connection

In console, run:
```javascript
// Check if supabase is connected
const { supabase } = await import('./lib/supabaseClient.js');
await supabase.from('rounds').select('*').limit(1);
```

### Step 4: Check Round 1 Status

Make sure:
- [ ] Round 1 is set to status `'Active'` in Supabase `rounds` table
- [ ] Current time is during the contest duration
- [ ] Duration is set (e.g., 60 minutes)

In Supabase SQL Editor:
```sql
SELECT id, status, duration_in_minutes, started_at FROM rounds WHERE id = 1;
```

Should show:
```
id | status | duration_in_minutes | started_at
1  | Active | 60                  | 2025-11-15...
```

### Step 5: Check if Member Already Submitted

In Supabase SQL Editor:
```sql
SELECT team_id, member_id, submitted_at, duration_in_minutes 
FROM round1_submissions 
WHERE team_id = 'YOUR_TEAM_ID' 
ORDER BY submitted_at DESC;
```

Should show your submission(s) with `member_id` populated.

### Step 6: Enable Extra Debugging

If you still don't see logs, check:
1. Console is NOT filtered (check filter dropdown)
2. Not using console.log override (check extensions)
3. Page is fully loaded before submitting

## Common Issues & Fixes

### Issue: "Submission is not working at all"

**Check in this order:**
1. ✅ Is Round 1 status 'Active'? (check Supabase)
2. ✅ Are you logged in? (check top-right avatar)
3. ✅ Are you on an approved team? (check dashboard)
4. ✅ Is localStorage.clear() breaking timer? (refresh page)
5. ✅ Check browser console for exact error

### Issue: "Member already submitted" message

**This is CORRECT** if:
- Same team member is submitting twice (expected - can only submit once per member)

**To test multiple members:**
- Login as Member A → Submit
- Login as Member B (same team) → Should be able to submit
- Login as Member C (same team) → Should be able to submit

### Issue: Submission shows but then disappears

**Cause:** Page refreshing and not loading data

**Fix:**
1. Check Supabase `round1_submissions` table has data
2. Check ContestContext is loading data on page load
3. Check browser console for load errors

## What Gets Submitted

Each submission saves:

```json
{
  "team_id": "team-123",
  "member_id": "user-456",
  "submitted_at": "2025-11-15T10:30:00Z",
  "duration_in_minutes": 45,
  "mcq_answers": [
    { "mcq_id": "mcq-1", "answer_id": "opt-2" }
  ],
  "coding_answers": [
    { "problem_id": "prob-1", "code": "...", "language": "javascript", "passed": 3, "total": 5 }
  ]
}
```

## Next Steps

If submission still doesn't work:

1. **Share the browser console output** (copy all error messages)
2. **Check Supabase tables:**
   - `rounds` (is Round 1 active?)
   - `users` (do you exist?)
   - `team_members` (are you in a team?)
   - `teams` (is your team approved?)
3. **Verify Supabase connection** (check `lib/supabaseClient.ts`)
4. **Check network requests** in DevTools → Network tab

---

**Key Debug Command:**
Copy this into browser console to test everything:
```javascript
console.log({
  hasLocalStorage: typeof localStorage !== 'undefined',
  hasUser: localStorage.getItem('hackathon-user'),
  teamId: JSON.parse(localStorage.getItem('hackathon-user') || '{}').teamId,
  startTime: localStorage.getItem('round1_startTime_' + JSON.parse(localStorage.getItem('hackathon-user') || '{}').teamId)
});
```
