import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import { useUser } from "../../contexts/UserContext";
import { getSingleEvent, deleteSingleEvent } from "../../apis/EventsApi";
import DialogContentText from "@mui/material/DialogContentText";
/**
 * Only works if the event isnt published.
 * @param {object} props - The component props.
 * @param {number} props.id - The ID of the event to delete.
 */
export function DeleteEventsDialog({ id }) {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [deletedEvent, setDeletedEvent] = useState();
  const [error, setError] = useState();
  const [canDelete, setCanDelete] = useState(
    user?.role === "manager" || user?.role === "superuser"
  ); // only Managers and Superusers can delete events

  const fetchEvent = async () => {
    if (!canDelete) return;
    try {
      const res = await getSingleEvent(id, localStorage.token);
      setDeletedEvent(res);
      const currentTime = new Date();
      const startDateTime = new Date(res.startTime);
      const endDateTime = new Date(res.endTime);

      if (startDateTime <= currentTime || endDateTime <= currentTime) {
        setCanDelete(false);
      }

      if (res.published) {
        setCanDelete(false);
      }
    } catch (apiError) {
      console.error(apiError);
      setError("Could not load event details.");
      setIsOpen(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleClickOpen = () => {
    if (!canDelete || !deletedEvent) {
      setError("Unauthorized or event details not loaded.");
      return;
    }
    if (deletedEvent.published) {
      setError(`Cannot delete published event: ${deletedEvent.name}.`);
      return;
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDelete = async () => {
    if (deletedEvent.published) {
      setError("Deletion prevented: Event is currently published.");
      return;
    }
    try {
      // hope this is right
      await deleteSingleEvent(id, localStorage.token);
      window.location.reload();
      handleClose();
    } catch (error) {
      console.error("Event deletion failed:", error);
      setError(error.message);
    }
  };

  return (
    <>
      <Button
        variant="icon"
        onClick={handleClickOpen}
        disabled={!canDelete} // Disable if published
        title={
          !canDelete ? "Published events cannot be deleted" : "Delete Event"
        }
      >
        <DeleteIcon color={!canDelete ? "disabled" : "error"} />
      </Button>

      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Delete Event Confirmation</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <DialogContentText>
            Please confirm that you would like to permanently delete the
            following unpublished event:
          </DialogContentText>

          {deletedEvent && (
            <>
              {" "}
              <p>
                <b>Name:</b> {deletedEvent.name}
              </p>
              <p>
                <b>Location:</b> {deletedEvent.location}
              </p>
              <p>
                <b>Starts:</b>{" "}
                {new Date(deletedEvent.startTime).toLocaleDateString()}
              </p>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete Event
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
