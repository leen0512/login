import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Restore user session on mount
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      // Decode the JWT to get user info (basic client-side only)
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        setUser({
          username: payload.username,
          email: payload.email,
          role: payload.role
        });
      } catch (err) {
        console.error("Failed to restore session:", err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await fetch(
        `http://localhost:8000/users/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const data = await res.json();

      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
      setUser({ 
        username: data.username, 
        email: data.email, 
        role: data.role 
      });

      return true;
    } catch (err) {
      console.error(err);
      alert(err.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};