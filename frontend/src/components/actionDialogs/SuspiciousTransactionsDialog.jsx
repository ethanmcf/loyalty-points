import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import ReportIcon from "@mui/icons-material/Report";
import { useUser } from "../../contexts/UserContext";
import {
  getTransaction,
  markTransactionSuspicious,
} from "../../apis/transactionsApi";
import DialogContentText from "@mui/material/DialogContentText";

/**
 * Dialog component for toggling the suspicious flag on a transaction.
 * @param {object} props - The component props.
 * @param {number} props.id - The ID of the transaction to modify.
 */
export function SuspiciousTransactionsDialog({ id }) {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [transaction, setTransaction] = useState();
  const [error, setError] = useState();

  // Only Managers and Superusers can use this
  const canToggle = user?.role === "manager" || user?.role === "superuser";

  const fetchTransaction = async () => {
    if (!canToggle) return;
    try {
      const res = await getTransaction(localStorage.token, id);
      setTransaction(res);
    } catch (error) {
      console.error(error);
      setError(error.message);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const handleClickOpen = () => {
    if (canToggle && transaction) {
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // TODO based on state management
    window.location.reload();
  };

  const handleToggleSuspicious = async () => {
    if (!transaction) return;
    const newSuspiciousStatus = !transaction.suspicious;

    try {
      await markTransactionSuspicious(
        localStorage.token,
        id,
        newSuspiciousStatus
      );
      handleClose();
    } catch (apiError) {
      console.error("Failed to toggle suspicious status:", apiError);
      setError(apiError.message);
    }
  };

  if (!canToggle) return null;

  const actionText = transaction?.suspicious ? "unmark" : "mark";
  const statusText = transaction?.suspicious ? "suspicious" : "clean";

  return (
    <>
      <Button
        variant="icon"
        onClick={handleClickOpen}
        disabled={!transaction} // Disable button if details haven't loaded
      >
        <ReportIcon color={transaction?.suspicious ? "error" : "primary"} />
      </Button>

      {transaction && (
        <Dialog open={isOpen} onClose={handleClose}>
          <DialogTitle>{actionText} transaction as suspicious?</DialogTitle>
          <DialogContent>
            {error && <Alert severity="error">{error}</Alert>}

            <DialogContentText>
              Are you sure you want to {actionText} the following
              transaction (ID: {transaction.id})? The transaction is currently
              marked as {statusText}.
            </DialogContentText>

            <p>
              <b>Affected User:</b> {transaction.utorid}
            </p>
            <p>
              <b>Type:</b> {transaction.type}
            </p>
            <p>
              <b>Amount:</b> {transaction.amount} Points
            </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={handleToggleSuspicious}
              color={transaction.suspicious ? "primary" : "error"}
              variant="contained"
            >
              {actionText} as Suspicious
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
