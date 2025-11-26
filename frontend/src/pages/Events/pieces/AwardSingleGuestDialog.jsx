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
import Alert from "@mui/material/Alert";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export function AwardSingleGuestDialog({ userId }) {
  const { eventId } = useParams();

  const [isOpen, setIsOpen] = useState(false);
  const [guest, setGuest] = useState();
  const [error, setError] = useState("");
  const [createdTransaction, setCreatedTransaction] = useState();

  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleClose = (e) => {
    e.preventDefault();
    setCreatedTransaction(null);
    setError(null);
    setGuest(null);
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
      setCreatedTransaction(res);
    } catch (error) {
      console.error(error);
      setError(error.message);
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
      <Button onClick={handleClickOpen} size="icon">
        <EmojiEventsIcon />
      </Button>
      <Dialog open={isOpen} onClose={handleClose}>
        {createdTransaction ? (
          <>
            <DialogTitle>Event Award Transaction Confirmed</DialogTitle>
            <DialogContent>
              You have successfully created a transaction record of awarding:
              <DialogContentText>
                <b>{res.awarded} Points</b> to <b>{res.recipient}</b>
              </DialogContentText>
              <p>Remarks: {res.remarks}</p>
            </DialogContent>
            <DialogActions>
              <Button variant="text" onClick={handleClose}>
                Close
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>Award Confirmation</DialogTitle>
            <DialogContent>
              <b>{guest && <>User being Awarded: {guest.name}</>}</b>
              <DialogContentText>
                Please enter the amount of points you would like to award and
                any remarks you would like to leave.
              </DialogContentText>
              <form id="reward-form" onSubmit={handleSubmit}>
                <TextField id="amount" label="Amount to Reward" name="amount" />
                <TextField id="remark" label="Remarks" name="remark" />
              </form>
              {!error ? null : <Alert severity="error">{error}</Alert>}
            </DialogContent>
            <DialogActions>
              <Button variant="text" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" type="submit" form="reward-form">
                Submit Transaction
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
