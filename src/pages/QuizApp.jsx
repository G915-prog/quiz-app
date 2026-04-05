import { useRef, useEffect, useState } from 'react'
import { useQuiz } from '../hooks/useQuiz'
import { supabase } from '../lib/supabase'
import CategoryPicker from '../components/CategoryPicker'
import QuestionCard from '../components/QuestionCard'
import Timer from '../components/Timer'
import ProgressBar from '../components/ProgressBar'
import ScoreScreen from '../components/ScoreScreen'
import AuthModal from '../components/AuthModal'

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

  const advanceTimer = useRef(null)
  const startTimeRef = useRef(null)

  const [user, setUser] = useState(null)
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [timeTaken, setTimeTaken] = useState(0)
  const [showAuth, setShowAuth] = useState(false)

  // Resolve Supabase auth on mount, keep in sync
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) setShowAuth(false) // close modal on successful sign-in
    })
    return () => subscription.unsubscribe()
  }, [])

  // Debug logging
  useEffect(() => {
    console.group(`[useQuiz] phase: ${phase}`)
    console.log('currentIndex :', currentIndex)
    console.log('total        :', total)
    console.log('score        :', score)
    console.log('timerKey     :', timerKey)
    console.log('selectedAnswer:', selectedAnswer)
    console.log('question     :', question)
    console.groupEnd()
  }, [phase, currentIndex, selectedAnswer, score, timerKey])

  // Record time when quiz finishes
  useEffect(() => {
    if (phase === 'finished' && startTimeRef.current) {
      setTimeTaken(Math.round((Date.now() - startTimeRef.current) / 1000))
    }
  }, [phase])

  function handleStart(categoryId, diff, categoryName) {
    fetch(
      `https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=${diff}&type=multiple`
    )
      .then((res) => res.json())
      .then((data) => {
        const processed = data.results.map(processQuestion)
        console.log('[fetch] questions loaded:', processed)
        setCategory(categoryName)
        setDifficulty(diff)
        startTimeRef.current = Date.now()
        startQuiz(processed)
      })
  }

  function handleAnswerAndAdvance(key) {
    console.log(`[answer] selected: ${key} | correct: ${question?.correctKey} | ${key === question?.correctKey ? '✓ correct' : '✗ wrong'}`)
    handleAnswer(key)
    advanceTimer.current = setTimeout(nextQuestion, 1200)
  }

  async function handleSave(entry) {
    const { error } = await supabase.from('quiz_scores').insert({
      user_id:         user.id,
      username:        entry.username,
      score:           entry.score,
      total_questions: entry.total,
      category:        entry.category,
      difficulty:      entry.difficulty,
      time_taken_seconds: entry.timeTaken,
    })
    if (error) throw new Error(error.message)
  }

  function handleRestart() {
    clearTimeout(advanceTimer.current)
    resetQuiz()
  }

  return (
    <main className="quiz-app">
      <h1 className="quiz-title">Quiz App</h1>

      {phase === 'picking' && (
        <>
          <div className="auth-bar">
            {user ? (
              <>
                <span className="auth-bar__email">{user.email}</span>
                <button className="auth-bar__btn" onClick={() => supabase.auth.signOut()}>
                  Sign out
                </button>
              </>
            ) : (
              <button className="auth-bar__btn" onClick={() => setShowAuth(true)}>
                Sign in
              </button>
            )}
          </div>
          <CategoryPicker onStart={handleStart} />
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
        <ScoreScreen
          score={score}
          total={total}
          category={category}
          difficulty={difficulty}
          timeTaken={timeTaken}
          onSave={handleSave}
          onRestart={handleRestart}
          onSignIn={() => setShowAuth(true)}
          user={user}
        />
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </main>
  )
}

export default QuizApp
