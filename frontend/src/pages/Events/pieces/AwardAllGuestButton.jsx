import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useState } from "react";

export function AwardAllGuestButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleClose = (e) => {
    e.preventDefault();
    setIsOpen(false);
  };
  return (
    <>
      <Button onClick={handleClickOpen} variant="contained">
        Award All
      </Button>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Award Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the amount of points you would like to award and any
            remarks you would like to leave.
          </DialogContentText>
          <form id="reward-form">
            <TextField id="amount" label="Amount to Reward" />
            <TextField id="remark" label="Remarks" />
          </form>
          <Button variant="contained">Submit Transaction</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
