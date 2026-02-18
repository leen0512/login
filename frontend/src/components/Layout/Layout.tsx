import { Outlet, useNavigate, NavLink } from "react-router-dom";
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
    <div>
      <header className="layout-header">
        <nav className="layout-nav">
          <span className="layout-logo">Escape Room</span>

          <div className="layout-links">
            <NavLink to="/dashboard" className="nav-link">
              Dashboard
            </NavLink>

            <NavLink to="/welcome" className="nav-link">
              Welcome
            </NavLink>

            <NavLink to="/profile" className="nav-link">
              Profile
            </NavLink>

            <NavLink to="/vault" className="nav-link">
              Vault
            </NavLink>

            <button className="nav-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>
      </header>

      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}