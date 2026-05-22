import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../state/AuthContext.jsx";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="topbar">
      <NavLink to="/" className="brand">
        My Blog
      </NavLink>

      <nav className="nav">
        <NavLink to="/">Home</NavLink>
        {user?.role === "AUTHOR" || user?.role === "ADMIN" ? <NavLink to="/dashboard">Dashboard</NavLink> : null}
        {user ? (
          <>
            <span className="user-pill">{user.firstName} · {user.role}</span>
            <button className="ghost-button" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register" className="button-link">Create Account</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
