import { supabase } from '../lib/supabaseClient';

async function addProblemFileUrlColumn() {
    console.log('🔧 Checking if problem_file_url column exists in round2_problem table...');
    
    try {
        // Try to fetch with the column to see if it exists
        const { data, error } = await supabase
            .from('round2_problem')
            .select('problem_file_url')
            .limit(1);

        if (error && error.code === 'PGRST116') {
            // Column doesn't exist, need to add it
            console.log('➕ Column not found, adding problem_file_url column...');
            
            // Note: Direct SQL ALTER TABLE is not available via PostgREST
            // This needs to be done through Supabase dashboard or SQL editor
            console.log('⚠️  To add the column, run this SQL in Supabase SQL Editor:');
            console.log(`
ALTER TABLE round2_problem
ADD COLUMN IF NOT EXISTS problem_file_url TEXT;
            `);
            return;
        }

        if (!error) {
            console.log('✅ Column already exists');
            return;
        }

        throw error;
    } catch (e) {
        console.error('❌ Error checking column:', e);
    }
}

addProblemFileUrlColumn();
