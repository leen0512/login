/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// ─── Demo JWT token (split into 3 parts by ".") ───────────────────────────────
const DEMO_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsIm5hbWUiOiJEZW1vVXNlciIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDAzNjAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

// ─── Color palette (centralised so it's easy to change) ───────────────────────
const C = {
  bg: "#1a1f2e",
  panel: "rgba(30,36,52,0.8)",
  border: "rgba(255,255,255,0.07)",
  text: "#c4cdd8",
  textMuted: "rgba(148,165,185,0.5)",
  header:  { base: "rgba(129,200,220,0.55)", lit: "rgba(129,200,220,1)",  bg: "rgba(129,200,220,0.06)", border: "rgba(129,200,220,0.25)" },
  payload: { base: "rgba(180,160,100,0.55)", lit: "rgba(220,195,120,1)",  bg: "rgba(180,160,100,0.06)", border: "rgba(180,160,100,0.25)" },
  sig:     { base: "rgba(180,120,120,0.55)", lit: "rgba(210,140,140,1)",  bg: "rgba(180,120,120,0.06)", border: "rgba(180,120,120,0.25)" },
  flow: [
    "rgba(110,185,210,0.7)",
    "rgba(150,125,210,0.7)",
    "rgba(185,165,90,0.7)",
    "rgba(90,185,150,0.7)",
    "rgba(205,120,80,0.7)",
  ],
};

// ─── JWT segment data (label, decoded fields, explanation note) ────────────────
const JWT_SEGMENTS = [
  {
    label: "Header",  sub: "alg + typ",
    detail: [["alg", '"HS256"'], ["typ", '"JWT"']],
    note: "Specifies which algorithm signs the token.",
    c: C.header,
  },
  {
    label: "Payload", sub: "user claims",
    detail: [["sub", '"user_123"'], ["name", '"DemoUser"'], ["iat", "1700000000"], ["exp", "1700003600"]],
    note: "⚠ Base64 encoded — not encrypted. Anyone can read this.",
    c: C.payload,
  },
  {
    label: "Signature", sub: "HMAC-SHA256",
    detail: [["HMAC", 'base64(header) + "." + base64(payload)'], ["key", "SECRET_KEY"]],
    note: "Tamper with the payload → signature breaks → server rejects.",
    c: C.sig,
  },
];

// ─── Auth flow steps shown in the right panel ─────────────────────────────────
const FLOW_NODES = [
  { label: "Login Form", sub: "React state",    icon: "⌨️" },
  { label: "POST /login", sub: "HTTP Request",  icon: "→"  },
  { label: "JWT Token",  sub: "Server response",icon: "🔑" },
  { label: "Storage",    sub: "localStorage",   icon: "💾" },
  { label: "useContext", sub: "Re-render!",      icon: "⚛️" },
];

