import "./QuestionCard.css";
import { DOMAIN_MAP } from "../data/domains.js";

export default function Stage2Page({ question, index, total, onAnswer }) {
  if (!question) return null;
  const progress = Math.round((index / total) * 100);
  const domain = DOMAIN_MAP[question.domain];

  return (
    <div className="question-page">
      <div className="question-page__inner">
        <div className="question-page__progress-track">
          <div
            className="question-page__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="question-page__progress-label">
          {index + 1} / {total} · 왜 그런 사람에게 끌리는가
        </p>

        <p className="question-page__eyebrow">
          {domain.emoji} {domain.name}
        </p>
        <h2 className="question-page__title">{question.question}</h2>

        <div className="question-page__options">
          <button
            type="button"
            className="option-card option-card--a"
            onClick={() => onAnswer(question, "A")}
          >
            {question.optionA.text}
          </button>
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
