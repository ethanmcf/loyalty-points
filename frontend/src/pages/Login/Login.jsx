import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { useUser } from "../../contexts/UserContext";
import "../../styles/auth.css";

function Login() {
  const navigate = useNavigate();
  const { login, completeLogin } = useUser();
  const [utorid, setUtorid] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handle_submit = async (e) => {
    e.preventDefault();
    try {
      const loggedInuser = await login(utorid, password);
      setSuccess(true);
      setError("");
      setTimeout(() => {
        setSuccess(false);
        completeLogin(loggedInuser);
        navigate("/profile");
      }, 2500);
    } catch (error) {
      setError(error.message);
      setSuccess(false);
    }
  };

  return (
    <div>
      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handle_submit}>
          <div className="form-field">
            <label>Utorid</label>
            <TextField
              variant="outlined"
              className="input"
              placeholder="doejohn1"
              size="small"
              value={utorid}
              onChange={(e) => setUtorid(e.target.value)}
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

          {!success ? null : (
            <Alert severity="success">
              Login successful! Redirecting to profile page ...{" "}
            </Alert>
          )}

          <div className="btn-container">
            <button type="submit" className="fill-button" disabled={success}>
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
        <p>
          Forgot password?{" "}
          <Link to="/reset" className="link">
            Click to reset
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
