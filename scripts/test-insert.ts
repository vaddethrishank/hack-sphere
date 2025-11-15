/**
 * Test what columns actually exist in round1_mcq_answers
 * Run: npx tsx scripts/test-insert.ts
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
  console.log('\n🧪 Testing MCQ answers insert...\n');

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
    { columns: { submission_id: submissionId, mcq_id: 'mcq-1', answer_id: 'a' }, name: 'answer_id' },
    { columns: { submission_id: submissionId, mcq_id: 'mcq-1', answered_id: 'a' }, name: 'answered_id' },
    { columns: { submission_id: submissionId, question_id: 'mcq-1', answer: 'a' }, name: 'question_id + answer' },
    { columns: { submission_id: submissionId, mcq_id: 'mcq-1', response: 'a' }, name: 'response' },
  ];

  for (const attempt of attempts) {
    console.log(`\n  Testing: ${attempt.name}`);
    console.log(`  Data: ${JSON.stringify(attempt.columns)}`);
    
    const { error } = await supabase
      .from('round1_mcq_answers')
      .insert(attempt.columns);

    if (!error) {
      console.log(`  ✅ SUCCESS! Use these columns: ${Object.keys(attempt.columns).join(', ')}`);
      return;
    } else {
      console.log(`  ❌ Failed: ${error.message.substring(0, 80)}...`);
    }
  }

  console.log('\n❌ All attempts failed. Run this query in Supabase SQL Editor:');
  console.log(`   SELECT * FROM round1_mcq_answers LIMIT 0;`);
  console.log('   (This shows table structure)\n');
}

testInsert();
