// 7개 가치영역 (1단계 밸런스 게임에서 우선순위를 겨루는 대상)
export const DOMAINS = [
  { id: "appearance", name: "외모", emoji: "👀" },
  { id: "personality", name: "성격·기질", emoji: "🌿" },
  { id: "competence", name: "능력·자기관리", emoji: "🚀" },
  { id: "values", name: "가치관", emoji: "🌎" },
  { id: "loveStyle", name: "연애관", emoji: "💕" },
  { id: "relationships", name: "인간관계", emoji: "🤝" },
  { id: "chemistry", name: "케미", emoji: "⚡" },
];

export const DOMAIN_MAP = Object.fromEntries(DOMAINS.map((d) => [d.id, d]));
