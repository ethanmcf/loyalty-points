import TextField from "@mui/material/TextField";
import "../../styles/auth.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { Navbar } from "../../components/navbar/NavBar";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handle_submit = (e) => {
    e.preventDefault();
    setError("Error");
    // login(username, password)
    // .then(message => setError(message));
  };

  return (
    <div>
      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handle_submit}>
          <div className="form-field">
            <label>University email</label>
            <TextField
              type="password"
              variant="outlined"
              className="input"
              placeholder="first.last@mail.utoronto.ca"
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Password</label>
            <TextField
              variant="outlined"
              className="input"
              type="password"
              placeholder="Your pasword"
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!error ? null : <Alert severity="error">{error}</Alert>}

          <div className="btn-container">
            <button type="submit" className="fill-button">
              log in
            </button>
          </div>
        </form>
        <div className="horizontal-break" />
        <p>
          Don't have an account?{" "}
          <Link to="/register" className="link">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
