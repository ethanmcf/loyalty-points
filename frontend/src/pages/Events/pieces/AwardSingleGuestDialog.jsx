import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { getUserById } from "../../../apis/UsersApi";
import DialogActions from "@mui/material/DialogActions";
import { createEventTransaction } from "../../../apis/EventsApi";
import { useParams } from "react-router-dom";

export function AwardSingleGuestDialog({ userId }) {
  const { eventId } = useParams();

  const [isOpen, setIsOpen] = useState(false);
  const [guest, setGuest] = useState();
  const [error, setError] = useState("");

  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleClose = (e) => {
    e.preventDefault();
    setIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const formJson = {
      ...Object.fromEntries(formData.entries()),
      utorid: guest.utorid,
      type: "event",
    };
    try {
      const res = await createEventTransaction(
        localStorage.token,
        eventId,
        formJson
      );
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await getUserById(localStorage.token, userId);
      setGuest(res);
    } catch (error) {
      console.error(error);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  return (
    <>
      <Button onClick={handleClickOpen} variant="contained">
        Award Guest
      </Button>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Award Confirmation</DialogTitle>
        <DialogContent>
          <b>{guest && <>User being Awarded: {guest.name}</>}</b>
          <DialogContentText>
            Please enter the amount of points you would like to award and any
            remarks you would like to leave.
          </DialogContentText>
          <form id="reward-form" onSubmit={handleSubmit}>
            <TextField id="amount" label="Amount to Reward" name="amount" />
            <TextField id="remark" label="Remarks" name="remark" />
          </form>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            Submit Transaction
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
