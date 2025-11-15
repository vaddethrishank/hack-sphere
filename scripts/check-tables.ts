/**
 * Check if Supabase tables exist and have data
 * Run: npx tsx scripts/check-tables.ts
 */

import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTable(tableName: string) {
  try {
    const { data, error, count } = await supabase.from(tableName).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`❌ ${tableName}: Table does not exist or error accessing it`);
      console.log(`   Error: ${error.message}`);
    } else {
      console.log(`✅ ${tableName}: ${count} rows`);
    }
  } catch (e) {
    console.log(`❌ ${tableName}: Error - ${(e as any).message}`);
  }
}

async function main() {
  console.log('\n📊 Checking Supabase tables...\n');
  
  const tables = [
    'teams',
    'team_members',
    'rounds',
    'mcqs',
    'mcq_options',
    'coding_problems',
    'coding_problem_test_cases',
    'round1_submissions',
    'round1_mcq_answers',
    'round1_coding_answers',
    'round2_problem',
    'certificates',
  ];

  for (const table of tables) {
    await checkTable(table);
  }

  console.log('\n');
}

main();
