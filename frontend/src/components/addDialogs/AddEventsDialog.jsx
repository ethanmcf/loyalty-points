import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import { postNewEvent } from "../../apis/EventsApi";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";

export function AddEventsDialog({ isOpen, setIsOpen }) {
  const { user } = useUser();
  const [isCreated, setIsCreated] = useState(false);
  const [createdEvent, setCreatedEvent] = useState();
  const [error, setError] = useState();

  // only Managers and Superusers can create events
  const canAdd = user?.role === "manager" || user?.role === "superuser";

  const handleClickOpen = () => {
    if (canAdd) {
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setCreatedEvent(null);
    setIsCreated(false);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    setError(null);

    const capacity = formJson.capacity ? Number(formJson.capacity) : null;
    const points = Number(formJson.points);

    try {
      // the capacity needs to be null if empty and points must be a positive int

      const startTime = new Date(formJson.startTime).toISOString();
      const endTime = new Date(formJson.endTime).toISOString();
      console.log(startTime);
      console.log(endTime);

      const res = await postNewEvent(
        formJson.name,
        formJson.description,
        formJson.location,
        startTime,
        endTime,
        capacity,
        points,
        localStorage.token
      );

      setCreatedEvent(res);
      setIsCreated(true);
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  return (
    <>
      <Button variant="text" onClick={handleClickOpen} disabled={!canAdd}>
        Add New Event
      </Button>

      <Dialog open={isOpen} onClose={handleClose}>
        {!isCreated ? (
          <>
            <DialogTitle>Create a new event</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Events are created as unpublished. Only managers and superusers
                can manage event capacity and points.
              </DialogContentText>

              <form
                onSubmit={handleSubmit}
                id="new-event-form"
                style={{ marginBottom: "5px" }}
              >
                <TextField
                  required
                  margin="dense"
                  id="name"
                  name="name"
                  label="Event Name"
                  type="text"
                  fullWidth
                  variant="standard"
                  autoFocus
                />
                <TextField
                  required
                  margin="dense"
                  id="description"
                  name="description"
                  label="Description"
                  type="text"
                  multiline
                  rows={2}
                  fullWidth
                  variant="standard"
                />
                <TextField
                  required
                  margin="dense"
                  id="location"
                  name="location"
                  label="Location"
                  type="text"
                  fullWidth
                  variant="standard"
                />
                <TextField
                  required
                  margin="dense"
                  id="startTime"
                  name="startTime"
                  label="Start Time"
                  type="datetime-local"
                  fullWidth
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  required
                  margin="dense"
                  id="endTime"
                  name="endTime"
                  label="End Time"
                  type="datetime-local"
                  fullWidth
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  margin="dense"
                  id="capacity"
                  name="capacity"
                  label="Capacity (Max Guests, leave blank for no limit)"
                  type="number"
                  fullWidth
                  variant="standard"
                  helperText="Enter 0 or leave blank for unlimited capacity."
                />
                <TextField
                  required
                  margin="dense"
                  id="points"
                  name="points"
                  label="Total Points to Allocate"
                  type="number"
                  fullWidth
                  variant="standard"
                  helperText="The maximum number of points that can be awarded at this event."
                />
              </form>

              {!error ? null : <Alert severity="error">{error}</Alert>}
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" form="new-event-form" variant="contained">
                Create Event
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>Event Created Successfully</DialogTitle>
            <DialogContent>
              <Alert severity="success" sx={{ mb: 2 }}>
                Event "{createdEvent.name}" (ID: {createdEvent.id}) has been
                created as unpublished.
              </Alert>
              {Object.keys(createdEvent).map(
                (prop, index) =>
                  prop !== "description" &&
                  prop !== "guests" &&
                  prop !== "organizers" && (
                    <div key={index}>
                      <b>{prop}: </b>
                      {createdEvent[prop]?.toString() || "N/A"}
                    </div>
                  )
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} variant="contained">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
