import { useParams } from "react-router-dom";
import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import { postOrganizerToEvent } from "../../../apis/EventsApi";
import Snackbar from "@mui/material/Snackbar";
export function AddOrganizerInput({ fetchData }) {
  const { eventId } = useParams();
  const [utorid, setUtorid] = useState("");
  const [error, setError] = useState("");
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
      fetchData();
      handleOpenSnackBar();
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
      <Snackbar
        color="success"
        open={snackBarOpen}
        onClose={handleCloseSnackBar}
        autoHideDuration={1000}
        message="Organizer List Successfully Updated."
      />
    </div>
  );
}
