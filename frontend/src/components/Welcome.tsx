
export default function WelcomeBanner() {
  const username = "Guest";

  return (
    <div style={{ padding: "18px 20px", background: "rgba(97,218,251,0.04)", border: "1px solid rgba(97,218,251,0.12)", borderRadius: "12px" }}>
      <p style={{ fontSize: "9px", letterSpacing: "0.14em", color: "rgba(97,218,251,0.3)", marginBottom: "8px" }}>// WelcomeBanner.jsx</p>
      <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#e2e8f0", margin: 0 }}>
        👋 שלום, <span style={{ color: "rgba(97,218,251,0.85)" }}>{username}</span>!
      </h2>
      <p style={{ fontSize: "11px", color: "rgba(148,165,185,0.35)", margin: "4px 0 0 0" }}>navbar / header component</p>
    </div>
  );
}