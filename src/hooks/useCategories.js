/**
 * useCategories
 *
 * Fetches the OpenTDB category list on mount and manages the selected category.
 *
 * Returns:
 *   categories           — full list of { id, name } objects
 *   categoryId           — currently selected category id
 *   setCategoryId        — setter for categoryId
 *   selectedCategoryName — name of the currently selected category
 *   loading              — true while fetch is in flight
 *   error                — error message string, or null
 */

import { useState, useEffect } from 'react'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState(null)
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
        setCategoryId(data.trivia_categories[0]?.id ?? null)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err.message)
        setLoading(false)
      })

    return () => controller.abort()
  }, [])

  const selectedCategoryName = categories.find((c) => c.id === categoryId)?.name ?? ''

  return { categories, categoryId, setCategoryId, selectedCategoryName, loading, error }
}
