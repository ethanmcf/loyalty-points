import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions"; 

import { useUser } from "../../contexts/UserContext";
import {
  getTransaction,
  setTransactionCompleted,
} from "../../apis/TransactionsApi";

export function ProcessRedemptionTransactionsDialog({ id }) {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [transaction, setTransaction] = useState();
  const [error, setError] = useState();

  const canProcess =
    user?.role === "cashier" ||
    user?.role === "manager" ||
    user?.role === "superuser";

  const fetchTransaction = async () => {
    if (!canProcess) return;
    try {
      const res = await getTransaction(localStorage.token, id);
      console.log(` API Response for Transaction ${id}:`, res);
      setTransaction(res);
      setError(null);
    } catch (error) {
      console.error(error);
      setError(error.message);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const isProcessed = transaction?.processed === true;

  const handleClickOpen = () => {
    if (canProcess && transaction && !isProcessed) {
      if (transaction.type !== "redemption") {
        setError("This is not a redemption transaction.");
        return;
      }
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    window.location.reload();
  };

  const handleProcess = async () => {
    if (!transaction || transaction.type !== "redemption") return;

    try {
      await setTransactionCompleted(localStorage.token, id, true);
      handleClose();
    } catch (apiError) {
      console.error("Failed to process redemption:", apiError);
      setError(apiError.message);
    }
  };

  if (!canProcess)
  return (
    <Tooltip title="You are not authorized to process redemptions.">
      <Chip label="N/A" />
    </Tooltip>
  ); // Don't  render if user is unauthorized

  
  //if (!canProcess) return <Chip label="N/A" />;

  if (transaction?.type !== "redemption") {
    return (
      <Tooltip title="Only Unprocessed Redemption Transactions can be processed">
        <Chip label="N/A" />
      </Tooltip>
    );
  }

  // if it is processed green check
  if (isProcessed) {
    return (
      <Tooltip title={"Already processed"}>
        <CheckCircleIcon color="success" />
      </Tooltip>
    );
  }

  // if not processed action button
  return (
    <>
      <Tooltip title="Click to Process Redemption">
        <Button
          variant="icon"
          onClick={handleClickOpen}
          disabled={!transaction} 
        >
          <PendingActionsIcon color="primary" />
        </Button>
      </Tooltip>

      {transaction && (
        <Dialog open={isOpen} onClose={handleClose}>
          <DialogTitle>Process Redemption (ID: {transaction.id})</DialogTitle>
          <DialogContent>
            {error && <Alert severity="error">{error}</Alert>}

            <DialogContentText>
              Are you sure you want to process this redemption? This action will
              permanently deduct {transaction.amount} points from the user's
              balance.
            </DialogContentText>
            
            <div style={{ marginTop: '1rem' }}>
                <p><b>Affected User:</b> {transaction.utorid}</p>
                <p><b>Points to Deduct:</b> {transaction.amount}</p>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleProcess} color="success" variant="contained">
              Process and Deduct Points
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}