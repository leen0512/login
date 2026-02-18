import { createContext, useState, useEffect } from "react";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) { setLoading(false); return; }

    fetch("http://localhost:8000/users/protected", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error();
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ username: payload.username, email: payload.email, role: payload.role });
      })
      .catch(() => localStorage.removeItem("accessToken"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    try {
      const res = await fetch("http://localhost:8000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

    if (!res.ok) {
      const err = await res.json();
      alert(err.detail || "Login failed");
      return false;
    }

      const data = await res.json();
      setUser({ username: data.username, email: data.email, role: data.role });
      localStorage.setItem("accessToken", data.access_token);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("station2Done");
    setUser(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};