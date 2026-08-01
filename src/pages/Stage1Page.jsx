import "./QuestionCard.css";

export default function Stage1Page({ question, index, total, onAnswer }) {
  if (!question) return null;
  const progress = Math.round((index / total) * 100);

  return (
    <div className="question-page">
      <div className="question-page__inner">

        <h2 className="result-page__title">Step 1</h2>
        <p className="question-page__progress-label">
          {index + 1} / {total} · 나는 어떤 사람에게 끌리는가
        </p>

        <div className="question-page__progress-track">
          <div
            className="question-page__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="question-page__eyebrow">Q{index + 1}</p>
        <h2 className="question-page__title">{question.title}</h2>

        <div className="question-page__options">
          <button
            type="button"
            className="option-card option-card--a"
            onClick={() => onAnswer(question, "A")}
          >
            {question.optionA.text}
          </button>
          <p className="question-page__vs">VS</p>
          <button
            type="button"
            className="option-card option-card--b"
            onClick={() => onAnswer(question, "B")}
          >
            {question.optionB.text}
          </button>
        </div>
      </div>
    </div>
  );
}
