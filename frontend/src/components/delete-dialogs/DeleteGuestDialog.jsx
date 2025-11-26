import Dialog from "@mui/material/Dialog";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { getUserById } from "../../apis/UsersApi";
import { useParams } from "react-router-dom";
import { removeGuest } from "../../apis/EventsApi";

export function DeleteGuestDialog({ userId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [deletedUser, setDeletedUser] = useState();
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

  const handleClickOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDelete = async () => {
    // u could add a function here
    try {
      await removeGuest(localStorage.token, eventId, userId);
      handleClose();
    } catch (error) {
      console.error(error);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen}>
        Remove Guest
      </Button>
      {deletedUser && (
        <Dialog open={isOpen} onClose={handleClose}>
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogContent>
            Please Confirm that you would like to remove the following guest:
            <p>
              <b>Name:</b> {deletedUser.name}
            </p>
            <p>
              <b>UtorId:</b> {deletedUser.utorid}
            </p>
            <p>
              <b>Email:</b> {deletedUser.email}
            </p>
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
