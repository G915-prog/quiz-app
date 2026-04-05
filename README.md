# Quiz App

A React + Vite quiz application using the [Open Trivia DB](https://opentdb.com/) API and Supabase.

## Changelog

### 0.7.0 — 2026-04-05
- Created `src/components/ScoreScreen.jsx` — grade, score, meta, save to leaderboard (auth-aware), play again
- Updated `QuizApp.jsx` — tracks user via `supabase.auth`, category name, difficulty, timeTaken; renders ScoreScreen on finish
- Updated `CategoryPicker.jsx` — passes category name as 3rd arg to `onStart`
- Added `.score-screen`, `.score-result`, `.score-grade`, `.score-meta`, `.score-actions` and related classes to `index.css`

### 0.6.0 — 2026-04-05
- Created `src/components/ProgressBar.jsx` — "Question X of Y" label + animated fill bar
- Rewrote `src/pages/QuizApp.jsx` — full game flow: fetch + decode + shuffle from OpenTDB, phase-based rendering, 1200ms auto-advance after answer, finished screen
- Added `.progress-wrap`, `.progress-track`, `.progress-fill`, `.progress-label`, `.game-over` to `index.css`
- Removed `.next-btn` (replaced by auto-advance)

### 0.5.2 — 2026-04-05
- Timer now pauses when an answer is selected (`paused` prop + ref pattern)
- Added `handleExpire` to `useQuiz` — reveals correct answer on timeout without awarding points
- Added "Next Question" button in `QuizApp` that appears after reveal (answer clicked or timer expired)
- Added `.next-btn` styles to `index.css`

### 0.5.1 — 2026-04-05
- Wired `Timer` into `QuizApp.jsx` — renders above `QuestionCard` during `'playing'` phase, calls `nextQuestion` on expire

### 0.5.0 — 2026-04-05
- Created `src/components/Timer.jsx` — SVG ring countdown, resets on `timerKey` change, calls `onExpire` at zero
- Added `.timer-wrap`, `.timer-svg`, `.timer-ring-bg`, `.timer-ring`, `.timer-text` to `index.css`

### 0.4.1 — 2026-04-05
- Wired `QuestionCard` into `QuizApp.jsx` with a hardcoded test question — renders when phase is `'playing'`

### 0.4.0 — 2026-04-05
- Created `src/components/OptionButton.jsx` — renders an answer option with correct/wrong/neutral reveal states
- Created `src/components/QuestionCard.jsx` — renders question text and 4 OptionButtons, handles reveal logic
- Added `.question-card`, `.question-text`, `.options-grid`, `.option-btn`, `.option-btn--correct`, `.option-btn--wrong`, `.option-btn--neutral` to `index.css`

### 0.3.1 — 2026-04-05
- Wired `useQuiz` into `QuizApp.jsx` — Start Quiz button now calls `startQuiz`, picker only shown in `'picking'` phase

### 0.3.0 — 2026-04-05
- Created `src/hooks/useQuiz.js` — manages all quiz game logic (phase, questions, score, answer selection, timer reset, derived values)

### 0.2.1 — 2026-04-05
- Wired `CategoryPicker` into `QuizApp.jsx` so the picker and Start Quiz button are actually rendered
- Added `.quiz-app` and `.quiz-title` layout classes to `index.css`

### 0.2.0 — 2026-04-05
- Added `src/components/CategoryPicker.jsx` — fetches categories from OpenTDB, renders category/difficulty selects and a Start Quiz button
- Added base styles to `src/index.css` — dark theme, DM Serif Display + DM Mono fonts, picker component classes

### 0.1.0 — 2026-04-05
- Scaffolded project with Vite + React
- Installed `react-router-dom` and `@supabase/supabase-js`
- Set up `BrowserRouter` in `src/main.jsx`
- Added router shell in `src/App.jsx` with `/` route
- Created `src/pages/QuizApp.jsx` placeholder
- Created `src/lib/supabase.js` — Supabase client initialised from `import.meta.env`
- Added `.env.local` with placeholder Supabase vars
