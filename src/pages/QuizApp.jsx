import CategoryPicker from '../components/CategoryPicker'

function QuizApp() {
  function handleStart(categoryId, difficulty) {
    console.log('Start quiz:', categoryId, difficulty)
  }

  return (
    <main className="quiz-app">
      <h1 className="quiz-title">Quiz App</h1>
      <CategoryPicker onStart={handleStart} />
    </main>
  )
}

export default QuizApp
