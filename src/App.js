import statistics from "./data/statistics";
import MathsTopicsView from "./components/MathsTopicsView";
import BoxPlotVisualiser from "./components/maths/statistics/boxplots";
import "./App.css";

function App() {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "20px 16px" }}>
      <BoxPlotVisualiser />
    </div>
  );
}

export default App;