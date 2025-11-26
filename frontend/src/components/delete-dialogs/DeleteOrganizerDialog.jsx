import Dialog from "@mui/material/Dialog";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { getUserById } from "../../apis/UsersApi";
import { deleteOrganizerFromEvent } from "../../apis/EventsApi";
import { useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { GridDeleteIcon } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";

export function DeleteOrganizerDialog({ userId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [deletedUser, setDeletedUser] = useState();
  const [error, setError] = useState();
  const { eventId } = useParams();

  const fetchUser = async () => {
    try {
      const res = await getUserById(localStorage.token, userId);
      setDeletedUser(res);
    } catch (error) {
      console.error(error);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const handleClickOpen = (e) => {
    setIsOpen(true);
  };

  const handleClose = (e) => {
    e.preventDefault();
    setError(null);
    setIsOpen(false);
  };

  const handleDelete = async () => {
    try {
      await deleteOrganizerFromEvent(eventId, userId, localStorage.token);
      handleClose();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <IconButton color="error" onClick={handleClickOpen}>
        <GridDeleteIcon />
      </IconButton>

      {deletedUser && (
        <Dialog open={isOpen} onClose={handleClose}>
          <DialogTitle>Organizer Removal Confirmation</DialogTitle>
          <DialogContent>
            Please Confirm that you would like to remove the following
            organizer:
            <p>
              <b>Name:</b> {deletedUser.name}
            </p>
            <p>
              <b>UtorId:</b> {deletedUser.utorid}
            </p>
            <p>
              <b>Email:</b> {deletedUser.email}
            </p>
            {!error ? null : <Alert severity="error">{error}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleDelete}>Delete</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
