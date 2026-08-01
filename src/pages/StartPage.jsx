import "./StartPage.css";

export default function StartPage({ onStart }) {
  return (
    <div className="start-page">
      <div className="blob blob--mint" aria-hidden="true" />
      <div className="blob blob--peach" aria-hidden="true" />
      <div className="blob blob--lavender" aria-hidden="true" />
      <div className="blob blob--mint-small" aria-hidden="true" />

      <main className="start-card">
        <p className="start-card__eyebrow">나메의 몽글몽글 심리테스트</p>
        <h1 className="start-card__title">
          나의 이상형
          <br />
          찾기
        </h1>
        <p className="start-card__desc">
          몇 가지 질문에 답하면
          <br />
          숨어있던 나의 이상형을 알려줄게요
        </p>
        <button
          type="button"
          className="start-card__cta"
          onClick={onStart}
        >
          시작하기
        </button>
      </main>
    </div>
  );
}
