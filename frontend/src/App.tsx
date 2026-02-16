import { AuthProvider } from "./contexts/AuthContext";
import EscapeRoom from "./components/EscapeRoom";

function App() {
  return (
    <AuthProvider>
      <EscapeRoom />
    </AuthProvider>
  );
}

export default App;
