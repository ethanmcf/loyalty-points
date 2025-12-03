import "./Profile.css";
import { NavLink } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import { changeMyPassword, getMyInfo, updateMyInfo } from "../../apis/UsersApi";
import { useUser } from "../../contexts/UserContext";

function UpdateInfo() {
  const { user, updateUser } = useUser();
  // Personal info state
  const [updatedName, setUpdatedNmae] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedBirthday, setUpdatedBirthday] = useState("");
  const [updatedAvatar, setUpdatedAvatar] = useState("");
  const [personalError, setPersonalError] = useState(null);
  const [personalSuccess, setPersonalSuccess] = useState(false);

  // Password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);

  // Helper
  const nullIfEmpty = (value) => (value === "" ? null : value);

  // Update personal info
  const updatePersonalInfo = async () => {
    const token = localStorage.getItem("token");
    const updateData = new FormData();
    if (updatedName) updateData.append("name", updatedName);
    if (updatedEmail) updateData.append("email", updatedEmail);
    if (updatedBirthday) updateData.append("birthday", updatedBirthday);
    if (updatedAvatar instanceof File)
      updateData.append("avatar", updatedAvatar);
    try {
      await updateMyInfo(token, updateData);
      const userData = await getMyInfo(localStorage.getItem("token"));
      updateUser(userData);
      setPersonalError(null);
      setPersonalSuccess(true);
      setTimeout(() => {
        setPersonalSuccess(false);
        setUpdatedAvatar("");
        setUpdatedBirthday("");
        setUpdatedNmae("");
        setUpdatedEmail("");
      }, 2500);
    } catch (error) {
      setPersonalError(error.message);
      setPersonalSuccess(false);
    }
  };

  // Update password
  const updatePassword = async () => {
    try {
      await changeMyPassword(
        localStorage.getItem("token"),
        oldPassword,
        newPassword
      );
      setPasswordError(null);
      setPasswordSuccess("Successfully updated password!");
      setTimeout(() => {
        setPasswordSuccess(null);
        setOldPassword("");
        setNewPassword("");
      }, 2500);
    } catch (error) {
      setPasswordError(error.message);
    }
  };

  // Datepicker component
  const BirthdayPicker = () => {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Birthday"
          value={updatedBirthday ? dayjs(updatedBirthday) : null}
          slotProps={{ textField: { size: "small" } }}
          format="YYYY-MM-DD"
          onChange={(newDate) => {
            if (newDate) {
              setUpdatedBirthday(newDate.format("YYYY-MM-DD"));
            } else {
              setUpdatedBirthday(null);
            }
          }}
        />
      </LocalizationProvider>
    );
  };
  return (
    <div className="content-container">
      <div className="update-container">
        <h2>Update my info</h2>
        <p>Personal</p>
        <TextField
          id="name"
          variant="outlined"
          className="input"
          label="Updated name"
          placeholder="John doez"
          size="small"
          value={updatedName}
          onChange={(e) => setUpdatedNmae(e.target.value)}
        />
        <TextField
          id="email"
          variant="outlined"
          className="input"
          label="Updated email"
          type="email"
          placeholder="john.doe@mail.utoronto.ca"
          size="small"
          value={updatedEmail}
          onChange={(e) => setUpdatedEmail(e.target.value)}
        />
        <BirthdayPicker />
        <label style={{ maxWidth: "200px" }} className="outline-button">
          {updatedAvatar ? "File attached" : "Upload avatar"}
          <input
            type="file"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setUpdatedAvatar(file);
              }
            }}
          />
        </label>

        {!personalError ? null : (
          <Alert severity="error">{personalError}</Alert>
        )}

        {!personalSuccess ? null : (
          <Alert severity="success">Successful updated your info!</Alert>
        )}
        <button className="fill-button" onClick={() => updatePersonalInfo()}>
          Update personal info
        </button>
        <p>Password & reset</p>
        <TextField
          id="old"
          variant="outlined"
          className="input"
          label="Old password"
          type="password"
          placeholder="Old password"
          size="small"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <TextField
          id="new"
          variant="outlined"
          className="input"
          label="New password"
          type="password"
          placeholder="New password"
          size="small"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <NavLink to="/reset">Forgot password - Click to reset</NavLink>
        {!passwordError ? null : (
          <Alert severity="error">{passwordError}</Alert>
        )}

        {!passwordSuccess ? null : (
          <Alert severity="success">{passwordSuccess}</Alert>
        )}
        <button className="fill-button" onClick={() => updatePassword()}>
          Update password
        </button>
      </div>
    </div>
  );
}
export default UpdateInfo;
