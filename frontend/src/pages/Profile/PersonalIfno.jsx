import "./Profile.css";
import QRCode from "qrcode";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Alert from "@mui/material/Alert";
import { useState } from "react";
import {
  getMyInfo,
  searchUsers,
  transferPointsToUser,
} from "../../apis/UsersApi";
import { useUser } from "../../contexts/UserContext";
import { useEffect } from "react";
function PersonalIfno() {
  const { user, interfaceType, updateInterfaceType, updateUser } = useUser();

  // Transfer State
  const [recipients, setRecipients] = useState([]);
  const [points, setPoints] = useState(0);
  const [selectedUser, setSelectedUser] = useState("");
  const [qrData, setQrData] = useState(null);
  const [transferError, setTransferError] = useState(null);
  const [transferSuccess, setTransferSuccess] = useState(false);

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

  // Create qr code
  useEffect(() => {
    if (user?.utorid) {
      QRCode.toDataURL(user.utorid, {
        errorCorrectionLevel: "H",
        width: 128,
        height: 128,
      }).then(setQrData);
    }
  }, [user?.utorid]);

  // Format date
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
          {recipients.map((recip) => {
            if (recip.utorid !== user.utorid) {
              return (
                <MenuItem key={recip.utorid} value={String(recip.id)}>
                  {recip.utorid}
                </MenuItem>
              );
            }
          })}
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
  return (
    <div className="profile-container">
      <div className="info-container">
        <h2>My Profile</h2>
        <p>Full name: {user.name}</p>
        <p>Utorid: {user.utorid}</p>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
        <p>Last login: {formatDate(user.lastLogin)}</p>
        <p>Birthday: {user.birthday || "Not disclosed"}</p>
        <p>Interface: </p>
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
            Your have successfully transfered {points} points
          </Alert>
        )}
      </div>
      <div className="qrcode">
        <img src={qrData} />
      </div>
    </div>
  );
}
export default PersonalIfno;
