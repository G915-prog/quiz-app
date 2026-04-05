import { useRef, useEffect, useState } from 'react'
import { useQuiz } from '../hooks/useQuiz'
import { useLeaderboard } from '../hooks/useLeaderboard'
import CategoryPicker from '../components/CategoryPicker'
import QuestionCard from '../components/QuestionCard'
import Timer from '../components/Timer'
import ProgressBar from '../components/ProgressBar'
import ScoreScreen from '../components/ScoreScreen'
import Leaderboard from '../components/Leaderboard'

const KEYS = ['A', 'B', 'C', 'D']

function decodeHTML(str) {
  const doc = new DOMParser().parseFromString(str, 'text/html')
  return doc.body.textContent ?? str
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function processQuestion(q) {
  const answers = shuffle([q.correct_answer, ...q.incorrect_answers])
  const correctIndex = answers.indexOf(q.correct_answer)
  return {
    text: decodeHTML(q.question),
    correctKey: KEYS[correctIndex],
    options: answers.map((text, i) => ({ key: KEYS[i], text: decodeHTML(text) })),
  }
}

function QuizApp() {
  const {
    startQuiz, resetQuiz, phase,
    question, currentIndex, total,
    selectedAnswer, handleAnswer,
    nextQuestion, timerKey,
    score,
  } = useQuiz()

  const { saveScore } = useLeaderboard()

  const advanceTimer = useRef(null)
  const startTimeRef = useRef(null)

  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [timeTaken, setTimeTaken] = useState(0)

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
    fetch(
      `https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=${diff}&type=multiple`
    )
      .then((res) => res.json())
      .then((data) => {
        const processed = data.results.map(processQuestion)
        setCategory(categoryName)
        setDifficulty(diff)
        startQuiz(processed)
      })
  }

  function handleAnswerAndAdvance(key) {
    handleAnswer(key)
    advanceTimer.current = setTimeout(nextQuestion, 1200)
  }

  async function handleSave(entry) {
    const { error } = await saveScore({
      userId:           null,
      username:         entry.username,
      score:            entry.score,
      totalQuestions:   entry.total,
      category:         entry.category,
      difficulty:       entry.difficulty,
      timeTakenSeconds: entry.timeTaken,
    })
    if (error) throw new Error(error)
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
          <Leaderboard />
        </>
      )}

      {phase === 'playing' && question && (
        <>
          <ProgressBar current={currentIndex + 1} total={total} />
          <Timer
            duration={30}
            onExpire={nextQuestion}
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
