import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useUser } from "../../contexts/UserContext";
import { getTransaction, setTransactionCompleted } from "../../apis/transactionsApi";

/**
 * Dialog component for marking a redemption transaction as processed.
 * only for managers and superusers due to backend GET /:transactionId security.
 * @param {object} props - The component props.
 * @param {number} props.id - The ID of the transaction to process.
 */
export function ProcessRedemptionTransactionsDialog({ id }) {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [transaction, setTransaction] = useState();
  const [error, setError] = useState();

  const canProcess = user?.role === 'manager' || user?.role === 'superuser';

  const fetchTransaction = async () => {
    if (!canProcess) return;
    try {
      const res = await getTransaction(user.token, id);
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

  const handleClickOpen = () => {
    if (canProcess && transaction) {
      if (transaction.type !== 'redemption') {
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
    if (!transaction || transaction.type !== 'redemption') return;
    
    try {
      await setTransactionCompleted(user.token, id, true);
      handleClose();
    } catch (apiError) {
      console.error("Failed to process redemption:", apiError);
      setError(apiError.message);
    }
  };

  if (!canProcess) return null; // Don't  render if user is unauthorized

  const isProcessed = transaction?.processed;

  // only show the button if it's a redemption and it hasn't been processed yet
  if (transaction?.type !== 'redemption' || isProcessed) {
      return null;
  }

  return (
    <>
      <Button 
        variant="icon" 
        onClick={handleClickOpen}
        disabled={!transaction || isProcessed} 
      >
        <CheckCircleIcon color={"success"} />
      </Button>
      
      {transaction && (
        <Dialog open={isOpen} onClose={handleClose}>
          <DialogTitle>Process Redemption (ID: {transaction.id})</DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" >{error}</Alert>}
            
            <DialogContentText>
              Are you sure you want to process this redemption? This action will permanently deduct {transaction.amount} points from the user's balance.
            </DialogContentText>
            
            <p>
              <b>Affected User:</b> {transaction.utorid}
            </p>
            <p>
              <b>Points to Deduct:</b> {transaction.amount}
            </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button 
              onClick={handleProcess} 
              color="success" 
              variant="contained"
            > 
              Process and Deduct Points
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}