// ─── Token comparison cards ────────────────────────────────────────────────────
const TOKEN_CARDS = [
  {
    label: "Access Token",  dot: "rgba(110,185,210,0.5)",
    lines: ["⏱ Short-lived (15 min)", "Sent with every API request"],
    code: "memory / httpOnly cookie", codeColor: "rgba(110,185,210,0.5)",
    bg: "rgba(110,185,210,0.03)", border: "rgba(110,185,210,0.09)",
  },
  {
    label: "Refresh Token", dot: "rgba(180,160,100,0.5)",
    lines: ["📅 Long-lived (7 days)", "Gets new access tokens"],
    code: "httpOnly cookie only!", codeColor: "rgba(190,120,110,0.5)",
    bg: "rgba(180,160,100,0.03)", border: "rgba(180,160,100,0.08)",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const LoginForm = ({ onLoginSuccess }: { onLoginSuccess?: () => void }) => {
  const { login } = useContext(AuthContext) as any;
  const navigate = useNavigate();

  // Form state
  const [username, setUsername]         = useState("");
  const [password, setPassword]         = useState("");
  const [isLoading, setIsLoading]       = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Right-panel visualiser state
  const [flowStep, setFlowStep]           = useState(0);
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const jwtParts  = DEMO_JWT.split(".");

  // ── Animated dot-grid background ──────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    let t = 0, animId: number;
    const draw = () => {
      t += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const sp = 34;
      for (let x = 0; x < canvas.width + sp; x += sp) {
        for (let y = 0; y < canvas.height + sp; y += sp) {
          const d = Math.sqrt((x - canvas.width / 2) ** 2 + (y - canvas.height / 2) ** 2);
          const p = Math.sin(d * 0.022 - t * 1.6) * 0.5 + 0.5;
          ctx.fillStyle = `rgba(110,140,180,${0.02 + p * 0.04})`;
          ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill();
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  // ── Advance the flow diagram as the user types ─────────────────────────────
  useEffect(() => { if (username.length === 1 && flowStep === 0) setFlowStep(1); }, [username]);
  useEffect(() => { if (password.length === 1 && flowStep <= 1)  setFlowStep(2); }, [password]);

  // ── Login handler ──────────────────────────────────────────────────────────
  const handleLogin = async () => {
    setIsLoading(true);
    setFlowStep(3);
    try {
      await login(username, password);
      setFlowStep(5);
      setTimeout(() => { onLoginSuccess?.(); navigate("/escape-room"); }, 1200);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleLogin(); };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", fontFamily:"'JetBrains Mono','Fira Code',monospace", position:"relative", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        @keyframes spin     { to { transform:rotate(360deg); } }
        @keyframes fadeUp   { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes flowDot  { 0%{left:-8px;opacity:0;} 15%,85%{opacity:1;} 100%{left:calc(100% + 8px);opacity:0;} }
        @keyframes revealBox{ from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
        @keyframes blink    { 0%,100%{opacity:1;} 50%{opacity:0;} }
        .t-input {
          width:100%; padding:11px 14px; font-size:14px;
          background:rgba(255,255,255,0.04) !important; color:#c4cdd8 !important;
          caret-color:rgba(110,185,210,0.8);
          border:1px solid rgba(255,255,255,0.08) !important; border-radius:6px !important;
          font-family:'JetBrains Mono',monospace !important; outline:none;
          transition:border-color 0.25s, box-shadow 0.25s !important;
        }
        .t-input::placeholder { color:rgba(255,255,255,0.15) !important; font-style:italic; }
        .t-input:focus {
          border-color:rgba(110,185,210,0.35) !important;
          box-shadow:0 0 0 3px rgba(110,185,210,0.06) !important;
          background:rgba(255,255,255,0.06) !important;
        }
        .btn-main {
          width:100%; padding:12px; border-radius:6px; cursor:pointer;
          font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:600; letter-spacing:0.07em;
          background:rgba(110,185,210,0.18); color:rgba(129,200,220,0.9);
          border:1px solid rgba(110,185,210,0.2); transition:all 0.25s ease;
          display:flex; align-items:center; justify-content:center; gap:8px;
        }
        .btn-main:hover:not(:disabled) {
          background:rgba(110,185,210,0.26); border-color:rgba(110,185,210,0.4);
          color:rgba(170,220,235,1); transform:translateY(-1px);
          box-shadow:0 4px 16px rgba(110,185,210,0.1);
        }
        .btn-main:disabled { opacity:0.3; cursor:not-allowed; }
        .jwt-chip { flex:1; padding:9px 12px; border-radius:6px; text-align:center; cursor:pointer; border:1px solid rgba(255,255,255,0.06); background:rgba(255,255,255,0.02); transition:all 0.2s ease; }
        .jwt-chip:hover { background:rgba(255,255,255,0.05); border-color:rgba(255,255,255,0.12); }
      `}</style>

      {/* Background dot grid */}
      <canvas ref={canvasRef} style={{ position:"fixed", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0 }} />

      {/* ══ LEFT PANEL — Login form ══════════════════════════════════════════ */}
      <div style={{ width:"390px", minHeight:"100vh", flexShrink:0, background:"rgba(20,25,38,0.96)", borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", justifyContent:"center", padding:"44px 34px", position:"relative", zIndex:10, animation:"fadeUp 0.6s ease both" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"1px", background:"linear-gradient(90deg, transparent, rgba(110,185,210,0.3), rgba(150,125,210,0.25), transparent)" }} />

        {/* Logo row */}
        <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"28px" }}>
          <div style={{ width:"34px", height:"34px", borderRadius:"7px", background:"rgba(110,185,210,0.12)", border:"1px solid rgba(110,185,210,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"17px" }}>⚛</div>
          <div>
            <div style={{ fontSize:"12px", fontWeight:"600", color:"rgba(129,200,220,0.7)" }}>AuthContext Lab</div>
            <div style={{ fontSize:"10px", color:"rgba(148,165,185,0.4)" }}>Workshop Demo · סדנה 2</div>
          </div>
          <span style={{ marginLeft:"auto", fontSize:"9px", color:"rgba(110,185,210,0.45)", background:"rgba(110,185,210,0.06)", border:"1px solid rgba(110,185,210,0.12)", borderRadius:"3px", padding:"2px 7px" }}>LIVE</span>
        </div>

        <h1 style={{ fontSize:"22px", fontWeight:"700", color:C.text, marginBottom:"4px" }}>Log In</h1>
        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:"12px", color:C.textMuted, marginBottom:"28px" }}>React Auth Context &amp; JWT</p>

        {/* Username */}
        <div style={{ marginBottom:"16px" }}>
          <label style={{ display:"block", fontSize:"10px", letterSpacing:"0.1em", marginBottom:"6px", color: focusedField==="u" ? "rgba(110,185,210,0.6)" : "rgba(148,165,185,0.35)", transition:"color 0.25s" }}>// username</label>
          <input className="t-input" type="text" placeholder="your-username"
            value={username} onChange={e => setUsername(e.target.value)} onKeyPress={handleKeyPress}
            onFocus={() => setFocusedField("u")} onBlur={() => setFocusedField(null)} />
        </div>

        {/* Password */}
        <div style={{ marginBottom:"22px" }}>
          <label style={{ display:"block", fontSize:"10px", letterSpacing:"0.1em", marginBottom:"6px", color: focusedField==="p" ? "rgba(110,185,210,0.6)" : "rgba(148,165,185,0.35)", transition:"color 0.25s" }}>// password</label>
          <input className="t-input" type="password" placeholder="••••••••"
            value={password} onChange={e => setPassword(e.target.value)} onKeyPress={handleKeyPress}
            onFocus={() => setFocusedField("p")} onBlur={() => setFocusedField(null)}
            style={{ letterSpacing:"0.1em" }} />
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:"10px", color:"rgba(190,120,110,0.45)", marginTop:"5px" }}>⚠ Never hardcode passwords in source code</p>
        </div>

        {/* Submit */}
        <button className="btn-main" onClick={handleLogin} disabled={isLoading || !username || !password}>
          {isLoading
            ? <><span style={{ width:"12px", height:"12px", border:"1.5px solid rgba(110,185,210,0.2)", borderTop:"1.5px solid rgba(110,185,210,0.8)", borderRadius:"50%", display:"inline-block", animation:"spin 0.7s linear infinite" }} />Authenticating...</>
            : "→  POST /api/login"}
        </button>

        {/* Tip card */}
        <div style={{ marginTop:"18px", padding:"12px 14px", background:"rgba(180,160,100,0.04)", border:"1px solid rgba(180,160,100,0.1)", borderRadius:"6px" }}>
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:"11px", color:"rgba(175,155,100,0.5)", lineHeight:"1.7" }}>
            <span style={{ color:"rgba(200,175,110,0.65)", fontWeight:"600" }}>💡 tip:</span> After login, open DevTools → Application → Local Storage, copy your token and paste it at{" "}
            <a href="https://jwt.io" target="_blank" rel="noopener noreferrer" style={{ color:"rgba(110,185,210,0.6)", textDecoration:"none", borderBottom:"1px solid rgba(110,185,210,0.2)" }}>jwt.io</a>
            {" "}— it's Base64, not encrypted!
          </p>
        </div>

        <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"10px", color:"rgba(148,165,185,0.18)", marginTop:"18px", textAlign:"center", fontStyle:"italic" }}>
          <span style={{ animation:"blink 1.2s ease-in-out infinite", display:"inline-block" }}>_</span>{" "}type to activate flow →
        </p>
      </div>

      {/* ══ RIGHT PANEL — Visualiser ═════════════════════════════════════════ */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"36px 44px", position:"relative", zIndex:10, minWidth:0, overflowY:"auto" }}>

        {/* Title */}
        <div style={{ marginBottom:"24px", animation:"fadeUp 0.6s 0.08s ease both" }}>
          <p style={{ fontSize:"10px", color:"rgba(148,165,185,0.3)", letterSpacing:"0.14em", marginBottom:"5px" }}>// auth flow visualizer</p>
          <h2 style={{ fontSize:"17px", fontWeight:"700", color:C.text }}>From Login → Context Update</h2>
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:"12px", color:"rgba(148,165,185,0.35)", marginTop:"4px" }}>Start typing — watch the flow light up</p>
        </div>

        {/* ── Flow diagram ─────────────────────────────────────────────────── */}
        <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:"10px", padding:"20px 18px", marginBottom:"16px", animation:"fadeUp 0.6s 0.12s ease both" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"4px", overflowX:"auto", paddingBottom:"2px" }}>
            {FLOW_NODES.map((node, i) => {
              const active = flowStep > i;
              const color  = C.flow[i];
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"4px", flexShrink:0 }}>
                  <div style={{ padding:"9px 12px", borderRadius:"7px", textAlign:"center", minWidth:"82px", transition:"all 0.5s ease", background: active ? color.replace("0.7","0.08") : "rgba(255,255,255,0.02)", border:`1px solid ${active ? color.replace("0.7","0.35") : "rgba(255,255,255,0.05)"}` }}>
                    <div style={{ fontSize:"16px", lineHeight:1, marginBottom:"4px" }}>{node.icon}</div>
                    <div style={{ fontSize:"10px", fontWeight:"600", color: active ? color : "rgba(255,255,255,0.18)", transition:"color 0.5s" }}>{node.label}</div>
                    <div style={{ fontFamily:"'Inter',sans-serif", fontSize:"9px", color: active ? color.replace("0.7","0.45") : "rgba(255,255,255,0.1)", marginTop:"1px", transition:"color 0.5s" }}>{node.sub}</div>
                    {active && <div style={{ width:"5px", height:"5px", borderRadius:"50%", background:color, margin:"5px auto 0", boxShadow:`0 0 6px ${color}` }} />}
                  </div>
                  {i < FLOW_NODES.length - 1 && (
                    <div style={{ width:"18px", height:"1px", position:"relative", background: flowStep > i ? color.replace("0.7","0.4") : "rgba(255,255,255,0.07)", overflow:"hidden", flexShrink:0, transition:"background 0.5s" }}>
                      {flowStep > i && <div style={{ position:"absolute", top:"-1px", width:"6px", height:"3px", background:"rgba(255,255,255,0.7)", borderRadius:"2px", animation:"flowDot 1.4s ease-in-out infinite" }} />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop:"14px", paddingTop:"14px", borderTop:`1px solid ${C.border}` }}>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:"11px", color:"rgba(148,165,185,0.38)", lineHeight:"1.7" }}>
              <span style={{ color:"rgba(205,145,90,0.6)" }}>⚛ useContext</span> isn't just a global variable — it triggers a{" "}
              <strong style={{ color:"rgba(148,165,185,0.6)", fontWeight:"600" }}>re-render of every subscribed component</strong>{" "}
              the moment the context value changes.
            </p>
          </div>
        </div>

        {/* ── JWT anatomy ──────────────────────────────────────────────────── */}
        <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:"10px", padding:"20px 18px", marginBottom:"16px", animation:"fadeUp 0.6s 0.16s ease both" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"12px" }}>
            <span style={{ fontSize:"10px", color:"rgba(148,165,185,0.3)", letterSpacing:"0.12em" }}>// jwt anatomy — click each segment</span>
            <a href="https://jwt.io" target="_blank" rel="noopener noreferrer" style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"10px", color:"rgba(110,185,210,0.5)", textDecoration:"none", background:"rgba(110,185,210,0.06)", border:"1px solid rgba(110,185,210,0.15)", borderRadius:"4px", padding:"2px 9px" }}>↗ jwt.io</a>
          </div>

          {/* Token string — 3 coloured clickable parts */}
          <div style={{ padding:"11px 13px", background:"rgba(0,0,0,0.2)", borderRadius:"6px", border:`1px solid ${C.border}`, marginBottom:"10px", fontSize:"11px", wordBreak:"break-all", lineHeight:"1.8", userSelect:"text" }}>
            {jwtParts.map((part, i) => {
              const seg      = JWT_SEGMENTS[i];
              const isActive = activeSegment === i;
              return (
                <span key={i}>
                  <span onClick={() => setActiveSegment(isActive ? null : i)}
                    style={{ color: isActive ? seg.c.lit : seg.c.base, background: isActive ? seg.c.bg : "transparent", borderRadius:"3px", padding:"1px 2px", cursor:"pointer", transition:"color 0.2s, background 0.2s", textDecoration: isActive ? "underline" : "none", textDecorationColor: seg.c.lit, textUnderlineOffset:"3px" }}>
                    {part}
                  </span>
                  {i < 2 && <span style={{ color:"rgba(255,255,255,0.12)" }}>.</span>}
                </span>
              );
            })}
          </div>

          {/* Chips — hover to preview, click to lock */}
          <div style={{ display:"flex", gap:"8px" }}>
            {JWT_SEGMENTS.map((seg, i) => {
              const isActive = activeSegment === i;
              return (
                <div key={i} className="jwt-chip"
                  onClick={()     => setActiveSegment(isActive ? null : i)}
                  onMouseEnter={() => { if (activeSegment === null) setActiveSegment(i); }}
                  onMouseLeave={() => { if (activeSegment === i)    setActiveSegment(null); }}
                  style={{ background: isActive ? seg.c.bg : "rgba(255,255,255,0.02)", border:`1px solid ${isActive ? seg.c.border : "rgba(255,255,255,0.06)"}`, transition:"all 0.2s ease" }}>
                  <div style={{ fontSize:"10px", fontWeight:"600", letterSpacing:"0.04em", color: isActive ? seg.c.lit : seg.c.base, transition:"color 0.2s" }}>{seg.label}</div>
                  <div style={{ fontFamily:"'Inter',sans-serif", fontSize:"9px", color:"rgba(148,165,185,0.3)", marginTop:"2px" }}>{seg.sub}</div>
                </div>
              );
            })}
          </div>

          {/* Decoded detail panel */}
          {activeSegment !== null && (
            <div style={{ marginTop:"10px", padding:"12px 14px", background: JWT_SEGMENTS[activeSegment].c.bg, border:`1px solid ${JWT_SEGMENTS[activeSegment].c.border}`, borderRadius:"6px", animation:"revealBox 0.2s ease both" }}>
              <p style={{ fontSize:"10px", color: JWT_SEGMENTS[activeSegment].c.base, marginBottom:"8px", letterSpacing:"0.08em" }}>
                // decoded {JWT_SEGMENTS[activeSegment].label.toLowerCase()}
              </p>
              {JWT_SEGMENTS[activeSegment].detail.map(([k, v]) => (
                <div key={k} style={{ display:"flex", gap:"14px", lineHeight:"1.9" }}>
                  <span style={{ fontSize:"11px", color: JWT_SEGMENTS[activeSegment].c.base, minWidth:"50px" }}>{k}:</span>
                  <span style={{ fontSize:"11px", color:"rgba(180,195,210,0.55)" }}>{v}</span>
                </div>
              ))}
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:"10px", color:"rgba(190,155,110,0.5)", marginTop:"8px", lineHeight:"1.5" }}>
                {JWT_SEGMENTS[activeSegment].note}
              </p>
            </div>
          )}
        </div>

        {/* ── Access vs Refresh token cards ────────────────────────────────── */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", animation:"fadeUp 0.6s 0.2s ease both" }}>
          {TOKEN_CARDS.map(t => (
            <div key={t.label} style={{ padding:"14px", background:t.bg, border:`1px solid ${t.border}`, borderRadius:"8px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"8px" }}>
                <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:t.dot }} />
                <span style={{ fontSize:"11px", fontWeight:"600", color:t.dot }}>{t.label}</span>
              </div>
              <p style={{ fontFamily:"'Inter',sans-serif", fontSize:"11px", color:"rgba(148,165,185,0.38)", lineHeight:"1.8" }}>
                {t.lines[0]}<br />{t.lines[1]}<br />
                <code style={{ color:t.codeColor, fontFamily:"'JetBrains Mono',monospace", fontSize:"10px" }}>{t.code}</code>
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default LoginForm;