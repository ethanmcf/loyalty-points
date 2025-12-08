import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import {
  joinEventLoggedIn,
  leaveEvent,
  postGuestToEvent,
} from "../../../apis/EventsApi";
import { useUser } from "../../../contexts/UserContext";
import { AwardAllGuestButton } from "./AwardAllGuestButton";
import Snackbar, { snackbarClasses } from "@mui/material/Snackbar";

export function AddGuestInput({ guestList, canEdit, fetchData }) {
  const { eventId } = useParams();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [utorid, setUtorid] = useState("");
  const [error, setError] = useState("");
  const [isUserGuest, setIsUserGuest] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  // Reference: https://mui.com/material-ui/react-snackbar/
  const handleOpenSnackBar = () => {
    setSnackBarOpen(true);
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  useEffect(() => {
    if (guestList.find((guest) => guest.id === user.id)) {
      setIsUserGuest(true);
    } else {
      setIsUserGuest(false);
    }
  }, [guestList]);

  const handleUtoridChange = (e) => {
    e.preventDefault();
    setUtorid(e.target.value);
  };

  const handleAddGuest = async () => {
    try {
      const res = await postGuestToEvent(eventId, utorid, localStorage.token);
      fetchData();
      handleOpenSnackBar();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRSVPme = async () => {
    try {
      const res = await joinEventLoggedIn(localStorage.token, eventId);
      fetchData();
      handleOpenSnackBar();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUnRSVPme = async () => {
    try {
      await leaveEvent(localStorage.token, eventId);
      fetchData();
      handleOpenSnackBar();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="adding-input">
      {!error ? null : <Alert severity="error">{error}</Alert>}
      {canEdit && (
        <>
          <TextField
            variant="outlined"
            value={utorid}
            onChange={handleUtoridChange}
            id="utorid"
            name="utorid"
            label="UtorID"
          />
          <Button variant="contained" onClick={handleAddGuest}>
            Add Guest
          </Button>
        </>
      )}
      {!isUserGuest ? (
        <Button variant="contained" onClick={handleRSVPme}>
          RSVP Me
        </Button>
      ) : (
        <Button variant="contained" onClick={handleUnRSVPme}>
          UnRSVP Me
        </Button>
      )}
      {canEdit && <AwardAllGuestButton variant="contained" />}
      <Snackbar
        color="success"
        open={snackBarOpen}
        onClose={handleCloseSnackBar}
        autoHideDuration={1000}
        message="Guest List Successfully Updated."
      />
    </div>
  );
}
