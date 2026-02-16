/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const LoginForm = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const { login } = useContext(AuthContext) as any;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await login(email, password);
    onLoginSuccess();
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginForm;
