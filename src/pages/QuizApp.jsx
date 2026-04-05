import { useQuiz } from '../hooks/useQuiz'
import CategoryPicker from '../components/CategoryPicker'

function QuizApp() {
  const { startQuiz, phase, questions, score, total } = useQuiz()

  function handleStart(categoryId, difficulty) {
    // TODO: fetch questions from OpenTDB using categoryId + difficulty, then call startQuiz(questionsArray)
    startQuiz([])
  }

  return (
    <main className="quiz-app">
      <h1 className="quiz-title">Quiz App</h1>
      {phase === 'picking' && <CategoryPicker onStart={handleStart} />}
    </main>
  )
}

export default QuizApp
