export default function ProfileCard() {
  const username = "ReactStudent";

  return (
    <div style={{ padding: "18px 20px", background: "rgba(247,223,30,0.03)", border: "1px solid rgba(247,223,30,0.1)", borderRadius: "12px" }}>
      <p style={{ fontSize: "9px", letterSpacing: "0.14em", color: "rgba(247,223,30,0.3)", marginBottom: "8px" }}>// ProfileCard.jsx</p>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "rgba(247,223,30,0.08)", border: "1px solid rgba(247,223,30,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>👤</div>
        <div>
          <p style={{ fontSize: "11px", color: "rgba(148,165,185,0.4)", margin: "0 0 2px 0" }}>פרופיל:</p>
          <p style={{ fontSize: "15px", fontWeight: "700", color: "rgba(247,223,30,0.8)", margin: 0 }}>{username}</p>
        </div>
      </div>
    </div>
  );
}