import { useState, useEffect } from 'react'

function CategoryPicker({ onStart }) {
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [difficulty, setDifficulty] = useState('easy')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch('https://opentdb.com/api_category.php', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch categories')
        return res.json()
      })
      .then((data) => {
        setCategories(data.trivia_categories)
        setCategoryId(data.trivia_categories[0]?.id ?? '')
        setLoading(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err.message)
        setLoading(false)
      })

    return () => controller.abort()
  }, [])

  if (loading) return <p className="picker-status">Loading categories…</p>
  if (error) return <p className="picker-status picker-status--error">Error: {error}</p>

  return (
    <div className="picker">
      <div className="picker-field">
        <label className="picker-label" htmlFor="category">Category</label>
        <select
          id="category"
          className="picker-select"
          value={categoryId}
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
        onClick={() => {
          const name = categories.find((c) => c.id === categoryId)?.name ?? ''
          onStart(categoryId, difficulty, name)
        }}
      >
        Start Quiz
      </button>
    </div>
  )
}

export default CategoryPicker
