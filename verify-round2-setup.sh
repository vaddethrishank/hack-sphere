#!/bin/bash
# verify-round2-setup.sh

echo "🔍 Verifying Round 2 Database Setup..."
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "✅ .env.local exists"
else
    echo "❌ .env.local not found - see SUPABASE_SETUP.md"
    exit 1
fi

echo ""
echo "📋 Setup Checklist:"
echo "1. ✅ Code changes deployed (types.ts, ContestContext.tsx, Round2SubmissionPage.tsx)"
echo ""
echo "2. Run this in Supabase SQL Editor:"
echo "   ALTER TABLE round2_problem"
echo "   ADD COLUMN IF NOT EXISTS problem_file_url TEXT;"
echo ""
echo "3. Create table for submissions in Supabase SQL Editor:"
echo "   CREATE TABLE IF NOT EXISTS round2_submissions ("
echo "     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),"
echo "     team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,"
echo "     solution_file_url TEXT NOT NULL,"
echo "     submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,"
echo "     UNIQUE(team_id)"
echo "   );"
echo ""
echo "4. Seed the database:"
echo "   npx tsx scripts/seed.ts"
echo ""
echo "5. Create storage buckets in Supabase:"
echo "   - round2_problems (Public)"
echo "   - round2_solutions (Public)"
echo ""
echo "6. Check console logs in browser dev tools for:"
echo "   ✅ 'Loaded Round 2 problem from Supabase'"
echo "   ✅ 'Loaded X Round 2 submissions from Supabase'"
echo ""
echo "See ROUND2_SETUP.md for detailed instructions"
