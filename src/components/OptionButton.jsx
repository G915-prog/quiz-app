function OptionButton({ optionKey, text, selected, correct, revealed, onClick }) {
  let className = 'option-btn'
  if (revealed) {
    if (correct) className += ' option-btn--correct'
    else if (selected) className += ' option-btn--wrong'
    else className += ' option-btn--neutral'
  }

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={revealed}
    >
      <span className="option-btn__key">{optionKey}</span>
      <span className="option-btn__text">{text}</span>
    </button>
  )
}

export default OptionButton
