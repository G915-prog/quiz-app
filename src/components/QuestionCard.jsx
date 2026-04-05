import OptionButton from './OptionButton'

function QuestionCard({ question, selectedAnswer, onAnswer }) {
  const revealed = selectedAnswer !== null

  return (
    <div className="question-card">
      <p className="question-text">{question.text}</p>
      <div className="options-grid">
        {question.options.map((option) => (
          <OptionButton
            key={option.key}
            optionKey={option.key}
            text={option.text}
            selected={option.key === selectedAnswer}
            correct={option.key === question.correctKey}
            revealed={revealed}
            onClick={() => onAnswer(option.key)}
          />
        ))}
      </div>
    </div>
  )
}

export default QuestionCard
