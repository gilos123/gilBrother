// AFTER
import { supabase } from '@/lib/supabaseClient'; // Make sure the path is correct

async function getUserProgress(userId) {
  const { data: progress, error } = await supabase
    .from('UserProgress') // The name of your table in Supabase
    .select('*')
    .eq('user_id', userId); // '.eq' means 'equals'

  if (error) console.error('Error fetching user progress:', error);
  return progress;
}