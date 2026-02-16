import { useState } from "react";
import LoginForm from "./LoginForm";

const EscapeRoom = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div style={{ padding: "20px" }}>
      {!loggedIn && <LoginForm onLoginSuccess={() => setLoggedIn(true)} />}
      {loggedIn && <h2>ברוכה הבאה! 🎉</h2>}
    </div>
  );
};

export default EscapeRoom;
