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

  // only Managers and Superusers can delete events
  const canDelete = user?.role === "manager" || user?.role === "superuser";

  const fetchEvent = async () => {
    if (!canDelete) return;
    try {
      const res = await getSingleEvent(id, localStorage.token);
      setDeletedEvent(res);
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
    // TODO based on state management
    window.location.reload();
  };

  const handleDelete = async () => {
    if (deletedEvent.published) {
      setError("Deletion prevented: Event is currently published.");
      return;
    }
    try {
      // hope this is right
      await deleteSingleEvent(id, user.token);
      handleClose();
    } catch (error) {
      console.error("Event deletion failed:", error);
      setError(error.message);
    }
  };

  if (!canDelete || !deletedEvent) {
    if (error)
      return (
        <Alert severity="error" size="small">
          {error}
        </Alert>
      );
    return null;
  }

  const isPublished = deletedEvent.published;

  return (
    <>
      <Button
        variant="icon"
        onClick={handleClickOpen}
        disabled={isPublished} // Disable if published
        title={
          isPublished ? "Published events cannot be deleted" : "Delete Event"
        }
      >
        <DeleteIcon color={isPublished ? "disabled" : "error"} />
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
