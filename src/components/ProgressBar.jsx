function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100)

  return (
    <div className="progress-wrap">
      <span className="progress-label">Question {current} of {total}</span>
      <div className="progress-track">
        <div className="progress-fill" style={{ '--fill': `${pct}%` }} />
      </div>
    </div>
  )
}

export default ProgressBar
