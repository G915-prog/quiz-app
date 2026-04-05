import { supabase } from './supabase'

/**
 * Inserts a completed quiz result into quiz_scores.
 * Throws if Supabase returns an error so the caller can handle display.
 */
export async function insertScore(entry) {
  const { error } = await supabase.from('quiz_scores').insert({
    username:           entry.username,
    score:              entry.score,
    total_questions:    entry.total,
    category:           entry.category,
    difficulty:         entry.difficulty,
    time_taken_seconds: entry.timeTaken,
  })
  if (error) throw new Error(error.message)
}
