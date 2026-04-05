import { useState } from 'react'
import { useCategories } from '../hooks/useCategories'

function CategoryPicker({ onStart }) {
  const { categories, categoryId, setCategoryId, selectedCategoryName, loading, error } = useCategories()
  const [difficulty, setDifficulty] = useState('easy')

  if (loading) return <p className="picker-status">Loading categories…</p>
  if (error)   return <p className="picker-status picker-status--error">Error: {error}</p>

  return (
    <div className="picker">
      <div className="picker-field">
        <label className="picker-label" htmlFor="category">Category</label>
        <select
          id="category"
          className="picker-select"
          value={categoryId ?? ''}
          onChange={(e) => setCategoryId(Number(e.target.value))}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="picker-field">
        <label className="picker-label" htmlFor="difficulty">Difficulty</label>
        <select
          id="difficulty"
          className="picker-select"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <button
        className="picker-btn"
        onClick={() => onStart(categoryId, difficulty, selectedCategoryName)}
      >
        Start Quiz
      </button>
    </div>
  )
}

export default CategoryPicker
