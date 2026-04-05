import { useRef } from 'react'
import { useQuiz } from '../hooks/useQuiz'
import CategoryPicker from '../components/CategoryPicker'
import QuestionCard from '../components/QuestionCard'
import Timer from '../components/Timer'
import ProgressBar from '../components/ProgressBar'

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
    startQuiz, phase,
    question, currentIndex, total,
    selectedAnswer, handleAnswer,
    nextQuestion, timerKey,
    score,
  } = useQuiz()

  const advanceTimer = useRef(null)

  function handleStart(categoryId, difficulty) {
    fetch(
      `https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=${difficulty}&type=multiple`
    )
      .then((res) => res.json())
      .then((data) => startQuiz(data.results.map(processQuestion)))
  }

  function handleAnswerAndAdvance(key) {
    handleAnswer(key)
    advanceTimer.current = setTimeout(nextQuestion, 1200)
  }

  return (
    <main className="quiz-app">
      <h1 className="quiz-title">Quiz App</h1>

      {phase === 'picking' && (
        <CategoryPicker onStart={handleStart} />
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
        <p className="game-over">Game over — score: {score}/{total}</p>
      )}
    </main>
  )
}

export default QuizApp
