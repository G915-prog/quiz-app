import { useQuiz } from '../hooks/useQuiz'
import CategoryPicker from '../components/CategoryPicker'
import QuestionCard from '../components/QuestionCard'

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
  const { startQuiz, phase, question, selectedAnswer, handleAnswer } = useQuiz()

  console.log('render — phase:', phase, '| question:', question)

  function handleStart(categoryId, difficulty) {
    startQuiz(TEST_QUESTIONS)
  }

  return (
    <main className="quiz-app">
      <h1 className="quiz-title">Quiz App</h1>
      {phase === 'picking' && <CategoryPicker onStart={handleStart} />}
      {phase === 'playing' && (
        question
          ? <QuestionCard question={question} selectedAnswer={selectedAnswer} onAnswer={handleAnswer} />
          : <p style={{color:'red'}}>question is null — questions array is empty</p>
      )}
    </main>
  )
}

export default QuizApp
