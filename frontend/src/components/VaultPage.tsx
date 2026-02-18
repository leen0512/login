import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

interface AuthContextType {
  user: { username: string } | null;
  logout: () => void;
}

export default function VaultPage() {
  const { user, logout } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    let t = 0, animId: number;
    const draw = () => {
      t += 0.004;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const sp = 38;
      for (let x = 0; x < canvas.width + sp; x += sp) {
        for (let y = 0; y < canvas.height + sp; y += sp) {
          const d = Math.sqrt((x - canvas.width / 2) ** 2 + (y - canvas.height / 2) ** 2);
          const p = Math.sin(d * 0.018 - t * 1.4) * 0.5 + 0.5;
          const color = user ? `rgba(52,211,153,${0.018 + p * 0.04})` : `rgba(255,100,100,${0.018 + p * 0.035})`;
          ctx.fillStyle = color;
          ctx.beginPath(); ctx.arc(x, y, 1.3, 0, Math.PI * 2); ctx.fill();
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, [user]);

  const handleRefreshTest = () => { window.location.reload(); };
  const handleDone = () => { localStorage.setItem("station2Done", "true"); navigate("/escape-room"); };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", fontFamily: "'JetBrains Mono','Fira Code',monospace", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }

        @keyframes vp-fadeUp    { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes vp-scan      { from { top:-80px; } to { top:calc(100% + 80px); } }
        @keyframes vp-spin      { to { transform:rotate(360deg); } }
        @keyframes vp-pulse     { 0%,100%{ opacity:0.4; transform:scale(1); } 50%{ opacity:1; transform:scale(1.18); } }
        @keyframes vp-blink     { 0%,100%{ opacity:1; } 50%{ opacity:0; } }
        @keyframes vp-shimmer   { 0%{ background-position:200% center; } 100%{ background-position:-200% center; } }
        @keyframes vp-glow-g    { 0%,100%{ box-shadow:0 0 0 0 rgba(52,211,153,0); } 50%{ box-shadow:0 0 24px 4px rgba(52,211,153,0.1); } }
        @keyframes vp-glow-r    { 0%,100%{ box-shadow:0 0 0 0 rgba(255,100,100,0); } 50%{ box-shadow:0 0 24px 4px rgba(255,100,100,0.1); } }
        @keyframes vp-shake     { 0%,100%{ transform:translateX(0); } 20%,60%{ transform:translateX(-4px); } 40%,80%{ transform:translateX(4px); } }

        .vp-nav-btn { transition: all 0.2s ease; }
        .vp-nav-btn:hover { opacity: 0.85; transform: translateY(-1px); }

        .vp-btn { transition: all 0.25s ease; cursor: pointer; }
        .vp-btn:hover { transform: translateY(-2px); filter: brightness(1.15); }
        .vp-btn:active { transform: translateY(0px); }

        .vp-card-locked { animation: vp-fadeUp 0.5s 0.1s ease both, vp-glow-r 4s ease-in-out infinite; }
        .vp-card-open   { animation: vp-fadeUp 0.5s 0.1s ease both, vp-glow-g 4s ease-in-out infinite; }

        .vp-lock-icon {
          display: inline-flex; align-items: center; justify-content: center;
          width: 64px; height: 64px; border-radius: 50%;
          font-size: 28px; margin-bottom: 20px;
          position: relative;
        }
        .vp-lock-ring {
          position: absolute; inset: 0; border-radius: 50%;
          animation: vp-pulse 3s ease-in-out infinite;
        }
      `}</style>

      {/* Dot grid canvas */}
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />

      {/* Scanline */}
      <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, height: "80px", background: "linear-gradient(180deg, transparent, rgba(167,139,250,0.02), transparent)", animation: "vp-scan 8s linear infinite" }} />
      </div>

      {/* Top accent bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "2px", zIndex: 100, background: "linear-gradient(90deg, rgba(97,218,251,0.55), rgba(167,139,250,0.45), rgba(247,223,30,0.4))" }} />

      {/* Nav */}
      <nav style={{ position: "fixed", top: "2px", left: 0, right: 0, zIndex: 90, background: "rgba(10,15,30,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: "8px", padding: "0 24px", height: "52px" }}>
        <span style={{ fontSize: "11px", color: "rgba(97,218,251,0.25)", marginRight: "8px", letterSpacing: "0.1em" }}>// nav</span>
        <NavBtn label="⚛ escape room" color="#61dafb" onClick={() => navigate("/escape-room")} />
        <NavBtn label="🕵️ תחנה 1" color="#61dafb" onClick={() => navigate("/dashboard")} />
        <NavBtn label="🔒 תחנה 2" color="#a78bfa" active onClick={() => navigate("/vault")} />
        {user && (
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", color: "rgba(52,211,153,0.5)", letterSpacing: "0.08em" }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(52,211,153,0.8)", boxShadow: "0 0 6px rgba(52,211,153,0.6)", animation: "vp-blink 2s ease-in-out infinite" }} />
            {user.username}
          </div>
        )}
      </nav>

      {/* Content */}
      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "88px 24px 60px", position: "relative", zIndex: 10, direction: "rtl" }}>

        {/* Header */}
        <div style={{ animation: "vp-fadeUp 0.5s ease both", marginBottom: "28px" }}>
          <p style={{ fontSize: "10px", letterSpacing: "0.18em", color: "rgba(167,139,250,0.3)", marginBottom: "6px", textAlign: "right" }}>// תחנה 2 — localStorage</p>
          <h1 style={{ fontSize: "26px", fontWeight: "700", color: "#e2e8f0", margin: 0, display: "flex", alignItems: "center", gap: "10px", justifyContent: "flex-end" }}>
            הכספת
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: "42px", height: "42px", borderRadius: "10px",
              background: user ? "rgba(52,211,153,0.1)" : "rgba(255,100,100,0.08)",
              border: `1px solid ${user ? "rgba(52,211,153,0.25)" : "rgba(255,100,100,0.2)"}`,
              fontSize: "20px",
              animation: user ? "vp-glow-g 3s ease-in-out infinite" : "vp-shake 0.5s ease 1s both",
            }}>
              {user ? "🔓" : "🔒"}
            </span>
          </h1>
        </div>

        {user ? (
          /* ── LOGGED IN STATE ── */
          <div>
            {/* Status card */}
            <div className="vp-card-open" style={{ padding: "20px 22px", background: "rgba(10,20,14,0.7)", border: "1px solid rgba(52,211,153,0.18)", borderRadius: "14px", marginBottom: "14px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.4), transparent)" }} />
              <p style={{ fontSize: "9px", letterSpacing: "0.14em", color: "rgba(52,211,153,0.3)", marginBottom: "12px" }}>// status</p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "flex-end" }}>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "13px", color: "rgba(148,185,165,0.6)", margin: "0 0 2px 0" }}>מחוברת כ:</p>
                  <p style={{ fontSize: "18px", fontWeight: "700", margin: 0, background: "linear-gradient(90deg, rgba(52,211,153,1), rgba(97,218,251,0.8), rgba(52,211,153,1))", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "vp-shimmer 3s linear infinite" }}>{user.username}</p>
                </div>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0, position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(52,211,153,0.3)", animation: "vp-pulse 2.5s ease-in-out infinite" }} />
                  ✅
                </div>
              </div>
            </div>

            {/* Refresh test button */}
            <button className="vp-btn" onClick={handleRefreshTest} style={{ width: "100%", padding: "14px", background: "rgba(247,183,0,0.06)", border: "1px solid rgba(247,183,0,0.2)", borderRadius: "10px", color: "rgba(247,210,0,0.8)", fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", fontWeight: "600", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", letterSpacing: "0.05em" }}>
              <span style={{ fontSize: "14px" }}>🔄</span>
              רענני את הדף — מה יקרה?
            </button>

            {/* Done button */}
            <button className="vp-btn" onClick={handleDone} style={{ width: "100%", padding: "14px", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.28)", borderRadius: "10px", color: "rgba(52,211,153,0.9)", fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", fontWeight: "600", marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", letterSpacing: "0.05em" }}>
              <span style={{ fontSize: "14px" }}>✅</span>
              תיקנתי את הבאג — לפרס!
            </button>

            {/* Logout */}
            <button className="vp-btn" onClick={logout} style={{ width: "100%", padding: "12px", background: "rgba(255,100,100,0.04)", border: "1px solid rgba(255,100,100,0.12)", borderRadius: "10px", color: "rgba(255,120,120,0.55)", fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", fontWeight: "600", letterSpacing: "0.06em" }}>
              התנתקי
            </button>
          </div>

        ) : (
          /* ── LOGGED OUT STATE ── */
          <div>
            {/* Bug found card */}
            <div className="vp-card-locked" style={{ padding: "22px", background: "rgba(20,8,8,0.75)", border: "1px solid rgba(255,100,100,0.15)", borderRadius: "14px", marginBottom: "14px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,100,100,0.4), transparent)" }} />
              <p style={{ fontSize: "9px", letterSpacing: "0.14em", color: "rgba(255,100,100,0.3)", marginBottom: "12px" }}>// error</p>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", justifyContent: "flex-end" }}>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "15px", fontWeight: "700", color: "#e2e8f0", margin: "0 0 8px 0" }}>🔒 לא מחוברת</p>
                  <p style={{ fontSize: "12px", color: "rgba(148,165,185,0.45)", lineHeight: "1.8", margin: 0 }}>
                    מצאת את הבאג!<br />
                    הטוקן לא נשמר, אז רענון מאפס את המשתמש.
                  </p>
                </div>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255,100,100,0.07)", border: "1px solid rgba(255,100,100,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>🐛</div>
              </div>
            </div>

            {/* Fix hint card */}
            <div style={{ padding: "20px 22px", background: "rgba(14,12,4,0.75)", border: "1px solid rgba(247,223,30,0.12)", borderRadius: "14px", position: "relative", overflow: "hidden", animation: "vp-fadeUp 0.5s 0.2s ease both" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(247,223,30,0.35), transparent)" }} />
              <p style={{ fontSize: "9px", letterSpacing: "0.14em", color: "rgba(247,223,30,0.3)", marginBottom: "12px" }}>// hint</p>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "rgba(247,223,30,0.8)", marginBottom: "12px", textAlign: "right" }}>
                💡 מה לתקן ב-AuthContext.jsx?
              </p>
              <p style={{ fontSize: "12px", color: "rgba(247,223,30,0.5)", lineHeight: "2", margin: 0, textAlign: "right" }}>
                ב-<Code>login</Code> — להסיר את ה-<Code>//</Code> מהשורה:
              </p>
              <div style={{ marginTop: "10px", padding: "10px 14px", background: "rgba(0,0,0,0.25)", border: "1px solid rgba(97,218,251,0.1)", borderRadius: "7px", textAlign: "left", direction: "ltr" }}>
                <code style={{ fontSize: "11px", color: "rgba(97,218,251,0.7)", lineHeight: "1.6" }}>
                  localStorage.setItem(<br />
                  &nbsp;&nbsp;"accessToken",<br />
                  &nbsp;&nbsp;data.access_token<br />
                  )
                </code>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NavBtn({ label, color, active, onClick }: { label: string; color: string; active?: boolean; onClick: () => void }) {
  return (
    <button className="vp-nav-btn" onClick={onClick} style={{ padding: "6px 14px", fontSize: "11px", fontFamily: "'JetBrains Mono',monospace", fontWeight: "600", letterSpacing: "0.06em", color, background: active ? `${color}14` : "transparent", border: `1px solid ${active ? `${color}50` : `${color}18`}`, borderRadius: "6px", cursor: "pointer" }}>
      {label}
    </button>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "4px", padding: "1px 6px", fontSize: "11px", color: "rgba(97,218,251,0.75)", fontFamily: "'JetBrains Mono',monospace" }}>
      {children}
    </code>
  );
}