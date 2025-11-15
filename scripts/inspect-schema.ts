/**
 * Inspect actual Supabase table structures
 * Run: npx tsx scripts/inspect-schema.ts
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

async function inspectTable(tableName: string) {
  try {
    console.log(`\n📋 Table: ${tableName}`);
    const { data, error } = await supabase.from(tableName).select('*').limit(1);
    
    if (error) {
      console.log(`  ❌ Error: ${error.message}`);
      return;
    }

    if (!data || data.length === 0) {
      console.log(`  ⚠️  Table is empty, cannot inspect columns`);
      return;
    }

    const columns = Object.keys(data[0]);
    console.log(`  Columns: ${columns.join(', ')}`);
    console.log(`  Sample row:`, JSON.stringify(data[0], null, 2));
  } catch (e) {
    console.log(`  ❌ Exception: ${(e as any).message}`);
  }
}

async function main() {
  console.log('\n🔍 Inspecting Supabase Table Schemas...\n');
  
  const tables = [
    'round1_submissions',
    'round1_mcq_answers',
    'round1_coding_answers',
  ];

  for (const table of tables) {
    await inspectTable(table);
  }

  console.log('\n');
}

main();
