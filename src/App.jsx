import StartPage from "./pages/StartPage.jsx";
import Stage1Page from "./pages/Stage1Page.jsx";
import Stage2Page from "./pages/Stage2Page.jsx";
import ResultPage from "./pages/ResultPage.jsx";
import { useQuiz } from "./state/useQuiz.js";

function App() {
  const {
    state,
    dispatch,
    currentStage1Question,
    currentStage2Question,
    stage1Total,
    stage2Total,
  } = useQuiz();

  if (state.step === "start") {
    return <StartPage onStart={() => dispatch({ type: "START" })} />;
  }

  if (state.step === "stage1") {
    return (
      <Stage1Page
        question={currentStage1Question}
        index={state.stage1Index}
        total={stage1Total}
        onAnswer={(question, choice) =>
          dispatch({ type: "ANSWER_STAGE1", question, choice })
        }
      />
    );
  }

  if (state.step === "stage2") {
    return (
      <Stage2Page
        question={currentStage2Question}
        index={state.stage2Index}
        total={stage2Total}
        onAnswer={(question, choice) =>
          dispatch({ type: "ANSWER_STAGE2", question, choice })
        }
      />
    );
  }

  return (
    <ResultPage
      matchupLog={state.matchupLog}
      axisScores={state.axisScores}
      stage2Answers={state.stage2Answers}
      onRestart={() => dispatch({ type: "RESTART" })}
    />
  );
}

export default App;
