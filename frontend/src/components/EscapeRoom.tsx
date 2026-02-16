import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import LoginForm from "./LoginForm";

const EscapeRoom = () => {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ padding: "20px" }}>
      {!user && <LoginForm onLoginSuccess={() => {}} />}
      {user && (
        <div>
          <h2>ברוכה הבאה, {user.username}! 🎉</h2>
        </div>
      )}
    </div>
  );
};

export default EscapeRoom;