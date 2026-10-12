import { useRef, useState } from 'react'

export const PASS_MARK = 3

export default function Quiz({ questions, ui, onPass, children }) {
  const blank = () => questions.map(() => null)
  const [picks, setPicks] = useState(blank)
  const titleRef = useRef(null)

  const score = picks.filter((pick, i) => pick === questions[i].answer).length
  const finished = picks.every((pick) => pick !== null)

  function choose(qIndex, option) {
    if (picks[qIndex] !== null) return
    const next = picks.map((pick, i) => (i === qIndex ? option : pick))
    setPicks(next)
    const nextScore = next.filter((pick, i) => pick === questions[i].answer).length
    if (next.every((pick) => pick !== null) && nextScore >= PASS_MARK) onPass()
  }

  function retry() {
    setPicks(blank())
    titleRef.current.focus()
  }

  return (
    <section className="quiz" aria-labelledby="quiz-title">
      <h2 id="quiz-title" ref={titleRef} tabIndex={-1}>
        {ui.quizTitle}
      </h2>
      <ol className="questions">
        {questions.map((q, qIndex) => {
          const pick = picks[qIndex]
          const answered = pick !== null
          return (
            <li key={qIndex} className="question">
              <p className="question-count">{ui.question(qIndex + 1, questions.length)}</p>
              <p className="question-text" id={`q${qIndex}`}>
                {q.question}
              </p>
              <div className="options" role="group" aria-labelledby={`q${qIndex}`}>
                {q.options.map((option, oIndex) => {
                  const isAnswer = answered && oIndex === q.answer
                  const isWrongPick = answered && oIndex === pick && oIndex !== q.answer
                  return (
                    // aria-disabled, not disabled, so keyboard focus stays put after answering
                    <button
                      key={oIndex}
                      type="button"
                      className={`option${isAnswer ? ' is-correct' : ''}${isWrongPick ? ' is-wrong' : ''}`}
                      aria-disabled={answered}
                      aria-pressed={oIndex === pick}
                      onClick={() => choose(qIndex, oIndex)}
                    >
                      <span>{option}</span>
                      {isAnswer && <strong className="mark">✓ {ui.correct}</strong>}
                      {isWrongPick && <strong className="mark">✗ {ui.incorrect}</strong>}
                    </button>
                  )
                })}
              </div>
              <p className="explanation" aria-live="polite">
                {answered && q.explanation}
              </p>
            </li>
          )
        })}
      </ol>
      <div aria-live="polite">
        {finished && (
          <div className="result">
            <p className="score">{ui.score(score, questions.length)}</p>
            <p>{score >= PASS_MARK ? ui.passed : ui.failed}</p>
            {score < PASS_MARK && (
              <button type="button" className="button" onClick={retry}>
                {ui.retry}
              </button>
            )}
          </div>
        )}
      </div>
      {finished && children}
    </section>
  )
}
