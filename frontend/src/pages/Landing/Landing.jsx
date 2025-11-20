import "../../styles/auth.css";
import "./Landing.css";
import { NavLink } from "react-router-dom";

function Landing() {
  return (
    <>
      <div className="auth-container">
        <h2>Welcome to Reedma</h2>
        <div className="landing-container">
          <NavLink to="/login" className="fill-button">
            log in
          </NavLink>
          <NavLink to="/register" className="outline-button">
            create account
          </NavLink>
        </div>
      </div>
    </>
  );
}

export default Landing;
