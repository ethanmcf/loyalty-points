import { useParams } from "react-router-dom";
import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import { postOrganizerToEvent } from "../../../apis/EventsApi";

export function AddOrganizerInput() {
  const { eventId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [utorid, setUtorid] = useState("");
  const [error, setError] = useState("");

  const handleUtoridChange = (e) => {
    e.preventDefault();
    setUtorid(e.target.value);
  };

  const handleAddOrganizer = async () => {
    try {
      const res = await postOrganizerToEvent(
        eventId,
        utorid,
        localStorage.token
      );
    } catch (error) {
      setError(error.message);
    }
  };

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
      <Button variant="contained" onClick={handleAddOrganizer}>
        Add Organizer
      </Button>
    </div>
  );
}
