import { BrowserRouter, Routes, Link, Route, NavLink } from "react-router-dom";
import { Dashboard } from "../../pages/Dashboard/Dashboard";
import "./NavBar.css";

export function Navbar() {
  return (
    <BrowserRouter>
      <header>
        <nav className="nav-bar">
          <Link className="logo" to="/">
            <b>Redeema</b>
          </Link>
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
              <div className="avatar"></div>
            </NavLink>
          </div>
        </nav>
      </header>

      <main className="main-page">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<div>Users</div>} />
          <Route path="/events" element={<div>Events</div>} />
          <Route path="/login" element={<div>Login</div>} />
          <Route path="/transactions" element={<div>Transactions</div>} />
          <Route path="/promotions" element={<div>Promotions</div>} />
          <Route path="/profile" element={<div>Profile</div>} />
          <Route
            path="/events/:eventId"
            element={<div>Event Details Page</div>}
          />
          <Route
            path="/transactions/:transactionId"
            element={<div>Transactions Details Page</div>}
          />
          <Route
            path="/promotions/:promotionId"
            element={<div>Promotions Details Page</div>}
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
