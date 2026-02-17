import { Outlet, NavLink, useNavigate } from "react-router-dom";
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
          <span className="layout-logo">🔐 EscapeApp</span>
          <div className="layout-links">
            <NavLink
              to="/escape-room"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Escape Room
            </NavLink>
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