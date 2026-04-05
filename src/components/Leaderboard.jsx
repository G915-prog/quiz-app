import { useLeaderboard } from '../hooks/useLeaderboard'

function formatTime(seconds) {
  if (seconds == null) return '—'
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
}

function Leaderboard() {
  const { rows, loading, error } = useLeaderboard()

  return (
    <div className="leaderboard">
      <h2 className="leaderboard-title">Top 10</h2>

      {loading && <p className="leaderboard-status">Loading…</p>}
      {error && <p className="leaderboard-status leaderboard-status--error">{error}</p>}

      {!loading && !error && rows.length === 0 && (
        <p className="leaderboard-status">No scores yet. Be the first!</p>
      )}

      {!loading && !error && rows.length > 0 && (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>Score</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id} className="leaderboard-row">
                <td className="leaderboard-rank">{i + 1}</td>
                <td>{row.username}</td>
                <td>{row.score} / {row.total_questions}</td>
                <td>{row.category}</td>
                <td className="leaderboard-difficulty">{row.difficulty}</td>
                <td>{formatTime(row.time_taken_seconds)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Leaderboard
