import { Link, NavLink } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";

import "./NavBar.css";

export function Navbar() {
  const { user, logout } = useUser();

  return (
    <header>
      <nav className="nav-bar">
        <Link className="logo" to="/">
          <b>Redeema</b>
        </Link>
        {user ? (
          <div className="links">
            <NavLink
              to="/"
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/users"
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >
              Users
            </NavLink>
            <NavLink
              to="/events"
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >
              Events
            </NavLink>
            <NavLink
              to="/transactions"
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >
              Transactions
            </NavLink>
            <NavLink
              to="/promotions"
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >
              Promotions
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive, isPending }) =>
                isPending ? "pending" : isActive ? "active" : ""
              }
            >
              Profile
            </NavLink>
            <NavLink to="/" onClick={() => logout()}>
              Logout
            </NavLink>
          </div>
        ) : (
          <div className="links">
            <NavLink to="/login" className="outline-button nav-button">
              log in
            </NavLink>
            <NavLink to="/register" className="fill-button nav-button">
              sign up
            </NavLink>
          </div>
        )}
      </nav>
    </header>
  );
}
