import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout/Layout";
import LoginForm from "./components/LoginForm";
import EscapeRoom from "./components/EscapeRoom";

function App() {
  return (
    // 1️⃣  AuthProvider wraps everything — makes user/login/logout available everywhere
    <AuthProvider>

      {/* 2️⃣  BrowserRouter enables URL-based navigation */}
      <BrowserRouter>
        <Routes>

          {/* / → redirect straight to /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Full-page login (no navbar/layout) */}
          <Route path="/login" element={<LoginForm onLoginSuccess={() => {}} />} />

          {/* Pages that share the Layout (navbar etc.) */}
          <Route element={<Layout />}>
            <Route path="/escape-room" element={<EscapeRoom />} />
          </Route>

          {/* Any unknown URL → back to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </BrowserRouter>

    </AuthProvider>
  );
}

export default App;