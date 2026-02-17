/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../contexts/AuthContext";
import LoginForm from "./LoginForm";
import { useNavigate } from "react-router-dom";

const EscapeRoom = () => {
  const { user } = useContext(AuthContext) as any;
  const [phase, setPhase] = useState<"hidden" | "sliding" | "shown">("hidden");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setTimeout(() => setPhase("sliding"), 100);
      setTimeout(() => setPhase("shown"), 1800);
    }
  }, [user]);

  // Animated dot-grid + floating particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    type Particle = { x: number; y: number; vx: number; vy: number; alpha: number; size: number; color: string; };
    const colors = ["#61dafb", "#a78bfa", "#f7df1e", "#34d399"];
    const particles: Particle[] = Array.from({ length: 30 }, () => ({
      x: Math.random(), y: Math.random() + 0.2,
      vx: (Math.random() - 0.5) * 0.0004,
      vy: -(0.0002 + Math.random() * 0.0003),
      alpha: 0.2 + Math.random() * 0.4,
      size: 1 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    let t = 0;
    let animId: number;
    const draw = () => {
      t += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dot grid
      const sp = 36;
      for (let x = 0; x < canvas.width + sp; x += sp) {
        for (let y = 0; y < canvas.height + sp; y += sp) {
          const d = Math.sqrt(Math.pow(x - canvas.width / 2, 2) + Math.pow(y - canvas.height / 2, 2));
          const p = Math.sin(d * 0.02 - t * 1.5) * 0.5 + 0.5;
          ctx.fillStyle = `rgba(97,218,251,${0.025 + p * 0.055})`;
          ctx.beginPath();
          ctx.arc(x, y, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -0.05) { p.y = 1.1; p.x = Math.random(); }
        const px = p.x * canvas.width, py = p.y * canvas.height;
        const g = ctx.createRadialGradient(px, py, 0, px, py, p.size * 4);
        g.addColorStop(0, p.color.replace(")", `,${p.alpha})`).replace("rgb", "rgba"));
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(px, py, p.size * 4, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  const username = (user as any)?.username ?? "";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0c1120",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideLeft { from { transform:translateX(0); } to { transform:translateX(-100%); } }
        @keyframes slideRight { from { transform:translateX(0); } to { transform:translateX(100%); } }
        @keyframes pulse { 0%,100%{opacity:0.6;} 50%{opacity:1;} }
        @keyframes spin { to{transform:rotate(360deg);} }
        @keyframes glow { 0%,100%{box-shadow:0 0 0 0 rgba(97,218,251,0);} 50%{box-shadow:0 0 20px 4px rgba(97,218,251,0.15);} }
        @keyframes orbit { from{transform:rotate(0deg) translateX(44px) rotate(0deg);} to{transform:rotate(360deg) translateX(44px) rotate(-360deg);} }
        @keyframes typeIn {
          from { clip-path: inset(0 100% 0 0); }
          to { clip-path: inset(0 0% 0 0); }
        }
        @keyframes scanline { from { top:-80px; } to { top:calc(100% + 80px); } }
        .badge-btn { transition: all 0.3s ease; }
        .badge-btn:hover { background: rgba(97,218,251,0.12) !important; border-color: rgba(97,218,251,0.4) !important; transform: translateY(-1px); }
      `}</style>

      {/* Background canvas */}
      <canvas ref={canvasRef} style={{
        position: "fixed", inset: 0, width: "100%", height: "100%",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Scanline */}
      <div style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{
          position: "absolute", left: 0, right: 0, height: "80px",
          background: "linear-gradient(180deg, transparent, rgba(97,218,251,0.02), transparent)",
          animation: "scanline 7s linear infinite",
        }} />
      </div>

      {/* Color bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "2px", zIndex: 100,
        background: "linear-gradient(90deg, rgba(97,218,251,0.55), rgba(167,139,250,0.45), rgba(247,223,30,0.4), rgba(255,107,107,0.45))",
      }} />

      {/* LOGIN STATE */}
      {!user && <LoginForm onLoginSuccess={() => {}} />}

      {/* SLIDE-OUT DOOR PANELS */}
      {user && phase !== "hidden" && (
        <>
          <div style={{
            position: "fixed", top: 0, left: 0, width: "50%", height: "100%",
            background: "linear-gradient(90deg, #0c1120 0%, #111827 100%)",
            zIndex: 50,
            transformOrigin: "left",
            transform: phase === "sliding" || phase === "shown" ? "translateX(-100%)" : "translateX(0)",
            transition: "transform 1.4s cubic-bezier(0.77, 0, 0.18, 1) 0.1s",
            borderRight: "1px solid rgba(97,218,251,0.15)",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "repeating-linear-gradient(180deg, transparent 0px, rgba(97,218,251,0.015) 1px, transparent 2px)",
            }} />
          </div>
          <div style={{
            position: "fixed", top: 0, right: 0, width: "50%", height: "100%",
            background: "linear-gradient(270deg, #0c1120 0%, #111827 100%)",
            zIndex: 50,
            transformOrigin: "right",
            transform: phase === "sliding" || phase === "shown" ? "translateX(100%)" : "translateX(0)",
            transition: "transform 1.4s cubic-bezier(0.77, 0, 0.18, 1) 0.1s",
            borderLeft: "1px solid rgba(97,218,251,0.15)",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "repeating-linear-gradient(180deg, transparent 0px, rgba(97,218,251,0.015) 1px, transparent 2px)",
            }} />
          </div>
        </>
      )}

      {/* WELCOME CONTENT */}
      {user && (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          position: "relative",
          zIndex: 10,
          opacity: phase === "shown" ? 1 : 0,
          transition: "opacity 0.8s ease 0.8s",
        }}>
          <div style={{
            maxWidth: "640px",
            width: "100%",
            textAlign: "center",
          }}>

            {/* Orbit icon */}
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: "96px", height: "96px", position: "relative",
              marginBottom: "36px",
              animation: "fadeUp 0.6s ease both",
            }}>
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                border: "1px solid rgba(97,218,251,0.2)",
                animation: "spin 25s linear infinite",
              }} />
              <div style={{
                position: "absolute", inset: "10px", borderRadius: "50%",
                border: "1px dashed rgba(167,139,250,0.15)",
                animation: "spin 18s linear infinite reverse",
              }} />
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                marginTop: "-4px", marginLeft: "-4px",
                width: "8px", height: "8px", borderRadius: "50%",
                background: "#61dafb", boxShadow: "0 0 12px #61dafb",
                animation: "orbit 6s linear infinite",
              }} />
              <div style={{
                width: "54px", height: "54px", borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(97,218,251,0.15), rgba(14,20,36,0.95))",
                border: "1px solid rgba(97,218,251,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "26px",
                boxShadow: "0 0 30px rgba(97,218,251,0.1), inset 0 0 20px rgba(0,0,0,0.4)",
                animation: "glow 4s ease-in-out infinite",
              }}>⚛</div>
            </div>

            {/* Label */}
            <p style={{
              fontSize: "10px", letterSpacing: "0.18em",
              color: "rgba(97,218,251,0.3)", marginBottom: "12px",
              textTransform: "uppercase",
              animation: "fadeUp 0.6s 0.1s ease both",
            }}>// authentication successful</p>

            {/* Username */}
            <h1 style={{
              fontSize: "clamp(32px, 6vw, 56px)", fontWeight: "700",
              color: "#c8dff0", letterSpacing: "-0.02em",
              margin: "0 0 6px 0",
              textShadow: "0 0 40px rgba(97,218,251,0.1)",
              animation: "fadeUp 0.6s 0.15s ease both",
            }}>
              Welcome,{" "}
              <span style={{ color: "rgba(97,218,251,0.75)" }}>
                {username}
              </span>
            </h1>

            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "15px", color: "rgba(148,195,220,0.4)",
              margin: "0 0 36px 0",
              animation: "fadeUp 0.6s 0.2s ease both",
            }}>
              ברוכה הבאה &nbsp;·&nbsp; Context updated &nbsp;·&nbsp; Re-render triggered ⚡
            </p>

            {/* Divider */}
            <div style={{
              height: "1px", background: "linear-gradient(90deg, transparent, rgba(97,218,251,0.2), transparent)",
              margin: "0 0 32px 0",
              animation: "fadeUp 0.6s 0.22s ease both",
            }} />

            {/* JWT instructional card */}
            <div style={{
              background: "rgba(14,20,36,0.6)", border: "1px solid rgba(97,218,251,0.09)",
              borderRadius: "10px", padding: "20px 22px",
              textAlign: "left", marginBottom: "24px",
              animation: "fadeUp 0.6s 0.28s ease both",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <span style={{ fontSize: "10px", color: "rgba(148,185,210,0.4)", letterSpacing: "0.12em" }}>
                  // your access token is live
                </span>
                <span style={{
                  fontSize: "9px", padding: "2px 8px",
                  background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.18)",
                  borderRadius: "3px", color: "rgba(52,211,153,0.7)", letterSpacing: "0.08em",
                }}>✓ AUTHENTICATED</span>
              </div>

              {/* Step 1 */}
              <div style={{ display: "flex", gap: "14px", marginBottom: "14px", alignItems: "flex-start" }}>
                <div style={{
                  width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
                  background: "rgba(97,218,251,0.08)", border: "1px solid rgba(97,218,251,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", color: "rgba(97,218,251,0.6)", fontWeight: "600",
                }}>1</div>
                <div>
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "12px", color: "rgba(180,210,230,0.6)", margin: "0 0 3px 0", lineHeight: "1.5",
                  }}>
                    Open <strong style={{ color: "rgba(180,210,230,0.85)" }}>DevTools</strong> → Application → Local Storage
                  </p>
                  <p style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "10px", color: "rgba(97,218,251,0.35)", margin: 0,
                  }}>
                    Find the <span style={{ color: "rgba(97,218,251,0.55)" }}>token</span> key — that's your JWT access token
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: "rgba(97,218,251,0.05)", margin: "4px 0 14px 36px" }} />

              {/* Step 2 */}
              <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <div style={{
                  width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
                  background: "rgba(247,223,30,0.07)", border: "1px solid rgba(247,223,30,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", color: "rgba(247,223,30,0.55)", fontWeight: "600",
                }}>2</div>
                <div>
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "12px", color: "rgba(180,210,230,0.6)", margin: "0 0 3px 0", lineHeight: "1.5",
                  }}>
                    Copy the token and paste it into{" "}
                    <a href="https://jwt.io" target="_blank" rel="noopener noreferrer"
                      style={{ color: "rgba(97,218,251,0.7)", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", textDecoration: "none", borderBottom: "1px solid rgba(97,218,251,0.25)" }}>
                      jwt.io ↗
                    </a>
                  </p>
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "11px", color: "rgba(247,223,30,0.4)", margin: 0, lineHeight: "1.5",
                  }}>
                    Notice: the payload is fully readable — it's Base64, not encrypted.{" "}
                    <span style={{ color: "rgba(255,120,100,0.55)" }}>Never store sensitive data in a JWT.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Context state card */}
            <div style={{
              background: "rgba(16,22,40,0.55)", border: "1px solid rgba(167,139,250,0.09)",
              borderRadius: "10px", padding: "18px 22px",
              textAlign: "left", marginBottom: "24px",
              animation: "fadeUp 0.6s 0.33s ease both",
            }}>
              <p style={{ fontSize: "10px", color: "rgba(167,139,250,0.3)", letterSpacing: "0.12em", marginBottom: "12px" }}>
                // react context state — all subscribed components re-rendered
              </p>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", lineHeight: "1.9" }}>
                <span style={{ color: "rgba(255,255,255,0.15)" }}>{"{"}</span><br />
                &nbsp;&nbsp;<span style={{ color: "rgba(167,139,250,0.65)" }}>user</span>
                <span style={{ color: "rgba(255,255,255,0.15)" }}>: </span>
                <span style={{ color: "rgba(255,255,255,0.15)" }}>{"{"}</span><br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "rgba(97,218,251,0.6)" }}>username</span>
                <span style={{ color: "rgba(255,255,255,0.15)" }}>: </span>
                <span style={{ color: "rgba(247,223,30,0.6)" }}>"{username}"</span>
                <span style={{ color: "rgba(255,255,255,0.15)" }}>,</span><br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: "rgba(97,218,251,0.6)" }}>isAuthenticated</span>
                <span style={{ color: "rgba(255,255,255,0.15)" }}>: </span>
                <span style={{ color: "rgba(52,211,153,0.65)" }}>true</span><br />
                &nbsp;&nbsp;<span style={{ color: "rgba(255,255,255,0.15)" }}>{"}"}</span><br />
                <span style={{ color: "rgba(255,255,255,0.15)" }}>{"}"}</span>
              </div>
            </div>

            {/* CTA */}
            <div style={{
              display: "flex", gap: "12px", justifyContent: "center",
              animation: "fadeUp 0.6s 0.38s ease both",
            }}>
              <button
                className="badge-btn"
                onClick={() => navigate("/game")}
                style={{
                  padding: "12px 22px", fontSize: "12px", fontWeight: "600",
                  fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em",
                  color: "#0c1120", background: "linear-gradient(135deg, rgba(97,218,251,0.75), rgba(58,184,216,0.75))",
                  border: "none", borderRadius: "6px", cursor: "pointer",
                  boxShadow: "0 4px 18px rgba(97,218,251,0.12)",
                }}
              >
                → Enter the Room
              </button>
              <a
                href="https://jwt.io"
                target="_blank"
                rel="noopener noreferrer"
                className="badge-btn"
                style={{
                  padding: "12px 22px", fontSize: "12px", fontWeight: "600",
                  fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em",
                  color: "#61dafb",
                  background: "rgba(97,218,251,0.06)",
                  border: "1px solid rgba(97,218,251,0.2)",
                  borderRadius: "6px", cursor: "pointer", textDecoration: "none",
                  display: "inline-flex", alignItems: "center", gap: "6px",
                }}
              >
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