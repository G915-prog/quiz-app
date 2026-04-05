import { useState, useEffect } from 'react'

const CIRCUMFERENCE = 125.66

function Timer({ duration = 30, onExpire, timerKey }) {
  const [secondsLeft, setSecondsLeft] = useState(duration)

  useEffect(() => {
    setSecondsLeft(duration)

    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval)
          onExpire()
          return 0
        }
        return s - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timerKey])

  const dashOffset = CIRCUMFERENCE * (1 - secondsLeft / duration)

  return (
    <div className="timer-wrap">
      <svg className="timer-svg" viewBox="0 0 48 48">
        <circle
          className="timer-ring-bg"
          cx="24" cy="24" r="20"
          strokeWidth="4"
          fill="none"
        />
        <circle
          className="timer-ring"
          cx="24" cy="24" r="20"
          strokeWidth="4"
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
        />
      </svg>
      <span className="timer-text">{secondsLeft}</span>
    </div>
  )
}

export default Timer
