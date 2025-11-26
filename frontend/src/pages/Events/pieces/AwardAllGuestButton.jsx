import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { createEventTransaction } from "../../../apis/EventsApi";
import Alert from "@mui/material/Alert";
import DialogActions from "@mui/material/DialogActions";

export function AwardAllGuestButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState();
  const [createdTransaction, setCreatedTransaction] = useState();
  const [userCount, setUserCount] = useState(0);
  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleClose = (e) => {
    e.preventDefault();
    setIsOpen(false);
    setCreatedTransaction(null);
    setUserCount(0);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const formJson = {
      ...Object.fromEntries(formData.entries()),
      type: "event",
    };

    try {
      const res = await createEventTransaction(
        localStorage.token,
        eventId,
        formJson
      );
      setCreatedTransaction(res);
      setUserCount(res.length);
    } catch (error) {
      console.error("Setting error: ", error.message);
      setError(error.message);
    }
  };
  return (
    <>
      <Button onClick={handleClickOpen} variant="contained">
        Award All Guests
      </Button>
      <Dialog open={isOpen} onClose={handleClose}>
        {createdTransaction ? (
          <>
            <DialogTitle>Event Award Transaction Confirmed</DialogTitle>
            <DialogContent>
              You have successfully created a transaction record of awarding:
              <DialogContentText>
                <b>{res[0].awarded} Points</b> to <b>{userCount} Users</b>
              </DialogContentText>
              <p>Remarks: {res[0].remarks}</p>
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
              <DialogContentText>
                Please enter the amount of points you would like to award and
                any remarks you would like to leave.
              </DialogContentText>
              <form onSubmit={handleSubmit} id="reward-all-form">
                <TextField id="amount" label="Amount to Reward" />
                <TextField id="remark" label="Remarks" />
              </form>
              {!error ? null : <Alert severity="error">{error}</Alert>}
            </DialogContent>
            <DialogActions>
              <Button variant="text" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" type="submit" form="reward-all-form">
                Submit Transaction
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
