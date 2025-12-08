import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import { postNewEvent } from "../../apis/EventsApi";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";

export function AddEventsDialog({ isOpen, setIsOpen }) {
  const { user } = useUser();
  const [isCreated, setIsCreated] = useState(false);
  const [createdEvent, setCreatedEvent] = useState();
  const [error, setError] = useState();

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
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
    setStartTime(null); // Reset date state
    setEndTime(null); // Reset date state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    setError(null);

    const capacity = formJson.capacity ? Number(formJson.capacity) : null;
    const points = Number(formJson.points);

    const isoStartTime = startTime ? startTime.toISOString() : null;
    const isoEndTime = endTime ? endTime.toISOString() : null;

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
        isoStartTime,
        isoEndTime,
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
      {canAdd && (
        <>
          <IconButton sx={{ display: { xs: "flex", md: "none" } }}>
            <AddIcon onClick={handleClickOpen} disabled={!canAdd} />
          </IconButton>
          <Button
            sx={{ display: { xs: "none", md: "flex" } }}
            variant="text"
            onClick={handleClickOpen}
            disabled={!canAdd}
          >
            Add New Event
          </Button>
        </>
      )}

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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer
                    components={["DateTimePicker"]}
                    sx={{ marginTop: "4px", overflow: "hidden" }}
                  >
                    <DateTimePicker
                      name="startTime"
                      label="Start Time"
                      value={startTime}
                      onChange={(newValue) => setStartTime(newValue)}
                      slotProps={{
                        textField: { required: true, variant: "standard" },
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer
                    components={["DateTimePicker"]}
                    sx={{ marginTop: "4px", overflow: "hidden" }}
                  >
                    <DateTimePicker
                      name="endTime"
                      label="End Time"
                      value={endTime}
                      onChange={(newValue) => setEndTime(newValue)}
                      slotProps={{
                        textField: { required: true, variant: "standard" },
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>

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
              <Button type="submit" form="new-event-form">
                Create Event
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>Event Created Successfully</DialogTitle>
            <DialogContent>
              {Object.keys(createdEvent).map((prop, index) => {
                if (prop === "description" || prop === "guests" || prop === "organizers") {
                  return null;
                }

                let displayValue = createdEvent[prop];

                if ((prop === "startTime" || prop === "endTime") && displayValue) {
                  displayValue = new Date(displayValue).toLocaleString();
                } else {
                  displayValue = displayValue?.toString() || "N/A";
                }

                return (
                  <div key={index}>
                    <b>{prop}: </b>
                    {displayValue}
                  </div>
                );
              })}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} variant="outlined">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
