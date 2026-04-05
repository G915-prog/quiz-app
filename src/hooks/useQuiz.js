/**
 * useQuiz — manages all quiz game state and logic.
 *
 * Phases:
 *   'picking'  — user is on the CategoryPicker screen
 *   'playing'  — quiz is in progress
 *   'finished' — all questions answered
 *
 * @returns {{
 *   phase: 'picking'|'playing'|'finished',
 *   questions: object[],
 *   currentIndex: number,
 *   score: number,
 *   selectedAnswer: string|null,
 *   timerKey: number,
 *   question: object|null,
 *   total: number,
 *   isCorrect: boolean,
 *   startQuiz: (questionsArray: object[]) => void,
 *   handleAnswer: (key: string) => void,
 *   nextQuestion: () => void,
 *   resetQuiz: () => void,
 * }}
 */

import { useState } from 'react'

const INITIAL_STATE = {
  phase: 'picking',
  questions: [],
  currentIndex: 0,
  score: 0,
  selectedAnswer: null,
  timerKey: 0,
}

export function useQuiz() {
  const [phase, setPhase] = useState(INITIAL_STATE.phase)
  const [questions, setQuestions] = useState(INITIAL_STATE.questions)
  const [currentIndex, setCurrentIndex] = useState(INITIAL_STATE.currentIndex)
  const [score, setScore] = useState(INITIAL_STATE.score)
  const [selectedAnswer, setSelectedAnswer] = useState(INITIAL_STATE.selectedAnswer)
  const [timerKey, setTimerKey] = useState(INITIAL_STATE.timerKey)

  const question = questions[currentIndex] ?? null
  const total = questions.length
  const isCorrect = selectedAnswer !== null && selectedAnswer === question?.correctKey

  function startQuiz(questionsArray) {
    setQuestions(questionsArray)
    setCurrentIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setTimerKey(0)
    setPhase('playing')
  }

  function handleAnswer(key) {
    if (selectedAnswer !== null) return
    setSelectedAnswer(key)
    if (key === question?.correctKey) {
      setScore((s) => s + 1)
    }
  }

  function nextQuestion() {
    if (currentIndex + 1 >= total) {
      setPhase('finished')
    } else {
      setCurrentIndex((i) => i + 1)
      setSelectedAnswer(null)
      setTimerKey((k) => k + 1)
    }
  }

  function resetQuiz() {
    setPhase(INITIAL_STATE.phase)
    setQuestions(INITIAL_STATE.questions)
    setCurrentIndex(INITIAL_STATE.currentIndex)
    setScore(INITIAL_STATE.score)
    setSelectedAnswer(INITIAL_STATE.selectedAnswer)
    setTimerKey(INITIAL_STATE.timerKey)
  }

  return {
    phase,
    questions,
    currentIndex,
    score,
    selectedAnswer,
    timerKey,
    question,
    total,
    isCorrect,
    startQuiz,
    handleAnswer,
    nextQuestion,
    resetQuiz,
  }
}
