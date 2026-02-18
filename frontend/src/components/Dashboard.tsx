export default function Dashboard() {
  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "3rem 1.5rem",
        color: "var(--text-primary)",
        direction: "rtl", 
        textAlign: "right",
      }}
    >
      <p
        style={{
          fontSize: "0.75rem",
          letterSpacing: "0.2em",
          color: "var(--text-muted)",
          marginBottom: "0.8rem",
          textTransform: "uppercase",
        }}
      >
        Station 1 — useContext
      </p>

      <h1
        style={{
          fontSize: "2rem",
          marginBottom: "1rem",
          color: "var(--accent)",
          letterSpacing: "0.05em",
        }}
      >
        🕯 משהו לא תקין כאן
      </h1>

      <p
        style={{
          fontSize: "1rem",
          lineHeight: "1.8",
          color: "var(--text-primary)",
          marginBottom: "2rem",
        }}
      >
        שלוש קומפוננטות — שלושה שמות שונים.
        <br />
        המערכת אמורה להציג <strong>אותו משתמש</strong> בכולן.
        <br />
        עברי בין Welcome, Profile דרך הניווט למעלה.
      </p>

      <div
        style={{
          padding: "1.2rem",
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "4px",
          fontSize: "0.9rem",
          lineHeight: "1.7",
          color: "var(--text-muted)",
        }}
      >
        <strong style={{ color: "var(--accent)" }}>💡 רמז:</strong>
        <br />
        כל קומפוננטה היא קובץ נפרד — ולכולן אותה בעיה.
        <br />
        השתמשי ב-
        <code
          style={{
            background: "rgba(255,255,255,0.05)",
            padding: "2px 6px",
            margin: "0 4px",
            borderRadius: "3px",
            color: "var(--accent)",
          }}
        >
          useContext(AuthContext)
        </code>
        כדי לגשת ל-
        <code
          style={{
            background: "rgba(255,255,255,0.05)",
            padding: "2px 6px",
            margin: "0 4px",
            borderRadius: "3px",
            color: "var(--accent)",
          }}
        >
          user.username
        </code>
      </div>
    </div>
  );
}
