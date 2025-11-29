import TextField from "@mui/material/TextField";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import "./Reset.css";
import "../../styles/auth.css";
import { resetPassword, createNewResetToken } from "../../apis/AuthApi";
import { sendResetEmail } from "../../apis/utils/sendEmail";

function Reset() {
  // Reset password state
  const [resetUtorid, setResetUtorid] = useState("");
  const [password, setPassword] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(null);

  // Create new auth token reset
  const [tokenUtorid, setTokenUtorid] = useState("");
  const [tokenEmail, setTokenEmail] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [tokenSuccess, setTokenSuccess] = useState(null);

  const handle_submit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(resetUtorid, password, resetToken);
      setResetSuccess("Password successfully reset!");
      setResetError("");
      setTimeout(() => {
        setResetSuccess(null);
        setResetToken("");
        setPassword("");
        setResetToken("");
        setResetUtorid("");
      }, 2500);
    } catch (error) {
      setResetError(error.message);
      setResetSuccess(null);
    }
  };
  const createNewReset = async () => {
    try {
      const { resetToken } = await createNewResetToken(tokenUtorid);
      await sendResetEmail(tokenEmail, resetToken);
      setTokenSuccess("Successfully sent new reset token to your email!");
      setTokenError("");
      setTimeout(() => {
        setTokenSuccess(null);
        setTokenUtorid("");
        setTokenEmail("");
      }, 2500);
    } catch (error) {
      setTokenError(error.message);
      setTokenSuccess(null);
    }
  };

  return (
    <div>
      <div className="auth-container">
        <h2>Reset your password</h2>
        <form onSubmit={handle_submit}>
          <div className="form-field">
            <label>Utorid</label>
            <TextField
              variant="outlined"
              className="input"
              placeholder="ie doejohn1"
              size="small"
              value={resetUtorid}
              onChange={(e) => setResetUtorid(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>New password</label>
            <TextField
              variant="outlined"
              className="input"
              type="password"
              placeholder="Your new password"
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Reset token</label>
            <TextField
              variant="outlined"
              className="input"
              placeholder="ie 0dc61e96-f68a-41..."
              size="small"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
            />
          </div>

          {!resetError ? null : <Alert severity="error">{resetError}</Alert>}

          {!resetSuccess ? null : (
            <Alert severity="success">{resetSuccess} </Alert>
          )}

          <div className="btn-container">
            <button type="submit" className="fill-button">
              reset password
            </button>
          </div>
        </form>
        <div className="horizontal-break" />
        <div className="reset-container">
          <p>Reset token expired? Create new one below</p>
          <label>Utorid</label>
          <TextField
            variant="outlined"
            className="input"
            placeholder="ie doejohn1"
            size="small"
            value={tokenUtorid}
            onChange={(e) => setTokenUtorid(e.target.value)}
          />
          <label>Email to send token to</label>
          <TextField
            variant="outlined"
            className="input"
            placeholder="ie john.doe@mail.utoronto.ca"
            size="small"
            value={tokenEmail}
            onChange={(e) => setTokenEmail(e.target.value)}
          />
          {!tokenError ? null : <Alert severity="error">{tokenError}</Alert>}

          {!tokenSuccess ? null : (
            <Alert severity="success">{tokenSuccess} </Alert>
          )}
          <button className="fill-button" onClick={() => createNewReset()}>
            create new token
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reset;
