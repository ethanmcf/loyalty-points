import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import { redeemMyPoints } from "../../apis/UsersApi";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";

/**
 * Create a new Redemption transaction.
 */
export function AddRedemptionTransactionDialog() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [createdTransaction, setCreatedTransaction] = useState();
  const [error, setError] = useState();

  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setCreatedTransaction(null);
    setIsCreated(false);
    setError(null);
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    setError(null);

    // Convert numbers and ensure correct formatting or null
    const remark = formJson.remark || undefined;
    const amount = formJson.amount ? Number(formJson.amount) : undefined;

    try {
      const res = await redeemMyPoints(
        localStorage.token,
        amount,
        remark
      );

      setCreatedTransaction(res);
      setIsCreated(true);
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add A New Transaction
      </Button>

      <Dialog open={isOpen} onClose={handleClose}>
        {!isCreated ? (
          <>
            <DialogTitle>Create a new Redemption transaction</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please fill out the following form with the amount of points you would like to redeem.
              </DialogContentText>

              <form
                onSubmit={handleSubmit}
                id="new-transaction-form"
                style={{ marginBottom: "5px" }}
              >
                <TextField
                  required
                  margin="dense"
                  id="amount"
                  name="amount"
                  label="Amount of Points to redeem"
                  type="text"
                  fullWidth
                  variant="standard"
                />

                <TextField
                  margin="dense"
                  id="remark"
                  name="remark"
                  label="Remarks"
                  type="text"
                  fullWidth
                  variant="standard"
                />
              </form>

              {!error ? null : <Alert severity="error">{error}</Alert>}
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                type="submit"
                form="new-transaction-form"
                variant="contained"
              > Create Transaction
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>Success!</DialogTitle>
            <DialogContent>
              <Alert severity="success" sx={{ mb: 2 }}>
                A redemption transaction with id {createdTransaction.id} has been created!
            </Alert>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
