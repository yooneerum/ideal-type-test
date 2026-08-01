import { DOMAIN_MAP, DOMAINS } from "../data/domains.js";
import { ANALYSIS_PROMPT } from "../data/analysisPrompt.js";

// "무엇을 선택했는가"가 아니라 "그 선택들이 어떤 관계 구조를 가지는가"를
// 보여주기 위해, 각 영역이 누구를 이기고 누구에게 졌는지를 전부 풀어서 기록한다.
export function buildDomainMeta(matchupLog) {
  const meta = Object.fromEntries(
    DOMAINS.map((d) => [d.id, { beat: [], lostTo: [] }])
  );

  for (const { winner, loser } of matchupLog) {
    meta[winner].beat.push(loser);
    meta[loser].lostTo.push(winner);
  }

  return DOMAINS.map((d) => ({
    id: d.id,
    name: d.name,
    emoji: d.emoji,
    wins: meta[d.id].beat.length,
    losses: meta[d.id].lostTo.length,
    beat: meta[d.id].beat.map((id) => DOMAIN_MAP[id].name),
    lostTo: meta[d.id].lostTo.map((id) => DOMAIN_MAP[id].name),
  })).sort((a, b) => b.wins - a.wins);
}

function rankWithTies(domainMeta) {
  return domainMeta.map((d, i) => {
    const rank = 1 + domainMeta.filter((other) => other.wins > d.wins).length;
    return { ...d, rank };
  });
}

export function formatMetaDataText(matchupLog) {
  const ranked = rankWithTies(buildDomainMeta(matchupLog));

  const rankingLine = ranked
    .map((d) => `${d.rank}위 ${d.emoji} ${d.name} (${d.wins}승 ${d.losses}패)`)
    .join(" > ");

  const detailLines = ranked
    .map((d) => {
      const beatText =
        d.beat.length > 0 ? d.beat.join(", ") + "에게 승리" : "승리한 영역 없음";
      const lostText =
        d.lostTo.length > 0 ? d.lostTo.join(", ") + "에게 양보" : "양보한 영역 없음";
      return `- ${d.emoji} ${d.name}: ${beatText} / ${lostText}`;
    })
    .join("\n");

  return `최종 순위: ${rankingLine}\n\n[영역별 상대 전적 — 어떤 영역을 이기고 어떤 영역에 양보했는지]\n${detailLines}`;
}

export function formatAxisScoresText(axisScores) {
  const sorted = Object.entries(axisScores).sort(
    (a, b) => Math.abs(b[1]) - Math.abs(a[1])
  );
  return sorted
    .map(([axis, score]) => `- ${axis}: ${score > 0 ? "+" : ""}${score}`)
    .join("\n");
}

export function formatReasonProfilesText(stage2Answers) {
  return stage2Answers
    .map((a) => {
      const domain = DOMAIN_MAP[a.domain];
      const profileLines = Object.entries(a.reasonProfile)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
      return `- ${domain.emoji} ${domain.name} → ${profileLines}`;
    })
    .join("\n");
}

export function buildFullResultText({ matchupLog, axisScores, stage2Answers }) {
  return `${ANALYSIS_PROMPT}

━━━━━━━━━━━━━━━━━━

# 사용자 테스트 결과 데이터

## 2. 7가지 가치 비교 선택 원자료

${formatMetaDataText(matchupLog)}

## 3. 응답 기반 16가지 잠재 가치 질문 응답 원자료

${formatAxisScoresText(axisScores)}

## 4. 7가지 가치 판단 질문 응답 원자료

${formatReasonProfilesText(stage2Answers)}
`;
}
