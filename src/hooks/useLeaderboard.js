/**
 * useLeaderboard
 *
 * Fetches the top 10 quiz scores from Supabase and subscribes to real-time
 * INSERT events so the list stays live without a manual refresh.
 *
 * Returns:
 *   rows       — array of quiz_scores rows, sorted score DESC / time ASC, max 10
 *   loading    — true while the initial fetch is in flight
 *   error      — error message string, or null
 *   saveScore  — async fn(entry) → { error }; inserts a row into quiz_scores
 */

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function sortAndTrim(arr) {
  return [...arr]
    .sort((a, b) => b.score - a.score || a.time_taken_seconds - b.time_taken_seconds)
    .slice(0, 10)
}

export function useLeaderboard() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Initial fetch
    supabase
      .from('quiz_scores')
      .select('*')
      .order('score', { ascending: false })
      .order('time_taken_seconds', { ascending: true })
      .limit(10)
      .then(({ data, error: fetchError }) => {
        if (fetchError) {
          setError(fetchError.message)
        } else {
          setRows(data ?? [])
        }
        setLoading(false)
      })

    // Real-time subscription
    const channel = supabase
      .channel('quiz_scores_inserts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'quiz_scores' },
        (payload) => {
          setRows((prev) => sortAndTrim([...prev, payload.new]))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function saveScore(entry) {
    const { error: insertError } = await supabase.from('quiz_scores').insert({
      user_id:            entry.userId ?? null,
      username:           entry.username,
      score:              entry.score,
      total_questions:    entry.totalQuestions,
      category:           entry.category,
      difficulty:         entry.difficulty,
      time_taken_seconds: entry.timeTakenSeconds,
    })
    return { error: insertError ? insertError.message : null }
  }

  return { rows, loading, error, saveScore }
}
