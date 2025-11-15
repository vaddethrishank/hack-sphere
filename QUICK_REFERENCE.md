# Quick Reference - Supabase Integration

## ✅ Fixed Issue
Leaderboard now fetches **live data from Supabase** instead of mock data.

---

## 🎯 Three Tables for Submissions

| Table | Purpose | Score Column? |
|-------|---------|---|
| `round1_submissions` | Main record (team, timestamp, **SCORE**) | ✅ YES |
| `round1_mcq_answers` | MCQ responses (linked via submission_id) | ❌ no |
| `round1_coding_answers` | Code details (linked via submission_id) | ❌ no |

---

## 🚀 Quick Start

```bash
# 1. Create .env.local with credentials
echo "VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE" > .env.local

# 2. Seed database
npx tsx scripts/seed.ts

# 3. Start dev server
npm run dev

# 4. Open leaderboard
# Visit http://localhost:5173/leaderboard
# Should show live data from Supabase ✅
```

---

## 🐛 Debugging

```bash
# Check if tables exist and have data
npx tsx scripts/check-tables.ts

# Check in Supabase SQL Editor
SELECT * FROM round1_submissions;
```

Open browser console (F12) for logs:
- ✅ `"✅ Loaded X submissions from round1_submissions"` = Working!
- ❌ `"📌 Using mock submissions"` = Failed, using fallback

---

## 📊 How Data is Organized

```
round1_submissions
├─ submission_id
├─ team_id
├─ submitted_at
└─ score ← TEAM SCORE

    ↓ linked by submission_id

round1_mcq_answers        round1_coding_answers
├─ mcq_id                 ├─ problem_id
├─ selected_option_id     ├─ code
└─ (answer details)       ├─ language
                          ├─ passed_test_cases
                          └─ total_test_cases
```

---

## 💾 Saving Scores

```typescript
// When admin calls:
await calculateRound1Score('team-1');

// It:
// 1. Calculates MCQ + coding + time bonus/penalty
// 2. Updates round1_submissions.score
// 3. Updates local state
// 4. Logs result to console
```

---

## 🔄 Real-time Updates

Listening to changes in:
- ✅ `round1_submissions` → Auto-refresh leaderboard
- ✅ `round1_mcq_answers` → Auto-reload submission
- ✅ `round1_coding_answers` → Auto-reload submission

---

## 📝 Key Changes Made

✅ `contexts/ContestContext.tsx` - Use correct tables  
✅ `scripts/seed.ts` - Populate correct tables  
✅ `scripts/check-tables.ts` - Diagnostic tool  
✅ Documentation files - Schema reference  

---

## ✨ Result

**Before**: Leaderboard showed mock data (hardcoded in mockData.ts)
**Now**: Leaderboard shows **LIVE data from Supabase** with real-time updates! 🎉

---

## 🆘 Still Seeing Mock Data?

1. Check `.env.local` exists with correct credentials
2. Run `npx tsx scripts/check-tables.ts` to verify tables
3. Run `npx tsx scripts/seed.ts` to populate data
4. Restart dev server: `npm run dev`
5. Open browser console to see logs
6. Check Supabase dashboard - do tables have data?
