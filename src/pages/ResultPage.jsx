import { useState } from "react";
import "./ResultPage.css";
import { DOMAIN_MAP } from "../data/domains.js";
import {
  buildDomainMeta,
  buildFullResultText,
} from "../utils/formatResultText.js";

export default function ResultPage({
  matchupLog,
  axisScores,
  stage2Answers,
  onRestart,
}) {
  const [copied, setCopied] = useState(false);
  const ranked = buildDomainMeta(matchupLog);
  const sortedAxes = Object.entries(axisScores).sort(
    (a, b) => Math.abs(b[1]) - Math.abs(a[1])
  );

  async function handleCopy() {
    const text = buildFullResultText({ matchupLog, axisScores, stage2Answers });
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="result-page">
      <div className="result-page__inner">
        <p className="result-page__eyebrow">테스트 완료</p>
        <h2 className="result-page__title">나의 끌림 데이터가 모였어요</h2>
        <p className="result-page__desc">
          아래 결과를 AI에게 붙여넣으면
          <br />내 진짜 이상형을 깊게 분석해줘요
        </p>

        <button type="button" className="result-page__copy" onClick={handleCopy}>
          {copied ? "복사됐어요! 📋" : "결과 복사해서 분석받기"}
        </button>

        <section className="result-block">
          <h3>1. 가치영역 우선순위 메타데이터</h3>
          <p className="result-block__hint">
            무엇을 골랐는지보다, 무엇을 이기고 무엇에 양보했는지가 중요해요.
          </p>
          <ol className="domain-meta-list">
            {ranked.map((d, i) => (
              <li key={d.id}>
                <span className="domain-meta-list__rank">{i + 1}위</span>{" "}
                {d.emoji} {d.name}
                <span className="domain-meta-list__score">
                  {d.wins}승 {d.losses}패
                </span>
                {d.beat.length > 0 && (
                  <p className="domain-meta-list__detail">
                    ↳ {d.beat.join(", ")}에게 승리
                  </p>
                )}
                {d.lostTo.length > 0 && (
                  <p className="domain-meta-list__detail">
                    ↳ {d.lostTo.join(", ")}에게 양보
                  </p>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section className="result-block">
          <h3>2. 잠재가치 축 점수</h3>
          <ul className="axis-list">
            {sortedAxes.map(([axis, score]) => (
              <li key={axis}>
                <span>{axis}</span>
                <span className={score >= 0 ? "axis-list__pos" : "axis-list__neg"}>
                  {score > 0 ? "+" : ""}
                  {score}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="result-block">
          <h3>3. 가치판단 이유</h3>
          <ul className="reason-list">
            {stage2Answers.map((a) => {
              const domain = DOMAIN_MAP[a.domain];
              return (
                <li key={a.questionId}>
                  <p className="reason-list__domain">
                    {domain.emoji} {domain.name}
                  </p>
                  <p className="reason-list__values">
                    {Object.values(a.reasonProfile).join(" · ")}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        <button type="button" className="result-page__restart" onClick={onRestart}>
          처음부터 다시하기
        </button>
      </div>
    </div>
  );
}
