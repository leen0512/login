import { createContext, useState, useEffect } from "react";

// 1️⃣  Create the context — this is the "box" we share across the whole app
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 2️⃣  user = who is logged in  |  null = nobody
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 3️⃣  On page refresh — check if a token is already saved in localStorage
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      // JWT = header.payload.signature  →  decode the middle part
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({ username: payload.username, email: payload.email, role: payload.role });
    }

    setLoading(false); // done checking — show the app
  }, []);

  // 4️⃣  Login: call the server, save the tokens, update context
  const login = async (username, password) => {
    const res = await fetch(
      `http://localhost:8000/users/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
      { method: "POST" }
    );

    if (!res.ok) {
      const err = await res.json();
      alert(err.detail || "Login failed");
      return false;
    }

    const data = await res.json();

    // Save token so the user stays logged in after refresh
    localStorage.setItem("accessToken", data.access_token);   
    

    // Update context → every component that uses useContext re-renders
    setUser({ username: data.username, email: data.email, role: data.role });
    return true;
  };

  // 5️⃣  Logout: wipe tokens, set user back to null
  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  if (loading) return <div>Loading...</div>;

  // 6️⃣  Provide user, login, logout to the whole app
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};