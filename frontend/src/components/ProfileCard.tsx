export default function ProfileCard() {
  const username = "ReactStudent";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');

        @keyframes pc-fadeUp  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pc-shimmer { 0%{ background-position:200% center; } 100%{ background-position:-200% center; } }
        @keyframes pc-spin    { to { transform:rotate(360deg); } }
        @keyframes pc-orbit   { from{ transform:rotate(0deg) translateX(20px) rotate(0deg); } to{ transform:rotate(360deg) translateX(20px) rotate(-360deg); } }
        @keyframes pc-pulse   { 0%,100%{ opacity:0.35; transform:scale(1); } 50%{ opacity:0.9; transform:scale(1.2); } }
        @keyframes pc-blink   { 0%,100%{ opacity:1; } 50%{ opacity:0; } }
        @keyframes pc-scan    { from{ top:0%; } to{ top:100%; } }
        @keyframes pc-glow    { 0%,100%{ box-shadow:0 0 0 0 rgba(247,223,30,0); } 50%{ box-shadow:0 0 20px 3px rgba(247,223,30,0.07); } }
        @keyframes pc-bar     { from{ width:0%; } to{ width:72%; } }

        .pc-wrap {
          position: relative;
          padding: 22px 26px;
          background: rgba(14,12,6,0.85);
          border: 1px solid rgba(247,223,30,0.13);
          border-radius: 14px;
          overflow: hidden;
          font-family: 'JetBrains Mono', monospace;
          direction: rtl;
          animation: pc-fadeUp 0.5s ease both, pc-glow 4s ease-in-out infinite;
          backdrop-filter: blur(8px);
        }

        .pc-wrap::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(247,223,30,0.5), rgba(205,120,80,0.3), transparent);
        }

        .pc-scan {
          position: absolute;
          left: 0; right: 0; height: 40px;
          background: linear-gradient(180deg, transparent, rgba(247,223,30,0.02), transparent);
          pointer-events: none;
          animation: pc-scan 7s linear infinite;
        }

        .pc-corner-bl {
          position: absolute; bottom: 14px; left: 20px;
          width: 16px; height: 16px;
          border-bottom: 1px solid rgba(247,223,30,0.18);
          border-left: 1px solid rgba(247,223,30,0.18);
          border-radius: 0 0 0 3px;
        }
        .pc-corner-tr {
          position: absolute; top: 14px; right: 20px;
          width: 16px; height: 16px;
          border-top: 1px solid rgba(247,223,30,0.12);
          border-right: 1px solid rgba(247,223,30,0.12);
          border-radius: 0 3px 0 0;
        }

        .pc-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          position: relative; z-index: 1;
        }

        .pc-left { display: flex; align-items: center; gap: 16px; }

        /* Avatar */
        .pc-avatar {
          position: relative;
          width: 52px; height: 52px;
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .pc-ring1 {
          position: absolute; inset: 0; border-radius: 50%;
          border: 1px solid rgba(247,223,30,0.25);
          animation: pc-pulse 3.5s ease-in-out infinite;
        }
        .pc-ring2 {
          position: absolute; inset: 7px; border-radius: 50%;
          border: 1px dashed rgba(205,120,80,0.15);
          animation: pc-spin 20s linear infinite reverse;
        }
        .pc-dot {
          position: absolute;
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(247,223,30,0.9);
          box-shadow: 0 0 8px rgba(247,223,30,0.7);
          animation: pc-orbit 5s linear infinite;
        }
        .pc-inner {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(247,223,30,0.14), rgba(14,12,6,0.95));
          border: 1px solid rgba(247,223,30,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; z-index: 1;
        }

        /* Text */
        .pc-tag {
          font-size: 9px; letter-spacing: 0.14em;
          color: rgba(247,223,30,0.3); margin-bottom: 3px;
        }
        .pc-label {
          font-size: 10px; color: rgba(148,165,185,0.35);
          margin-bottom: 2px; letter-spacing: 0.04em;
        }
        .pc-name {
          font-size: 20px; font-weight: 700;
          color: #fef3c7; line-height: 1.1; letter-spacing: -0.01em;
        }
        .pc-name span {
          background: linear-gradient(90deg, rgba(247,223,30,1), rgba(205,150,80,0.9), rgba(247,223,30,1));
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: pc-shimmer 3s linear infinite;
        }

        /* Right badges */
        .pc-right {
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 6px;
        }
        .pc-badge {
          display: flex; align-items: center; gap: 5px;
          font-size: 9px; letter-spacing: 0.1em;
          padding: 3px 9px; border-radius: 20px;
          border: 1px solid rgba(247,223,30,0.2);
          background: rgba(247,223,30,0.06);
          color: rgba(247,223,30,0.7);
        }
        .pc-badge-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(247,223,30,0.85);
          box-shadow: 0 0 6px rgba(247,223,30,0.6);
          animation: pc-blink 2.2s ease-in-out infinite;
        }
        .pc-level {
          font-size: 9px;
          color: rgba(148,165,185,0.22);
          letter-spacing: 0.08em;
        }

        /* Footer */
        .pc-footer {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.04);
        }
        .pc-meta {
          font-size: 9px; letter-spacing: 0.1em;
          color: rgba(148,165,185,0.2);
        }
        .pc-meta-acc { color: rgba(247,223,30,0.35); }
        .pc-cursor {
          display: inline-block;
          animation: pc-blink 1.1s ease-in-out infinite;
          color: rgba(247,223,30,0.5);
        }
        .pc-code {
          font-size: 9px;
          color: rgba(97,218,251,0.3);
          background: rgba(97,218,251,0.04);
          border: 1px solid rgba(97,218,251,0.08);
          border-radius: 3px;
          padding: 2px 7px;
          letter-spacing: 0.06em;
        }
      `}</style>

      <div className="pc-wrap">
        <div className="pc-scan" />
        <div className="pc-corner-bl" />
        <div className="pc-corner-tr" />

        {/* Main row */}
        <div className="pc-row">
          <div className="pc-left">
            {/* Avatar */}
            <div className="pc-avatar">
              <div className="pc-ring1" />
              <div className="pc-ring2" />
              <div className="pc-dot" />
              <div className="pc-inner">👤</div>
            </div>

            {/* Name block */}
            <div>
              <div className="pc-tag">// ProfileCard.jsx</div>
              <div className="pc-label">פרופיל:</div>
              <div className="pc-name"><span>{username}</span></div>
            </div>
          </div>

          {/* Right */}
          <div className="pc-right">
            <div className="pc-badge">
              <div className="pc-badge-dot" />
              STUDENT
            </div>
            <div className="pc-level">level: junior</div>
          </div>
        </div>

        {/* Footer */}
        <div className="pc-footer">
          <div className="pc-meta">
            <span className="pc-meta-acc">user</span>.username →{" "}
            <span className="pc-meta-acc">"{username}"</span>
            <span className="pc-cursor"> _</span>
          </div>
          <div className="pc-code">profile component</div>
        </div>
      </div>
    </>
  );
}