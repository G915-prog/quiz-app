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
 *   currentIndex: number,
 *   score: number,
 *   selectedAnswer: string|null,
 *   timerKey: number,
 *   question: object|null,
 *   total: number,
 *   startQuiz: (questionsArray: object[]) => void,
 *   handleAnswer: (key: string) => void,
 *   handleExpire: () => void,
 *   nextQuestion: () => void,
 *   resetQuiz: () => void,
 * }}
 */

import { useReducer } from 'react'

const INITIAL_STATE = {
  phase: 'picking',
  questions: [],
  currentIndex: 0,
  score: 0,
  selectedAnswer: null,
  timerKey: 0,
}

function reducer(state, action) {
  switch (action.type) {
    case 'START': {
      return {
        ...INITIAL_STATE,
        phase: 'playing',
        questions: action.questions,
      }
    }
    case 'ANSWER': {
      if (state.selectedAnswer !== null) return state
      const correct = action.key === state.questions[state.currentIndex]?.correctKey
      return {
        ...state,
        selectedAnswer: action.key,
        score: correct ? state.score + 1 : state.score,
      }
    }
    case 'EXPIRE': {
      if (state.selectedAnswer !== null) return state
      return { ...state, selectedAnswer: '' } // '' triggers reveal, no points
    }
    case 'NEXT': {
      const isLast = state.currentIndex + 1 >= state.questions.length
      if (isLast) {
        return { ...state, phase: 'finished' }
      }
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        selectedAnswer: null,
        timerKey: state.timerKey + 1,
      }
    }
    case 'RESET':
      return INITIAL_STATE
    default:
      return state
  }
}

export function useQuiz() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  const question = state.questions[state.currentIndex] ?? null
  const total = state.questions.length

  return {
    phase:          state.phase,
    currentIndex:   state.currentIndex,
    score:          state.score,
    selectedAnswer: state.selectedAnswer,
    timerKey:       state.timerKey,
    question,
    total,
    startQuiz:    (questions) => dispatch({ type: 'START', questions }),
    handleAnswer: (key)       => dispatch({ type: 'ANSWER', key }),
    handleExpire: ()          => dispatch({ type: 'EXPIRE' }),
    nextQuestion: ()          => dispatch({ type: 'NEXT' }),
    resetQuiz:    ()          => dispatch({ type: 'RESET' }),
  }
}
