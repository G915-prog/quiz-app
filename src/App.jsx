import { Routes, Route } from 'react-router-dom'
import QuizApp from './pages/QuizApp'

function App() {
  return (
    <Routes>
      <Route path="/" element={<QuizApp />} />
    </Routes>
  )
}

export default App
