import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout/Layout";
import LoginForm from "./components/LoginForm";
import EscapeRoom from "./components/EscapeRoom";
import Dashboard from "./components/Dashboard";
import ProfileCard from "./components/ProfileCard";
import Welcome from "./components/Welcome";
import VaultPage from "./components/VaultPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<LoginForm onLoginSuccess={() => {}} />} />

          <Route element={<Layout />}>
            <Route path="/escape-room" element={<EscapeRoom />} />
            <Route path="/dashboard"   element={<Dashboard />} />
            <Route path="/welcome"     element={<Welcome />} />
            <Route path="/profile"     element={<ProfileCard />} />
            <Route path="/vault"       element={<VaultPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;