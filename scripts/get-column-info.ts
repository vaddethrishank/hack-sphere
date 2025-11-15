/**
 * Query Supabase information schema to get column details
 * Run: npx tsx scripts/get-column-info.ts
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

async function getTableColumns(tableName: string) {
  try {
    console.log(`\n📋 Columns in ${tableName}:`);
    
    // Use Supabase RPC or raw query
    const { data, error } = await supabase.rpc('get_table_columns', { table_name: tableName }).single();
    
    if (!error && data) {
      console.log(data);
      return;
    }
    
    // Fallback: Try information_schema query directly
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_schema', 'public')
      .eq('table_name', tableName);
    
    if (columnsError) {
      console.log(`  ❌ Error: ${columnsError.message}`);
      return;
    }

    if (columns && columns.length > 0) {
      columns.forEach((col: any) => {
        console.log(`  - ${col.column_name}: ${col.data_type}`);
      });
    } else {
      console.log(`  ⚠️  Could not retrieve columns (no public access to information_schema)`);
    }
  } catch (e) {
    console.log(`  ❌ Exception: ${(e as any).message}`);
  }
}

async function main() {
  console.log('\n🔍 Getting Column Information...\n');
  
  const tables = [
    'round1_submissions',
    'round1_mcq_answers',
    'round1_coding_answers',
  ];

  for (const table of tables) {
    await getTableColumns(table);
  }

  console.log('\n');
}

main();
