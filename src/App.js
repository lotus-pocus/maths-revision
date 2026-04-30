import { UserProvider } from "./context/UserContext";
import { ProgressProvider } from "./context/ProgressContext";
import AppShell from "./AppShell";
import "./App.css";

function App() {
  return (
    <UserProvider>
      <ProgressProvider>
        <AppShell />
      </ProgressProvider>
    </UserProvider>
  );
}

export default App;