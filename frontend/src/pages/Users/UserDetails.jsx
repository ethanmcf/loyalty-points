import { useNavigate, useParams } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import "../../styles/detailsPage.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getUserById, updateUserById } from "../../apis/UsersApi";
import { DeleteUserDialog } from "../../components/delete-dialogs/DeleteUserDialog";
import { useUser } from "../../contexts/UserContext";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export function UserDetails() {
  const { user } = useUser();
  const { userId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState();
  const [userData, setUserData] = useState();
  const [oldUserData, setOldUserData] = useState();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await getUserById(localStorage.token, Number(userId));
      setUserData(res);
      setOldUserData(res);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSetToEdit = (e) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    // api call
    try {
      const reqBody = {
        email: formJson.name === oldUserData.email ? null : formJson.email,
        verified: formJson.verified === "true",
        role: formJson.role,
      };
      await updateUserById(localStorage.token, userId, reqBody);
      setIsEditing(false);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const NotDisclosedField = ({ fieldName }) => {
    return (
      <TextField
        id={fieldName}
        name={fieldName}
        label={fieldName}
        value={`${fieldName} has not been set`}
        disabled={true}
      />
    );
  };

  return (
    <div className="details-page" id="users-details-page">
      <div className="header">
        <div className="title">
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <h2>User Details Page</h2>
        </div>
        <DeleteUserDialog id={userId} />
      </div>
      {!error ? null : <Alert severity="error">{error}</Alert>}
      {userData && (
        <>
          <div className="general-header">
            <div style={{ display: "flex" }}>
              <img
                src={
                  userData.avatarUrl
                    ? `${import.meta.env.VITE_BACKEND_URL}/${
                        userData.avatarUrl
                      }`
                    : "/default-avatar.png"
                }
                style={{
                  widht: 30,
                  height: 30,
                  alignSelf: "center",
                  marginRight: "1rem",
                }}
              ></img>
              <h3>{userData.name}'s General Data</h3>
            </div>

            {isEditing ? (
              <Button type="submit" form="info-form">
                Save
              </Button>
            ) : (
              <Button type="button" form="" onClick={handleSetToEdit}>
                Edit
              </Button>
            )}
          </div>
          {/* All accessible fields */}
          <form id="info-form" onSubmit={handleSubmit}>
            <TextField
              id="name"
              name="name"
              label="User Name"
              value={userData.name}
              disabled={true}
            />
            <TextField
              id="utorid"
              name="utorid"
              label="Utorid"
              value={userData.utorid}
              disabled={true}
            />
            <TextField
              id="points"
              name="points"
              label="Points"
              value={userData.points}
              disabled={true}
            />
            <FormControl fullWidth>
              <InputLabel id="verified">Verified</InputLabel>
              <Select
                name="verified"
                id="verified"
                value={userData.verified}
                disabled={!isEditing}
                label="Verified"
                onChange={(e) =>
                  setUserData({ ...userData, verified: e.target.value })
                }
              >
                <MenuItem value={true}>True</MenuItem>
                <MenuItem value={false}>False</MenuItem>
              </Select>
            </FormControl>
            {/* Not accessible for cashiers */}
            {user.role === "regular" || user.role === "cashier" ? null : (
              <>
                <FormControl fullWidth>
                  <InputLabel id="role">Role</InputLabel>
                  <Select
                    name="role"
                    id="role"
                    value={userData.role}
                    disabled={!isEditing}
                    label="Role"
                    onChange={(e) =>
                      setUserData({ ...userData, role: e.target.value })
                    }
                  >
                    <MenuItem value={"regular"}>Regular</MenuItem>
                    <MenuItem value={"cashier"}>Cashier</MenuItem>
                    <MenuItem value={"manager"}>Manager</MenuItem>
                    <MenuItem value={"superuser"}>Superuser</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  id="email"
                  name="email"
                  label="Email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  disabled={!isEditing}
                />
                {!userData.birthday ? (
                  <NotDisclosedField fieldName="Birthday" />
                ) : (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DateTimePicker"]}>
                      <DateTimePicker
                        disabled={true}
                        name="birthday"
                        label="Birthday"
                        format="YYYY-MM-DD"
                        value={dayjs(userData.birthday)}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                )}
                {!userData.lastLogin ? (
                  <NotDisclosedField fieldName="Last login" />
                ) : (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DateTimePicker"]}>
                      <DateTimePicker
                        disabled={true}
                        name="lastLogin"
                        label="Last Login"
                        value={dayjs(userData.lastLogin)}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                )}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DateTimePicker"]}>
                    <DateTimePicker
                      disabled={true}
                      name="createdAt"
                      label="Created At"
                      value={dayjs(userData.createdAt)}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </>
            )}
          </form>
        </>
      )}
    </div>
  );
}
