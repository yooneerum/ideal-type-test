import { useMemo, useReducer } from "react";
import { DOMAINS } from "../data/domains.js";
import { STAGE1_QUESTIONS } from "../data/stage1Questions.js";
import { STAGE2_QUESTIONS } from "../data/stage2Questions.js";

const initialDomainWins = Object.fromEntries(DOMAINS.map((d) => [d.id, 0]));

const initialState = {
  step: "start", // start | stage1 | stage2 | result
  stage1Index: 0,
  stage2Index: 0,
  // 1. 21개 승패 비교 데이터 + 7개 영역 우선순위 집계
  matchupLog: [],
  domainWins: initialDomainWins,
  // 2. 1단계에서 누적된 잠재가치 축 점수
  axisScores: {},
  // 3. 2단계에서 누적된 가치판단 이유 데이터
  stage2Answers: [],
};

function accumulateAxes(axisScores, axes) {
  if (!axes) return axisScores;
  const next = { ...axisScores };
  for (const [axis, weight] of Object.entries(axes)) {
    next[axis] = (next[axis] || 0) + weight;
  }
  return next;
}

function reducer(state, action) {
  switch (action.type) {
    case "START":
      return { ...initialState, step: "stage1" };

    case "ANSWER_STAGE1": {
      const { question, choice } = action; // choice: "A" | "B"
      const chosen = choice === "A" ? question.optionA : question.optionB;
      const other = choice === "A" ? question.optionB : question.optionA;

      const matchupLog = [
        ...state.matchupLog,
        {
          questionId: question.id,
          winner: chosen.domain,
          loser: other.domain,
        },
      ];

      const domainWins = {
        ...state.domainWins,
        [chosen.domain]: (state.domainWins[chosen.domain] || 0) + 1,
      };

      const axisScores = accumulateAxes(state.axisScores, chosen.axes);
      const nextIndex = state.stage1Index + 1;
      const isDone = nextIndex >= STAGE1_QUESTIONS.length;

      return {
        ...state,
        matchupLog,
        domainWins,
        axisScores,
        stage1Index: nextIndex,
        step: isDone ? "stage2" : "stage1",
      };
    }

    case "ANSWER_STAGE2": {
      const { question, choice } = action; // choice: "A" | "B"
      const chosen = choice === "A" ? question.optionA : question.optionB;

      const stage2Answers = [
        ...state.stage2Answers,
        {
          questionId: question.id,
          domain: question.domain,
          choice,
          reasonProfile: chosen.reasonProfile,
        },
      ];

      const nextIndex = state.stage2Index + 1;
      const isDone = nextIndex >= STAGE2_QUESTIONS.length;

      return {
        ...state,
        stage2Answers,
        stage2Index: nextIndex,
        step: isDone ? "result" : "stage2",
      };
    }

    case "RESTART":
      return initialState;

    default:
      return state;
  }
}

export function useQuiz() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const domainRanking = useMemo(() => {
    return [...DOMAINS]
      .map((d) => ({ ...d, wins: state.domainWins[d.id] || 0 }))
      .sort((a, b) => b.wins - a.wins);
  }, [state.domainWins]);

  const currentStage1Question = STAGE1_QUESTIONS[state.stage1Index] ?? null;
  const currentStage2Question = STAGE2_QUESTIONS[state.stage2Index] ?? null;

  return {
    state,
    dispatch,
    domainRanking,
    currentStage1Question,
    currentStage2Question,
    stage1Total: STAGE1_QUESTIONS.length,
    stage2Total: STAGE2_QUESTIONS.length,
  };
}
