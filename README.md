# Quiz App

A React + Vite quiz application using the [Open Trivia DB](https://opentdb.com/) API and Supabase.

## Changelog

### 1.0.0 — 2026-04-05
- Created `src/hooks/useLeaderboard.js` — fetches top 10 scores on mount, exposes `saveScore(entry)`, subscribes to real-time INSERT events (re-sorts + trims to 10 on each new row), unsubscribes on unmount

### 0.9.0 — 2026-04-05
- Removed all auth — no sign in, no Supabase auth, no user_id sent on save
- Deleted `AuthModal.jsx`
- Simplified `ScoreScreen.jsx` — always shows name input + Save button, no user prop
- Simplified `QuizApp.jsx` — removed auth state, auth bar, AuthModal; handleSave sends guest row only
- Removed all auth CSS from `index.css`
- Updated `supabase/schema.sql` to reflect nullable user_id, no foreign key, public insert policy

### 0.8.3 — 2026-04-05
- Fixed Supabase env var names to match Vercel: `VITE_PUBLIC_SUPABASE_URL` and `VITE_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- Updated `.env.local` to match

### 0.8.2 — 2026-04-05
- Fixed `time_taken` → `time_taken_seconds` to match actual Supabase column name

### 0.8.1 — 2026-04-05
- Fixed `handleSave` — table name corrected to `quiz_scores`, `total` → `total_questions` to match actual schema
- Updated `supabase/schema.sql` to reflect real table structure and RLS policies

### 0.8.0 — 2026-04-05
- Created `src/components/AuthModal.jsx` — email/password sign in + sign up, closes on success
- Updated `QuizApp.jsx` — auth bar on picking screen, real Supabase leaderboard insert in `handleSave`, `AuthModal` rendered on `showAuth`
- Updated `ScoreScreen.jsx` — guest "Sign in" is now a clickable button via `onSignIn` prop
- Created `supabase/schema.sql` — leaderboard table + RLS policies reference
- Added `.auth-bar`, `.auth-modal`, `.auth-overlay`, `.auth-tabs`, `.auth-form` CSS to `index.css`

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
