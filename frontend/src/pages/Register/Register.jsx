import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import "../../styles/auth.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handle_submit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setSuccess(false);
      return;
    }
    try {
      // registerSelf(); // register no auth token needed
      setSuccess(true);
      setError("");
      setTimeout(() => {
        setSuccess(false);
        navigate("/login");
      }, 1000);
    } catch (error) {
      setError(error.message);
      setSuccess(false);
    }
  };

  return (
    <>
      <div className="auth-container">
        <h2>Create an account</h2>
        <form onSubmit={handle_submit} className=".content-container">
          <div className="form-field">
            <label>Full name</label>
            <TextField
              id="outlined-basic"
              variant="outlined"
              className="input"
              placeholder="John Doe"
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>University email</label>
            <TextField
              id="outlined-basic"
              type="email"
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
              id="outlined-basic"
              variant="outlined"
              className="input"
              type="password"
              placeholder="Pasword"
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Confirm password</label>
            <TextField
              id="outlined-basic"
              variant="outlined"
              className="input"
              type="password"
              placeholder="Confirm pasword"
              size="small"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {!error ? null : <Alert severity="error">{error}</Alert>}
          {!success ? null : (
            <Alert severity="success">
              Email sent! Redirecting to login page ...{" "}
            </Alert>
          )}

          <div className="btn-container">
            <button type="submit" className="fill-button">
              create account
            </button>
          </div>
        </form>
        <div className="horizontal-break" />
        <p>
          Already have an account?{" "}
          <Link to="/login" className="link">
            Login here
          </Link>
        </p>
      </div>
    </>
  );
}

export default Register;
