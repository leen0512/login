import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import LoginForm from "./components/LoginForm";
import EscapeRoom from "./components/EscapeRoom";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Login — no layout wrapper (full-page) */}
          <Route
            path="/login"
            element={<LoginForm onLoginSuccess={() => {}} />}
          />
          {/* Routes wrapped in shared Layout */}
          <Route element={<Layout />}>
            <Route path="/escape-room" element={<EscapeRoom />} />
          </Route>

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
