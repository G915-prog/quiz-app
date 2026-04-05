import { useRef, useEffect, useState } from 'react'
import { useQuiz } from '../hooks/useQuiz'
import { processQuestion } from '../lib/questions'
import { insertScore } from '../lib/scores'
import CategoryPicker from '../components/CategoryPicker'
import QuestionCard from '../components/QuestionCard'
import Timer from '../components/Timer'
import ProgressBar from '../components/ProgressBar'
import ScoreScreen from '../components/ScoreScreen'
import Leaderboard from '../components/Leaderboard'

function QuizApp() {
  const {
    startQuiz, resetQuiz, phase,
    question, currentIndex, total,
    selectedAnswer, handleAnswer, handleExpire,
    nextQuestion, timerKey,
    score,
  } = useQuiz()

  const advanceTimer = useRef(null)
  const startTimeRef = useRef(null)

  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [timeTaken, setTimeTaken] = useState(0)
  const [fetchError, setFetchError] = useState(null)

  // Track time from when playing starts to when the quiz finishes
  useEffect(() => {
    if (phase === 'playing') {
      startTimeRef.current = Date.now()
    }
    if (phase === 'finished' && startTimeRef.current) {
      setTimeTaken(Math.round((Date.now() - startTimeRef.current) / 1000))
      startTimeRef.current = null
    }
  }, [phase])

  function handleStart(categoryId, diff, categoryName) {
    setFetchError(null)
    fetch(
      `https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=${diff}&type=multiple`
    )
      .then((res) => {
        if (!res.ok) throw new Error(`API error ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (!data.results?.length) throw new Error('No questions returned. Try a different category.')
        setCategory(categoryName)
        setDifficulty(diff)
        startQuiz(data.results.map(processQuestion))
      })
      .catch((err) => setFetchError(err.message))
  }

  function handleAnswerAndAdvance(key) {
    handleAnswer(key)
    advanceTimer.current = setTimeout(nextQuestion, 1200)
  }

  function handleExpireAndAdvance() {
    handleExpire()
    advanceTimer.current = setTimeout(nextQuestion, 1200)
  }

  async function handleSave(entry) {
    await insertScore(entry) // throws on error; ScoreScreen catches and displays it
  }

  function handleRestart() {
    clearTimeout(advanceTimer.current)
    startTimeRef.current = null
    resetQuiz()
  }

  return (
    <main className="quiz-app">
      <h1 className="quiz-title">Quiz App</h1>

      {phase === 'picking' && (
        <>
          <CategoryPicker onStart={handleStart} />
          {fetchError && <p className="picker-status picker-status--error">{fetchError}</p>}
          <Leaderboard />
        </>
      )}

      {phase === 'playing' && question && (
        <>
          <ProgressBar current={currentIndex + 1} total={total} />
          <Timer
            duration={30}
            onExpire={handleExpireAndAdvance}
            timerKey={timerKey}
            paused={selectedAnswer !== null}
          />
          <QuestionCard
            question={question}
            selectedAnswer={selectedAnswer}
            onAnswer={handleAnswerAndAdvance}
          />
        </>
      )}

      {phase === 'finished' && (
        <>
          <ScoreScreen
            score={score}
            total={total}
            category={category}
            difficulty={difficulty}
            timeTaken={timeTaken}
            onSave={handleSave}
            onRestart={handleRestart}
          />
          <Leaderboard />
        </>
      )}
    </main>
  )
}

export default QuizApp
