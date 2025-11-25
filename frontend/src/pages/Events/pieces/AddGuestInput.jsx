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

export function AddGuestInput({ guestList }) {
  const { eventId } = useParams();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [utorid, setUtorid] = useState("");
  const [error, setError] = useState("");
  const [isUserGuest, setIsUserGuest] = useState(false);

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
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRSVPme = async () => {
    try {
      const res = await joinEventLoggedIn(localStorage.token, eventId);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUnRSVPme = async () => {
    try {
      const res = await leaveEvent(localStorage.token, eventId);
    } catch (error) {
      setError(error.message);
    }
  };

  // TOOD: add success feedback
  return (
    <div className="adding-input">
      {!error ? null : <Alert severity="error">{error}</Alert>}
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
      {!isUserGuest ? (
        <Button variant="contained" onClick={handleRSVPme}>
          RSVP Me
        </Button>
      ) : (
        <Button variant="contained" onClick={handleUnRSVPme}>
          UnRSVP Me
        </Button>
      )}
      <AwardAllGuestButton variant="contained" />
    </div>
  );
}
