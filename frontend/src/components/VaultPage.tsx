import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

interface AuthContextType {
  user: { username: string } | null;
  logout: () => void;
}

export default function VaultPage() {
  const { user, logout } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();

  const handleRefreshTest = () => {
    navigate("/");
    window.location.reload();
  };
  const handleDone = () => {
    localStorage.setItem("station2Done", "true");
    navigate("/escape-room");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0c1120", fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>

      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "2px", zIndex: 100, background: "linear-gradient(90deg, rgba(97,218,251,0.55), rgba(167,139,250,0.45), rgba(247,223,30,0.4))" }} />

      <nav style={{ position: "fixed", top: "2px", left: 0, right: 0, zIndex: 90, background: "rgba(12,17,32,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "8px", padding: "0 24px", height: "52px" }}>
        <span style={{ fontSize: "11px", color: "rgba(97,218,251,0.3)", marginRight: "8px", letterSpacing: "0.1em" }}>// nav</span>
        <NavBtn label="⚛ escape room" color="#61dafb" onClick={() => navigate("/escape-room")} />
        <NavBtn label="🕵️ תחנה 1" color="#61dafb" onClick={() => navigate("/dashboard")} />
        <NavBtn label="🔒 תחנה 2" color="#a78bfa" active onClick={() => navigate("/vault")} />
      </nav>

      <div style={{ maxWidth: "500px", margin: "0 auto", padding: "88px 24px 48px" }}>

        <p style={{ fontSize: "10px", letterSpacing: "0.18em", color: "rgba(167,139,250,0.3)", marginBottom: "8px" }}>// תחנה 2 — localStorage</p>
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#e2e8f0", marginBottom: "20px" }}>🔒 הכספת</h1>

        {user ? (
          <div>
            <div style={{ padding: "20px", background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.18)", borderRadius: "12px", marginBottom: "16px" }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.14em", color: "rgba(52,211,153,0.35)", marginBottom: "10px" }}>// status</p>
              <p style={{ fontSize: "14px", color: "#e2e8f0", margin: 0 }}>
                ✅ מחוברת כ: <span style={{ fontWeight: "700", color: "rgba(52,211,153,0.9)" }}>{user.username}</span>
              </p>
            </div>

            <button onClick={handleRefreshTest} style={{ width: "100%", padding: "13px", background: "rgba(255,190,0,0.07)", border: "1px solid rgba(255,190,0,0.25)", borderRadius: "10px", color: "rgba(255,210,0,0.85)", fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", fontWeight: "600", cursor: "pointer", marginBottom: "10px" }}>
              🔄 רעני את הדף — מה יקרה?
            </button>

            <button onClick={handleDone} style={{ width: "100%", padding: "13px", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "10px", color: "rgba(52,211,153,0.9)", fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", fontWeight: "600", cursor: "pointer", marginBottom: "10px" }}>
              ✅ תיקנתי את הבאג — לפרס!
            </button>
            <button onClick={logout} style={{ width: "100%", padding: "12px", background: "rgba(255,100,100,0.06)", border: "1px solid rgba(255,100,100,0.15)", borderRadius: "10px", color: "rgba(255,120,120,0.7)", fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
              התנתקי
            </button>
          </div>
        ) : (
          <div>
            <div style={{ padding: "20px", background: "rgba(255,100,100,0.05)", border: "1px solid rgba(255,100,100,0.15)", borderRadius: "12px", marginBottom: "16px" }}>
              <p style={{ fontSize: "9px", letterSpacing: "0.14em", color: "rgba(255,100,100,0.35)", marginBottom: "10px" }}>// error</p>
              <p style={{ fontSize: "14px", color: "#e2e8f0", marginBottom: "8px" }}>🔒 לא מחוברת</p>
              <p style={{ fontSize: "12px", color: "rgba(148,165,185,0.45)", lineHeight: "1.7", margin: 0 }}>
                מצאת את הבאג! הטוקן לא נשמר,<br />
                אז רענון מאפס את המשתמש.
              </p>
            </div>

            <div style={{ padding: "18px 20px", background: "rgba(247,223,30,0.04)", border: "1px solid rgba(247,223,30,0.12)", borderRadius: "12px" }}>
              <p style={{ fontSize: "12px", fontWeight: "700", color: "rgba(247,223,30,0.8)", marginBottom: "12px" }}>💡 מה לתקן ב-AuthContext.jsx?</p>
              <p style={{ fontSize: "12px", color: "rgba(247,223,30,0.55)", lineHeight: "1.7", margin: 0 }}>
                ב-<Code>login</Code> — להסיר את ה-<Code>//</Code> מהשורה:<br />
                <Code>localStorage.setItem("accessToken", data.access_token)</Code>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NavBtn({ label, color, active, onClick }: { label: string; color: string; active?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ padding: "6px 14px", fontSize: "11px", fontFamily: "'JetBrains Mono',monospace", fontWeight: "600", letterSpacing: "0.06em", color, background: active ? `${color}14` : "transparent", border: `1px solid ${active ? `${color}50` : `${color}20`}`, borderRadius: "6px", cursor: "pointer" }}>
      {label}
    </button>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", padding: "1px 6px", fontSize: "11px", color: "rgba(97,218,251,0.8)" }}>
      {children}
    </code>
  );
}