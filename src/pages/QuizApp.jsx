import { useQuiz } from '../hooks/useQuiz'
import CategoryPicker from '../components/CategoryPicker'
import QuestionCard from '../components/QuestionCard'
import Timer from '../components/Timer'

const TEST_QUESTIONS = [
  {
    text: 'Which planet is known as the Red Planet?',
    correctKey: 'B',
    options: [
      { key: 'A', text: 'Venus' },
      { key: 'B', text: 'Mars' },
      { key: 'C', text: 'Jupiter' },
      { key: 'D', text: 'Saturn' },
    ],
  },
]

function QuizApp() {
  const { startQuiz, phase, question, selectedAnswer, handleAnswer, nextQuestion, timerKey } = useQuiz()

  function handleStart(categoryId, difficulty) {
    startQuiz(TEST_QUESTIONS)
  }

  return (
    <main className="quiz-app">
      <h1 className="quiz-title">Quiz App</h1>
      {phase === 'picking' && <CategoryPicker onStart={handleStart} />}
      {phase === 'playing' && question && (
        <>
          <Timer duration={30} onExpire={nextQuestion} timerKey={timerKey} />
          <QuestionCard question={question} selectedAnswer={selectedAnswer} onAnswer={handleAnswer} />
        </>
      )}
    </main>
  )
}

export default QuizApp
