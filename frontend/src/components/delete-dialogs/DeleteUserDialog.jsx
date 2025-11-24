import Dialog from "@mui/material/Dialog";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { getUserById } from "../../apis/UsersApi";

export function DeleteUserDialog({ id }) {
  const [isOpen, setIsOpen] = useState(false);
  const [deletedUser, setDeletedUser] = useState();

  const fetchUser = async () => {
    try {
      const res = await getUserById(localStorage.token, id);
      setDeletedUser(res);
    } catch (error) {
      console.error(error);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleClickOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
    window.location.reload(); // TODO: this is temp, i wanna remove this when i figure out the state management
  };

  const handleDelete = () => {
    // u could add a function here
  };

  return (
    <>
      <Button variant="icon" onClick={handleClickOpen}>
        <DeleteIcon color="error" />
      </Button>
      {deletedUser && (
        <Dialog open={isOpen} onClose={handleClose}>
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogContent>
            Please Confirm that you would like to delete the following user:
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
            <Button>Cancel</Button>
            <Button>Delete</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
