export default function WelcomeBanner() {
  const username = "Guest";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "בוקר טוב" : hour < 17 ? "צהריים טובים" : "ערב טוב";
  const greetingIcon = hour < 12 ? "🌅" : hour < 17 ? "☀️" : "🌙";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');

        @keyframes wb-fadeUp   { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes wb-shimmer  { 0%{ background-position:200% center; } 100%{ background-position:-200% center; } }
        @keyframes wb-pulse    { 0%,100%{ opacity:0.4; transform:scale(1); } 50%{ opacity:1; transform:scale(1.15); } }
        @keyframes wb-orbit    { from{ transform:rotate(0deg) translateX(22px) rotate(0deg); } to{ transform:rotate(360deg) translateX(22px) rotate(-360deg); } }
        @keyframes wb-scan     { from{ top:0%; } to{ top:100%; } }
        @keyframes wb-blink    { 0%,100%{ opacity:1; } 50%{ opacity:0; } }
        @keyframes wb-glow     { 0%,100%{ box-shadow: 0 0 0 0 rgba(97,218,251,0); } 50%{ box-shadow: 0 0 18px 3px rgba(97,218,251,0.12); } }

        .wb-wrap {
          position: relative;
          padding: 22px 26px;
          background: rgba(12,17,32,0.85);
          border: 1px solid rgba(97,218,251,0.13);
          border-radius: 14px;
          overflow: hidden;
          font-family: 'JetBrains Mono', monospace;
          direction: rtl;
          animation: wb-fadeUp 0.5s ease both, wb-glow 4s ease-in-out infinite;
          backdrop-filter: blur(8px);
        }

        /* Top gradient line */
        .wb-wrap::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(97,218,251,0.5), rgba(167,139,250,0.3), transparent);
        }

        /* Scanline */
        .wb-scan {
          position: absolute;
          left: 0; right: 0;
          height: 40px;
          background: linear-gradient(180deg, transparent, rgba(97,218,251,0.025), transparent);
          pointer-events: none;
          animation: wb-scan 6s linear infinite;
        }

        /* Corner decoration */
        .wb-corner {
          position: absolute;
          bottom: 14px; left: 20px;
          width: 18px; height: 18px;
          border-bottom: 1px solid rgba(97,218,251,0.2);
          border-left: 1px solid rgba(97,218,251,0.2);
          border-radius: 0 0 0 3px;
        }
        .wb-corner-tr {
          position: absolute;
          top: 14px; right: 20px;
          width: 18px; height: 18px;
          border-top: 1px solid rgba(97,218,251,0.15);
          border-right: 1px solid rgba(97,218,251,0.15);
          border-radius: 0 3px 0 0;
        }

        .wb-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          position: relative;
          z-index: 1;
        }

        .wb-left { display: flex; align-items: center; gap: 16px; }

        /* Avatar orb */
        .wb-avatar {
          position: relative;
          width: 52px; height: 52px;
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .wb-avatar-ring {
          position: absolute; inset: 0;
          border-radius: 50%;
          border: 1px solid rgba(97,218,251,0.25);
          animation: wb-pulse 3s ease-in-out infinite;
        }
        .wb-avatar-ring2 {
          position: absolute; inset: 6px;
          border-radius: 50%;
          border: 1px dashed rgba(167,139,250,0.15);
        }
        .wb-avatar-dot {
          position: absolute;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(97,218,251,0.9);
          box-shadow: 0 0 8px rgba(97,218,251,0.8);
          animation: wb-orbit 4s linear infinite;
        }
        .wb-avatar-inner {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(97,218,251,0.12), rgba(14,20,36,0.9));
          border: 1px solid rgba(97,218,251,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          z-index: 1;
        }

        /* Text block */
        .wb-tag {
          font-size: 9px;
          letter-spacing: 0.14em;
          color: rgba(97,218,251,0.3);
          margin-bottom: 4px;
        }
        .wb-greeting {
          font-size: 11px;
          color: rgba(148,165,185,0.4);
          margin-bottom: 2px;
          letter-spacing: 0.04em;
        }
        .wb-name {
          font-size: 20px;
          font-weight: 700;
          color: #e2e8f0;
          line-height: 1.1;
          letter-spacing: -0.01em;
        }
        .wb-name span {
          background: linear-gradient(90deg, rgba(97,218,251,1), rgba(167,139,250,0.9), rgba(97,218,251,1));
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: wb-shimmer 3s linear infinite;
        }

        /* Right side stats */
        .wb-stats {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
        }
        .wb-badge {
          display: flex; align-items: center; gap: 5px;
          font-size: 9px; letter-spacing: 0.1em;
          padding: 3px 9px;
          border-radius: 20px;
          border: 1px solid rgba(52,211,153,0.2);
          background: rgba(52,211,153,0.06);
          color: rgba(52,211,153,0.75);
        }
        .wb-badge-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: rgba(52,211,153,0.8);
          box-shadow: 0 0 6px rgba(52,211,153,0.6);
          animation: wb-blink 2s ease-in-out infinite;
        }
        .wb-role {
          font-size: 9px;
          color: rgba(148,165,185,0.25);
          letter-spacing: 0.08em;
        }

        /* Bottom divider + meta row */
        .wb-footer {
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.04);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative; z-index: 1;
        }
        .wb-meta {
          font-size: 9px;
          color: rgba(148,165,185,0.2);
          letter-spacing: 0.1em;
        }
        .wb-meta-accent { color: rgba(97,218,251,0.35); }
        .wb-cursor {
          display: inline-block;
          animation: wb-blink 1.1s ease-in-out infinite;
          color: rgba(97,218,251,0.5);
        }
        .wb-code {
          font-size: 9px;
          color: rgba(180,160,100,0.35);
          background: rgba(180,160,100,0.04);
          border: 1px solid rgba(180,160,100,0.08);
          border-radius: 3px;
          padding: 2px 7px;
          letter-spacing: 0.06em;
        }
      `}</style>

      <div className="wb-wrap">
        {/* Decorative elements */}
        <div className="wb-scan" />
        <div className="wb-corner" />
        <div className="wb-corner-tr" />

        {/* Main row */}
        <div className="wb-row">
          {/* Left: avatar + name */}
          <div className="wb-left">
            <div className="wb-avatar">
              <div className="wb-avatar-ring" />
              <div className="wb-avatar-ring2" />
              <div className="wb-avatar-dot" />
              <div className="wb-avatar-inner">{greetingIcon}</div>
            </div>

            <div>
              <div className="wb-tag">// WelcomeBanner.jsx</div>
              <div className="wb-greeting">{greeting},</div>
              <div className="wb-name">
                👋 <span>{username}</span>
              </div>
            </div>
          </div>

          {/* Right: status badge */}
          <div className="wb-stats">
            <div className="wb-badge">
              <div className="wb-badge-dot" />
              LOGGED IN
            </div>
            <div className="wb-role">role: user</div>
          </div>
        </div>

        {/* Footer meta */}
        <div className="wb-footer">
          <div className="wb-meta">
            <span className="wb-meta-accent">useContext</span>(AuthContext) →{" "}
            <span className="wb-meta-accent">user.username</span>
            <span className="wb-cursor"> _</span>
          </div>
          <div className="wb-code">navbar / header</div>
        </div>
      </div>
    </>
  );
}