import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import DialogActions from "@mui/material/DialogActions";
import {
  getTransaction,
  markTransactionSuspicious,
} from "../../apis/TransactionsApi";
import { useUser } from "../../contexts/UserContext";
import TextField from "@mui/material/TextField";

/*
 * This Dialog is used to mark a transaction as suspicious.
 * For use by managers and superusers.
 */
export function MarkTransactionSuspicious() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [transaction, setTransaction] = useState();
  const [suspicious, setSuspicious] = useState();
  const [error, setError] = useState();

  const canProcess = user?.role === "manager" || user?.role === "superuser";

  const handleClickOpen = () => {
    if (canProcess) {
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTransaction(null);
    //window.location.reload();
  };

  const handleSuspicious = (e) => {
    setSuspicious(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    setError(null);

    const id = formJson.id ? Number(formJson.id) : null;
    const suspicious = formJson.suspicious;

    if (!canProcess) return;

    try {
      const res = await getTransaction(localStorage.token, id);
      if (!res) {
        setError("Transaction Id invalid");
        return;
      }
      if (suspicious === "true") {
        await markTransactionSuspicious(localStorage.token, id, true);
      } else {
        await markTransactionSuspicious(localStorage.token, id, false);
      }
      setTransaction(res);
      setError(null);
    } catch (error) {
      console.error(error);
      setError(error.message);
      setIsOpen(false);
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        {" "}
        Mark a Transaction as Suspicious{" "}
      </Button>

      <Dialog open={isOpen} onClose={handleClose}>
        {!transaction ? (
          <>
            <DialogTitle>Mark a Transaction as Suspicious</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Insert the ID of the transaction to mark is as suspicious or not
                suspicious
              </DialogContentText>

              <form onSubmit={handleSubmit} id="mark-suspicious-form">
                <TextField
                  required
                  margin="dense"
                  id="id"
                  name="id"
                  label="Transaction id"
                  fullWidth
                  variant="standard"
                  autoFocus
                />
                <TextField
                  select
                  required
                  margin="dense"
                  id="suspicious"
                  name="suspicious"
                  label="Mark Transaction as..."
                  value={suspicious}
                  onChange={handleSuspicious}
                  fullWidth
                  variant="standard"
                >
                  <MenuItem value="true">Suspicious</MenuItem>
                  <MenuItem value="false">Not Suspicious</MenuItem>
                </TextField>
              </form>
              {!error ? null : <Alert severity="error">{error}</Alert>}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                type="submit"
                form="mark-suspicious-form"
                variant="contained"
              >
                Submit
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <dialogTitle></dialogTitle>
            <DialogContent>
              <Alert severity="success" sx={{ mb: 2 }}>
                Transaction with id {transaction.id} has been marked as
                suspicious/not suspicious.
              </Alert>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} variant="contained">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
}
