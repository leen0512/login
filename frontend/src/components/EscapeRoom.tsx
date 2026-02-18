/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../contexts/AuthContext";
import LoginForm from "./LoginForm";
import { useNavigate } from "react-router-dom";

const QUEEN_JWT_HEADER = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

const EscapeRoom = () => {
  const { user } = useContext(AuthContext) as any;
  const navigate = useNavigate();

  const [phase, setPhase] = useState<"hidden" | "sliding" | "shown">("hidden");
  const [headerCopied, setHeaderCopied] = useState(false);
  const [headerRevealed, setHeaderRevealed] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<{ id: number; x: number; color: string; delay: number; duration: number; size: number }[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const username = (user as any)?.username ?? "";
  const isQueen = username === "asyncAwaitQueen" || username === "debugDiva";

  useEffect(() => {
    if (user) {
      setTimeout(() => setPhase("sliding"), 100);
      setTimeout(() => setPhase("shown"), 1800);
    }
  }, [user]);

  // Confetti burst for the queen
  useEffect(() => {
    if (phase === "shown" && isQueen) {
      const COLORS = ["#61dafb", "#a78bfa", "#f7df1e", "#34d399", "#ff6b9d", "#ffa94d"];
      const pieces = Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 1.5,
        duration: 2 + Math.random() * 2,
        size: 4 + Math.random() * 6,
      }));
      setConfettiPieces(pieces);
      setTimeout(() => setHeaderRevealed(true), 2000);
    }
  }, [phase, isQueen]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    type Particle = { x: number; y: number; vx: number; vy: number; alpha: number; size: number; color: string };
    const COLORS = ["#61dafb", "#a78bfa", "#f7df1e", "#34d399"];
    const particles: Particle[] = Array.from({ length: 30 }, () => ({
      x: Math.random(), y: Math.random() + 0.2,
      vx: (Math.random() - 0.5) * 0.0004,
      vy: -(0.0002 + Math.random() * 0.0003),
      alpha: 0.2 + Math.random() * 0.4,
      size: 1 + Math.random() * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    let t = 0, animId: number;
    const draw = () => {
      t += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const sp = 36;
      for (let x = 0; x < canvas.width + sp; x += sp) {
        for (let y = 0; y < canvas.height + sp; y += sp) {
          const d = Math.sqrt((x - canvas.width / 2) ** 2 + (y - canvas.height / 2) ** 2);
          const p = Math.sin(d * 0.02 - t * 1.5) * 0.5 + 0.5;
          const dotColor = isQueen ? `rgba(167,139,250,${0.025 + p * 0.055})` : `rgba(97,218,251,${0.025 + p * 0.055})`;
          ctx.fillStyle = dotColor;
          ctx.beginPath(); ctx.arc(x, y, 1.4, 0, Math.PI * 2); ctx.fill();
        }
      }
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -0.05) { p.y = 1.1; p.x = Math.random(); }
        const px = p.x * canvas.width, py = p.y * canvas.height;
        const g = ctx.createRadialGradient(px, py, 0, px, py, p.size * 4);
        g.addColorStop(0, p.color.replace(")", `,${p.alpha})`).replace("rgb", "rgba"));
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(px, py, p.size * 4, 0, Math.PI * 2); ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, [isQueen]);

  const handleCopyHeader = () => {
    navigator.clipboard.writeText(QUEEN_JWT_HEADER).then(() => {
      setHeaderCopied(true);
      setTimeout(() => setHeaderCopied(false), 2500);
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: isQueen ? "#0d0a1a" : "#0c1120", position: "relative", overflow: "hidden", fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }

        @keyframes fadeUp     { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin       { to { transform:rotate(360deg); } }
        @keyframes glow       { 0%,100%{ box-shadow:0 0 0 0 rgba(97,218,251,0); } 50%{ box-shadow:0 0 20px 4px rgba(97,218,251,0.15); } }
        @keyframes queenGlow  { 0%,100%{ box-shadow:0 0 0 0 rgba(167,139,250,0); } 50%{ box-shadow:0 0 30px 8px rgba(167,139,250,0.25); } }
        @keyframes orbit      { from{ transform:rotate(0deg) translateX(44px) rotate(0deg); } to{ transform:rotate(360deg) translateX(44px) rotate(-360deg); } }
        @keyframes scanline   { from { top:-80px; } to { top:calc(100% + 80px); } }
        @keyframes confettiFall { 0% { transform: translateY(-20px) rotate(0deg); opacity:1; } 100% { transform: translateY(100vh) rotate(720deg); opacity:0; } }
        @keyframes crownFloat { 0%,100%{ transform:translateY(0) rotate(-3deg); } 50%{ transform:translateY(-8px) rotate(3deg); } }
        @keyframes shimmer    { 0%{ background-position:200% center; } 100%{ background-position:-200% center; } }
        @keyframes pulseRing  { 0%{ transform:scale(1); opacity:0.6; } 100%{ transform:scale(1.6); opacity:0; } }
        @keyframes slideReveal{ from{ opacity:0; transform:translateY(20px) scale(0.96); } to{ opacity:1; transform:translateY(0) scale(1); } }
        @keyframes typeIn     { from{ width:0; } to{ width:100%; } }
        @keyframes borderDance{ 0%,100%{ border-color:rgba(167,139,250,0.4); box-shadow:0 0 20px rgba(167,139,250,0.1); } 50%{ border-color:rgba(247,223,30,0.5); box-shadow:0 0 30px rgba(247,223,30,0.15); } }

        .badge-btn { transition:all 0.3s ease; }
        .badge-btn:hover { background:rgba(97,218,251,0.12) !important; border-color:rgba(97,218,251,0.4) !important; transform:translateY(-1px); }
        .copy-btn { transition:all 0.2s ease; cursor:pointer; }
        .copy-btn:hover { transform:translateY(-1px); filter:brightness(1.2); }
        .queen-header-token { 
          background: linear-gradient(90deg, rgba(167,139,250,0.15), rgba(247,223,30,0.08), rgba(97,218,251,0.15));
          background-size: 200% auto;
          animation: shimmer 3s linear infinite, borderDance 2s ease-in-out infinite;
        }
      `}</style>

      {/* Confetti for the queen! */}
      {isQueen && confettiPieces.map(piece => (
        <div key={piece.id} style={{
          position: "fixed",
          top: "-20px",
          left: `${piece.x}%`,
          width: `${piece.size}px`,
          height: `${piece.size * 0.6}px`,
          background: piece.color,
          borderRadius: "1px",
          zIndex: 200,
          pointerEvents: "none",
          animation: `confettiFall ${piece.duration}s ease-in ${piece.delay}s forwards`,
          opacity: 0,
        }} />
      ))}

      {/* Background canvas */}
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} />

      {/* Scanline overlay */}
      <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, height: "80px", background: `linear-gradient(180deg, transparent, ${isQueen ? "rgba(167,139,250,0.025)" : "rgba(97,218,251,0.02)"}, transparent)`, animation: "scanline 7s linear infinite" }} />
      </div>

      {/* Top accent bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "2px", zIndex: 100, background: isQueen ? "linear-gradient(90deg, rgba(167,139,250,0.8), rgba(247,223,30,0.6), rgba(97,218,251,0.6), rgba(167,139,250,0.8))" : "linear-gradient(90deg, rgba(97,218,251,0.55), rgba(167,139,250,0.45), rgba(247,223,30,0.4), rgba(255,107,107,0.45))" }} />

      {!user && <LoginForm onLoginSuccess={() => {}} />}

      {user && phase !== "hidden" && (
        <>
          <div style={{ position: "fixed", top: 0, left: 0, width: "50%", height: "100%", background: isQueen ? "linear-gradient(90deg, #0d0a1a 0%, #130f24 100%)" : "linear-gradient(90deg, #0c1120 0%, #111827 100%)", zIndex: 50, transform: phase !== "hidden" ? "translateX(-100%)" : "translateX(0)", transition: "transform 1.4s cubic-bezier(0.77, 0, 0.18, 1) 0.1s", borderRight: `1px solid ${isQueen ? "rgba(167,139,250,0.2)" : "rgba(97,218,251,0.15)"}` }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(180deg, transparent 0px, ${isQueen ? "rgba(167,139,250,0.02)" : "rgba(97,218,251,0.015)"} 1px, transparent 2px)` }} />
          </div>
          <div style={{ position: "fixed", top: 0, right: 0, width: "50%", height: "100%", background: isQueen ? "linear-gradient(270deg, #0d0a1a 0%, #130f24 100%)" : "linear-gradient(270deg, #0c1120 0%, #111827 100%)", zIndex: 50, transform: phase !== "hidden" ? "translateX(100%)" : "translateX(0)", transition: "transform 1.4s cubic-bezier(0.77, 0, 0.18, 1) 0.1s", borderLeft: `1px solid ${isQueen ? "rgba(167,139,250,0.2)" : "rgba(97,218,251,0.15)"}` }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(180deg, transparent 0px, ${isQueen ? "rgba(167,139,250,0.02)" : "rgba(97,218,251,0.015)"} 1px, transparent 2px)` }} />
          </div>
        </>
      )}

      {user && (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative", zIndex: 10, opacity: phase === "shown" ? 1 : 0, transition: "opacity 0.8s ease 0.8s" }}>
          <div style={{ maxWidth: isQueen ? "700px" : "640px", width: "100%", textAlign: "center" }}>

            {/* ── QUEEN special header ── */}
            {isQueen ? (
              <>
                {/* Floating crown */}
                <div style={{ fontSize: "48px", marginBottom: "8px", animation: "crownFloat 3s ease-in-out infinite, fadeUp 0.6s ease both" }}>👑</div>

                {/* Spinning icon — purple for queen */}
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "96px", height: "96px", position: "relative", marginBottom: "28px", animation: "fadeUp 0.5s 0.1s ease both" }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(167,139,250,0.3)", animation: "spin 25s linear infinite" }} />
                  <div style={{ position: "absolute", inset: "10px", borderRadius: "50%", border: "1px dashed rgba(247,223,30,0.2)", animation: "spin 18s linear infinite reverse" }} />
                  {/* Pulse rings */}
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(167,139,250,0.4)", animation: "pulseRing 2s ease-out infinite" }} />
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(167,139,250,0.3)", animation: "pulseRing 2s ease-out 0.5s infinite" }} />
                  <div style={{ position: "absolute", top: "50%", left: "50%", marginTop: "-4px", marginLeft: "-4px", width: "8px", height: "8px", borderRadius: "50%", background: "#a78bfa", boxShadow: "0 0 12px #a78bfa", animation: "orbit 4s linear infinite" }} />
                  <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "linear-gradient(135deg, rgba(167,139,250,0.2), rgba(14,10,26,0.95))", border: "1px solid rgba(167,139,250,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", boxShadow: "0 0 40px rgba(167,139,250,0.2), inset 0 0 20px rgba(0,0,0,0.4)", animation: "queenGlow 3s ease-in-out infinite" }}>⚛</div>
                </div>

                <p style={{ fontSize: "10px", letterSpacing: "0.18em", color: "rgba(167,139,250,0.5)", marginBottom: "10px", textTransform: "uppercase", animation: "fadeUp 0.6s 0.15s ease both" }}>// 🎉 תחנה ראשונה — הושלמה!</p>

                <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: "700", color: "#ddd6fe", letterSpacing: "-0.02em", margin: "0 0 4px 0", textShadow: "0 0 40px rgba(167,139,250,0.3)", animation: "fadeUp 0.6s 0.18s ease both" }}>
                  יאיי! עשית את זה,{" "}
                  <span style={{
                    background: "linear-gradient(90deg, #a78bfa, #f7df1e, #61dafb)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: "shimmer 2.5s linear infinite",
                  }}>
                    asyncAwaitQueen
                  </span>
                  ! 👸
                </h1>

                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "rgba(167,139,250,0.45)", marginBottom: "28px", animation: "fadeUp 0.6s 0.22s ease both" }}>
                  מצאת את המשתמש הנכון — הנה הפרס שלך 🔑
                </p>

                <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.3), rgba(247,223,30,0.2), transparent)", margin: "0 0 28px 0", animation: "fadeUp 0.6s 0.24s ease both" }} />

                {/* ── THE REWARD: JWT Header reveal ── */}
                {headerRevealed && (
                  <div style={{
                    background: "rgba(14,10,26,0.7)",
                    border: "1px solid rgba(167,139,250,0.25)",
                    borderRadius: "14px",
                    padding: "24px",
                    marginBottom: "20px",
                    animation: "slideReveal 0.6s cubic-bezier(0.34,1.56,0.64,1) both",
                    position: "relative",
                    overflow: "hidden",
                  }}>
                    {/* Glow bg */}
                    <div style={{ position: "absolute", top: "-40px", left: "50%", transform: "translateX(-50%)", width: "300px", height: "120px", background: "radial-gradient(ellipse, rgba(167,139,250,0.12), transparent 70%)", pointerEvents: "none" }} />

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "16px" }}>🎁</span>
                        <span style={{ fontSize: "10px", color: "rgba(167,139,250,0.5)", letterSpacing: "0.14em" }}>// הפרס שלך — JWT Header</span>
                      </div>
                      <span style={{ fontSize: "9px", padding: "2px 10px", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: "20px", color: "rgba(167,139,250,0.8)", letterSpacing: "0.08em" }}>
                        ✨ תחנה 1 מתוך ?
                      </span>
                    </div>

                    {/* The token itself */}
                    <div
                      className="queen-header-token"
                      style={{
                        padding: "14px 16px",
                        borderRadius: "8px",
                        border: "1px solid rgba(167,139,250,0.4)",
                        marginBottom: "12px",
                        wordBreak: "break-all",
                        fontSize: "12px",
                        lineHeight: "1.7",
                        color: "rgba(129,200,220,1)",
                        textAlign: "left",
                        userSelect: "text",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {QUEEN_JWT_HEADER}
                    </div>

                    {/* Decoded hint */}
                    <div style={{ background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.12)", borderRadius: "8px", padding: "12px 14px", marginBottom: "14px", textAlign: "left" }}>
                      <p style={{ fontSize: "9px", color: "rgba(167,139,250,0.35)", letterSpacing: "0.1em", marginBottom: "8px" }}>// decoded header</p>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "11px", lineHeight: "1.9" }}>
                        <span style={{ color: "rgba(255,255,255,0.12)" }}>{"{"}</span><br />
                        &nbsp;&nbsp;<span style={{ color: "rgba(167,139,250,0.7)" }}>alg</span><span style={{ color: "rgba(255,255,255,0.12)" }}>: </span><span style={{ color: "rgba(247,223,30,0.6)" }}>"HS256"</span><span style={{ color: "rgba(255,255,255,0.12)" }}>,</span><br />
                        &nbsp;&nbsp;<span style={{ color: "rgba(167,139,250,0.7)" }}>typ</span><span style={{ color: "rgba(255,255,255,0.12)" }}>: </span><span style={{ color: "rgba(247,223,30,0.6)" }}>"JWT"</span><br />
                        <span style={{ color: "rgba(255,255,255,0.12)" }}>{"}"}</span>
                      </div>
                    </div>

                    {/* Copy button */}
                    <button
                      className="copy-btn"
                      onClick={handleCopyHeader}
                      style={{
                        width: "100%",
                        padding: "11px",
                        borderRadius: "7px",
                        border: `1px solid ${headerCopied ? "rgba(52,211,153,0.4)" : "rgba(167,139,250,0.3)"}`,
                        background: headerCopied ? "rgba(52,211,153,0.1)" : "rgba(167,139,250,0.1)",
                        color: headerCopied ? "rgba(52,211,153,0.9)" : "rgba(167,139,250,0.9)",
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: "11px",
                        fontWeight: "600",
                        letterSpacing: "0.08em",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "7px",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {headerCopied ? (
                        <><span>✓</span> copied to clipboard!</>
                      ) : (
                        <><span>📋</span> copy header</>
                      )}
                    </button>
                  </div>
                )}

                {/* Loading state before reveal */}
                {!headerRevealed && (
                  <div style={{ background: "rgba(14,10,26,0.7)", border: "1px solid rgba(167,139,250,0.15)", borderRadius: "14px", padding: "32px", marginBottom: "20px", animation: "fadeUp 0.5s ease both" }}>
                    <div style={{ width: "28px", height: "28px", border: "2px solid rgba(167,139,250,0.15)", borderTop: "2px solid rgba(167,139,250,0.7)", borderRadius: "50%", margin: "0 auto 14px", animation: "spin 0.8s linear infinite" }} />
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "rgba(167,139,250,0.4)" }}>פותח את הפרס שלך...</p>
                  </div>
                )}

                {/* Next step hint */}
                {headerRevealed && (
                  <div style={{ background: "rgba(247,223,30,0.03)", border: "1px solid rgba(247,223,30,0.12)", borderRadius: "10px", padding: "14px 18px", marginBottom: "24px", animation: "slideReveal 0.6s 0.2s cubic-bezier(0.34,1.56,0.64,1) both", textAlign: "left" }}>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "rgba(247,223,30,0.55)", lineHeight: "1.7" }}>
                      <span style={{ color: "rgba(247,223,30,0.8)", fontWeight: "600" }}>👉 הצעד הבא:</span> שמור את ה-Header — תצטרכי אותו לתחנה הבאה! 🗝️
                    </p>
                  </div>
                )}

              </>
            ) : (
              /* ── Regular user flow ── */
              <>
                <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "96px", height: "96px", position: "relative", marginBottom: "36px", animation: "fadeUp 0.6s ease both" }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(97,218,251,0.2)", animation: "spin 25s linear infinite" }} />
                  <div style={{ position: "absolute", inset: "10px", borderRadius: "50%", border: "1px dashed rgba(167,139,250,0.15)", animation: "spin 18s linear infinite reverse" }} />
                  <div style={{ position: "absolute", top: "50%", left: "50%", marginTop: "-4px", marginLeft: "-4px", width: "8px", height: "8px", borderRadius: "50%", background: "#61dafb", boxShadow: "0 0 12px #61dafb", animation: "orbit 6s linear infinite" }} />
                  <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "linear-gradient(135deg, rgba(97,218,251,0.15), rgba(14,20,36,0.95))", border: "1px solid rgba(97,218,251,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", boxShadow: "0 0 30px rgba(97,218,251,0.1), inset 0 0 20px rgba(0,0,0,0.4)", animation: "glow 4s ease-in-out infinite" }}>⚛</div>
                </div>
                <p style={{ fontSize: "10px", letterSpacing: "0.18em", color: "rgba(97,218,251,0.3)", marginBottom: "12px", textTransform: "uppercase", animation: "fadeUp 0.6s 0.1s ease both" }}>// authentication successful</p>
                <h1 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: "700", color: "#c8dff0", letterSpacing: "-0.02em", margin: "0 0 6px 0", textShadow: "0 0 40px rgba(97,218,251,0.1)", animation: "fadeUp 0.6s 0.15s ease both" }}>
                  Welcome, <span style={{ color: "rgba(97,218,251,0.75)" }}>{username}</span>
                </h1>
                <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(97,218,251,0.2), transparent)", margin: "0 0 32px 0", animation: "fadeUp 0.6s 0.22s ease both" }} />
              </>
            )}

            {/* ── DevTools card (shown for everyone) ── */}
            {!isQueen && (
              <div style={{ background: "rgba(14,20,36,0.6)", border: "1px solid rgba(97,218,251,0.09)", borderRadius: "10px", padding: "20px 22px", textAlign: "left", marginBottom: "24px", animation: "fadeUp 0.6s 0.28s ease both" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <span style={{ fontSize: "10px", color: "rgba(148,185,210,0.4)", letterSpacing: "0.12em" }}>// your access token is live</span>
                  <span style={{ fontSize: "9px", padding: "2px 8px", background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.18)", borderRadius: "3px", color: "rgba(52,211,153,0.7)", letterSpacing: "0.08em" }}>✓ AUTHENTICATED</span>
                </div>
                <div style={{ display: "flex", gap: "14px", marginBottom: "14px", alignItems: "flex-start" }}>
                  <div style={{ width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0, background: "rgba(97,218,251,0.08)", border: "1px solid rgba(97,218,251,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "rgba(97,218,251,0.6)", fontWeight: "600" }}>1</div>
                  <div>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "rgba(180,210,230,0.6)", margin: "0 0 3px 0", lineHeight: "1.5" }}>Open <strong style={{ color: "rgba(180,210,230,0.85)" }}>DevTools</strong> → Application → Local Storage</p>
                    <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "10px", color: "rgba(97,218,251,0.35)", margin: 0 }}>Find the <span style={{ color: "rgba(97,218,251,0.55)" }}>token</span> key — that's your JWT</p>
                  </div>
                </div>
                <div style={{ height: "1px", background: "rgba(97,218,251,0.05)", margin: "4px 0 14px 36px" }} />
                <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div style={{ width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0, background: "rgba(247,223,30,0.07)", border: "1px solid rgba(247,223,30,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "rgba(247,223,30,0.55)", fontWeight: "600" }}>2</div>
                  <div>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "rgba(180,210,230,0.6)", margin: "0 0 3px 0", lineHeight: "1.5" }}>Copy and paste it into <a href="https://jwt.io" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(97,218,251,0.7)", fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", textDecoration: "none", borderBottom: "1px solid rgba(97,218,251,0.25)" }}>jwt.io ↗</a></p>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "rgba(247,223,30,0.4)", margin: 0, lineHeight: "1.5" }}>The payload is fully readable — it's Base64, not encrypted. <span style={{ color: "rgba(255,120,100,0.55)" }}>Never store sensitive data in a JWT.</span></p>
                  </div>
                </div>
              </div>
            )}

            {/* Context state block */}
            <div style={{ background: "rgba(16,22,40,0.55)", border: `1px solid ${isQueen ? "rgba(167,139,250,0.09)" : "rgba(167,139,250,0.09)"}`, borderRadius: "10px", padding: "18px 22px", textAlign: "left", marginBottom: "24px", animation: "fadeUp 0.6s 0.33s ease both" }}>
              <p style={{ fontSize: "10px", color: `${isQueen ? "rgba(167,139,250,0.3)" : "rgba(167,139,250,0.3)"}`, letterSpacing: "0.12em", marginBottom: "12px" }}>// react context state — all subscribed components re-rendered</p>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "12px", lineHeight: "1.9" }}>
                <span style={{ color: "rgba(255,255,255,0.15)" }}>{"{"}</span><br />
                &nbsp;&nbsp;<span style={{ color: "rgba(167,139,250,0.65)" }}>user</span><span style={{ color: "rgba(255,255,255,0.15)" }}>: {"{"}</span><br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "rgba(97,218,251,0.6)" }}>username</span><span style={{ color: "rgba(255,255,255,0.15)" }}>: </span><span style={{ color: "rgba(247,223,30,0.6)" }}>"{username}"</span><span style={{ color: "rgba(255,255,255,0.15)" }}>,</span><br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "rgba(97,218,251,0.6)" }}>isAuthenticated</span><span style={{ color: "rgba(255,255,255,0.15)" }}>: </span><span style={{ color: "rgba(52,211,153,0.65)" }}>true</span><br />
                {isQueen && <>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "rgba(97,218,251,0.6)" }}>role</span><span style={{ color: "rgba(255,255,255,0.15)" }}>: </span><span style={{ color: "rgba(247,223,30,0.6)" }}>"👸 queen"</span><br /></>}
                &nbsp;&nbsp;<span style={{ color: "rgba(255,255,255,0.15)" }}>{"}"}</span><br />
                <span style={{ color: "rgba(255,255,255,0.15)" }}>{"}"}</span>
              </div>
            </div>

            {/* CTA buttons */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", animation: "fadeUp 0.6s 0.38s ease both" }}>            
              <button className="badge-btn" onClick={() => navigate("/dashboard")}
                style={{ padding: "12px 22px", fontSize: "12px", fontWeight: "600", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.06em", color: isQueen ? "#0d0a1a" : "#0c1120", background: isQueen ? "linear-gradient(135deg, rgba(167,139,250,0.85), rgba(124,90,240,0.75))" : "linear-gradient(135deg, rgba(97,218,251,0.75), rgba(58,184,216,0.75))", border: "none", borderRadius: "6px", cursor: "pointer", boxShadow: isQueen ? "0 4px 18px rgba(167,139,250,0.2)" : "0 4px 18px rgba(97,218,251,0.12)" }}>
                🕵️ תחנה 1 — useContext
              </button>
              <button className="badge-btn" onClick={() => navigate("/vault")}
                style={{ padding: "12px 22px", fontSize: "12px", fontWeight: "600", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.06em", color: isQueen ? "#a78bfa" : "#61dafb", background: isQueen ? "rgba(167,139,250,0.06)" : "rgba(97,218,251,0.06)", border: `1px solid ${isQueen ? "rgba(167,139,250,0.2)" : "rgba(97,218,251,0.2)"}`, borderRadius: "6px", cursor: "pointer" }}>
                🔒 תחנה 2 — localStorage
              </button>
              <a href="https://jwt.io" target="_blank" rel="noopener noreferrer" className="badge-btn"
                style={{ padding: "12px 22px", fontSize: "12px", fontWeight: "600", fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.06em", color: isQueen ? "#a78bfa" : "#61dafb", background: isQueen ? "rgba(167,139,250,0.06)" : "rgba(97,218,251,0.06)", border: `1px solid ${isQueen ? "rgba(167,139,250,0.2)" : "rgba(97,218,251,0.2)"}`, borderRadius: "6px", cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                ↗ jwt.io
              </a>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default EscapeRoom;