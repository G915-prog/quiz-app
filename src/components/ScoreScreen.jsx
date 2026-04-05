import { useState } from 'react'

const ANIMALS = [
  'Brave Badger', 'Clever Crow', 'Dizzy Dolphin', 'Eager Eagle',
  'Fuzzy Ferret', 'Grumpy Gecko', 'Happy Hedgehog', 'Jolly Jaguar',
  'Lazy Lemur', 'Mighty Mongoose', 'Nimble Newt', 'Odd Otter',
  'Peppy Penguin', 'Quick Quokka', 'Rowdy Raccoon', 'Sneaky Squirrel',
  'Tiny Tapir', 'Uppity Uakari', 'Vivid Vole', 'Wacky Wombat',
]

function randomAnimal() {
  return ANIMALS[Math.floor(Math.random() * ANIMALS.length)]
}

function getGrade(pct) {
  if (pct >= 90) return 'A'
  if (pct >= 75) return 'B'
  if (pct >= 60) return 'C'
  if (pct >= 45) return 'D'
  return 'F'
}

function ScoreScreen({ score, total, category, difficulty, timeTaken, onSave, onRestart }) {
  const pct = Math.round((score / total) * 100)
  const grade = getGrade(pct)
  const minutes = Math.floor(timeTaken / 60)
  const seconds = timeTaken % 60

  const [username, setUsername] = useState('')
  const [saveState, setSaveState] = useState('idle') // 'idle' | 'saving' | 'saved' | 'error'
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSave() {
    const name = username.trim() || randomAnimal()
    setSaveState('saving')
    try {
      await onSave({ username: name, score, total, category, difficulty, timeTaken })
      setSaveState('saved')
    } catch (err) {
      setErrorMsg(err.message ?? 'Failed to save score.')
      setSaveState('error')
    }
  }

  return (
    <div className="score-screen">
      <div className="score-result">
        <span className="score-grade" data-grade={grade}>{grade}</span>
        <p className="score-fraction">{score} / {total}</p>
        <p className="score-pct">{pct}%</p>
      </div>

      <ul className="score-meta">
        <li><span className="score-meta__label">Category</span><span className="score-meta__value">{category}</span></li>
        <li><span className="score-meta__label">Difficulty</span><span className="score-meta__value">{difficulty}</span></li>
        <li><span className="score-meta__label">Time</span><span className="score-meta__value">{minutes}m {seconds}s</span></li>
      </ul>

      <div className="score-actions">
        <div className="score-save">
          <input
            className="score-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name (or get a random one)"
            disabled={saveState === 'saving' || saveState === 'saved'}
          />
          <button
            className="score-btn score-btn--primary"
            onClick={handleSave}
            disabled={saveState === 'saving' || saveState === 'saved'}
          >
            {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved!' : 'Save to leaderboard'}
          </button>
          {saveState === 'error' && <p className="score-error">{errorMsg}</p>}
        </div>

        <button className="score-btn score-btn--ghost" onClick={onRestart}>
          Play again
        </button>
      </div>
    </div>
  )
}

export default ScoreScreen
