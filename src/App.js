import statistics from "./data/statistics";
import MathsTopicsView from "./components/MathsTopicsView";
import BoxPlotVisualiser from "./components/maths/statistics/boxplots";
import "./App.css";

function App() {
  return (
    <div className="app">
      <div className="main-content">
        <BoxPlotVisualiser />
      </div>
    </div>
  );
}

export default App;