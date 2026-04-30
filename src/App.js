import BoxPlotVisualiser from "./components/maths/statistics/boxplots";
import { UserProvider } from "./context/UserContext";
import { ProgressProvider } from "./context/ProgressContext";
import "./App.css";

function App() {
  return (
    <UserProvider>
      <ProgressProvider>
        <div className="app">
          <div className="main-content">
            <BoxPlotVisualiser />
          </div>
        </div>
      </ProgressProvider>
    </UserProvider>
  );
}

export default App;