const KEYS = ['A', 'B', 'C', 'D']

function decodeHTML(str) {
  const doc = new DOMParser().parseFromString(str, 'text/html')
  return doc.body.textContent ?? str
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Transforms a raw OpenTDB question into the shape the app uses:
 * { text, correctKey, options: [{ key, text }] }
 */
export function processQuestion(q) {
  const answers = shuffle([q.correct_answer, ...q.incorrect_answers])
  const correctIndex = answers.indexOf(q.correct_answer)
  return {
    text: decodeHTML(q.question),
    correctKey: KEYS[correctIndex],
    options: answers.map((text, i) => ({ key: KEYS[i], text: decodeHTML(text) })),
  }
}
