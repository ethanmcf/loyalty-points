import "./Profile.css";
import { NavLink } from "react-router-dom";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Alert from "@mui/material/Alert";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import {
  changeMyPassword,
  getMyInfo,
  searchUsers,
  transferPointsToUser,
  updateMyInfo,
} from "../../apis/UsersApi";
import { useUser } from "../../contexts/UserContext";
import { useEffect } from "react";

function Profile() {
  const { user, interfaceType, updateInterfaceType, updateUser } = useUser();
  // Transfer State
  const [recipients, setRecipients] = useState([]);
  const [points, setPoints] = useState(0);
  const [selectedUser, setSelectedUser] = useState("");
  const [transferError, setTransferError] = useState(null);
  const [transferSuccess, setTransferSuccess] = useState(false);

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

  // Update personal info
  const nullIfEmpty = (value) => (value === "" ? null : value);
  const updatePersonalInfo = async () => {
    const token = localStorage.getItem("token");
    const updateData = {
      email: nullIfEmpty(updatedEmail),
      name: nullIfEmpty(updatedName),
      birthday: nullIfEmpty(updatedBirthday),
      avatar: nullIfEmpty(updatedAvatar),
    };
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

  // Send points
  const sendPoints = async () => {
    setTransferError("");
    setTransferSuccess(false);
    if (!selectedUser || points <= 0) {
      setTransferError("User/points are not valid");
      return;
    }
    try {
      await transferPointsToUser(
        localStorage.getItem("token"),
        selectedUser,
        points,
        `Transfer points to ${selectedUser}`
      );
      const userData = await getMyInfo(localStorage.getItem("token"));
      updateUser(userData);

      setTransferSuccess(true);
      setTimeout(() => {
        setTransferSuccess(false);
        setPoints(0);
        setSelectedUser("");
      }, 2500);
    } catch (error) {
      setTransferSuccess(false);
      setTransferError(error.message);
    }
  };
  // Helper to format date
  const formatDate = (dateString) => {
    const newDate = new Date(dateString);
    return newDate.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Fetch users to send points to
  useEffect(() => {
    const fetchusers = async () => {
      try {
        const data = await searchUsers(localStorage.getItem("token"));
        setRecipients(data.results);
      } catch (error) {
        setRecipients([]);
      }
    };
    fetchusers();
  }, []);

  // Component for picking recipeient
  const RecipientPicker = () => {
    return (
      <FormControl size="small">
        <InputLabel id="demo-simple-select-helper-label">Recipient</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={selectedUser}
          label="Recipient"
          onChange={(e) => setSelectedUser(e.target.value)}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 180,
              },
            },
          }}
        >
          {recipients.map((recip) => (
            <MenuItem key={recip.utorid} value={String(recip.id)}>
              {recip.utorid}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  // Component for picking interface type
  const InterfacePicker = () => {
    let usersTypes = [user.role];
    if (user.role == "manager") {
      usersTypes = ["regular", "manager"];
    } else if (user.role == "superuser") {
      usersTypes = ["regular", "cashier", "manager", "superuser"];
    }

    return (
      <FormControl sx={{ width: "100%" }} size="small">
        <InputLabel id="demo-simple-select-helper-label">Role Type</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={interfaceType}
          label="Interface"
          onChange={(e) => updateInterfaceType(e.target.value)}
        >
          {usersTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

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
    <>
      <div className="profile-container">
        <div className="info-container">
          <h2>My Profile</h2>
          <p>Full name: {user.name}</p>
          <p>Utorid: {user.utorid}</p>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <p>Last login: {formatDate(user.lastLogin)}</p>
          <p>Birthday: {user.birthday || "Not disclosed"}</p>
          <InterfacePicker />
        </div>
        <div className="points-container">
          <p>Your points: {user.points}</p>
          Transfer points to user
          <TextField
            className="transfer-points"
            size="small"
            type="number"
            label="Points"
            placeholder="ie 15"
            value={points}
            onChange={(e) => {
              setPoints(e.target.value);
            }}
          />
          <RecipientPicker />
          <button className="fill-button" onClick={() => sendPoints()}>
            Send points
          </button>
          {!transferError ? null : (
            <Alert severity="error">{transferError}</Alert>
          )}
          {!transferSuccess ? null : (
            <Alert severity="success">
              Your have successful transfered {points} points to {selectedUser}
            </Alert>
          )}
        </div>
      </div>
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
    </>
  );
}

export default Profile;
