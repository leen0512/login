import { Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import "./Layout.css";

export default function Layout() {
  const { logout } = useContext(AuthContext) as any;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="layout">
      <header className="layout-header">
        <nav className="layout-nav">
          <span className="layout-logo">Welcome 🧚🏻‍♀️</span>
          <div className="layout-links">
            <button className="nav-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>
      </header>

      <main className="layout-main">
        {/* Child route components render here */}
        <Outlet />
      </main>
    </div>
  );
}