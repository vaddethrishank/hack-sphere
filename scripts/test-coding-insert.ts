/**
 * Test what columns actually exist in round1_coding_answers
 * Run: npx tsx scripts/test-coding-insert.ts
 */

import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  console.log('\n🧪 Testing coding answers insert...\n');

  // First, get a submission ID
  const { data: submissions } = await supabase
    .from('round1_submissions')
    .select('id')
    .limit(1);

  if (!submissions || submissions.length === 0) {
    console.log('❌ No submissions found');
    return;
  }

  const submissionId = submissions[0].id;
  console.log(`📌 Using submission ID: ${submissionId}`);

  // Try different column combinations
  const attempts = [
    { columns: { submission_id: submissionId, problem_id: 'cp-1', code: 'console.log()', language: 'js', passed: 1, total: 3 }, name: 'passed/total' },
    { columns: { submission_id: submissionId, problem_id: 'cp-1', code: 'console.log()', language: 'js', passed_tests: 1, total_tests: 3 }, name: 'passed_tests/total_tests' },
    { columns: { submission_id: submissionId, problem_id: 'cp-1', code_submission: 'console.log()', language: 'js', tests_passed: 1, tests_total: 3 }, name: 'tests_passed/tests_total' },
  ];

  for (const attempt of attempts) {
    console.log(`\n  Testing: ${attempt.name}`);
    console.log(`  Columns: ${Object.keys(attempt.columns).join(', ')}`);
    
    const { error } = await supabase
      .from('round1_coding_answers')
      .insert(attempt.columns);

    if (!error) {
      console.log(`  ✅ SUCCESS! Use these columns: ${Object.keys(attempt.columns).join(', ')}`);
      return;
    } else {
      console.log(`  ❌ Failed: ${error.message.substring(0, 80)}...`);
    }
  }

  console.log('\n❌ All attempts failed. Run this query in Supabase SQL Editor:');
  console.log(`   SELECT * FROM round1_coding_answers LIMIT 0;`);
  console.log('   (This shows table structure)\n');
}

testInsert();
