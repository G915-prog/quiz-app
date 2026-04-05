import { useState, useEffect, useRef } from 'react'

const CIRCUMFERENCE = 125.66

function Timer({ duration = 30, onExpire, timerKey, paused = false }) {
  const [secondsLeft, setSecondsLeft] = useState(duration)
  const pausedRef = useRef(paused)
  const onExpireRef = useRef(onExpire)

  useEffect(() => { pausedRef.current = paused }, [paused])
  useEffect(() => { onExpireRef.current = onExpire }, [onExpire])

  useEffect(() => {
    setSecondsLeft(duration)

    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (pausedRef.current) return s
        if (s <= 1) {
          clearInterval(interval)
          onExpireRef.current()
          return 0
        }
        return s - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timerKey]) // eslint-disable-line react-hooks/exhaustive-deps

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
