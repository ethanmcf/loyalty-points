// This dialogue is used by the cashier to process a redemption Transaction
import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useUser } from "../../contexts/UserContext";
import { getTransaction, setTransactionCompleted } from "../../apis/transactionsApi";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";

/*
* This Dialog is for processing a redemption transaction
* Only for cashier, managers, and superusers.
*/
export function ApplyRedemptionTransactionDialog() {
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [transaction, setTransaction] = useState();
    const [error, setError] = useState();

    const canProcess = user?.role === 'cashier' || user?.role === 'manager' || user?.role === 'superuser';

    const handleClickOpen = () => {
        if (canProcess) {
            setIsOpen(true);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setTransaction(null);
        window.location.reload();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formJson = Object.fromEntries(formData.entries());

        setError(null);

        const id = formJson.id ? Number(formJson.id) : null;

        if (!canProcess) return;

        try {
            const res = await getTransaction(localStorage.token, id);
            if (!res || res.type !== 'redemption') {
                setError("Invalid transaction or not a redemption type");
                return;
            }
            await setTransactionCompleted(localStorage.token, id, true);
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
            <Button
                variant="outlined"
                onClick={handleClickOpen}
            >
                Process Redemption Transaction
            </Button>

            <Dialog open={isOpen} onClose={handleClose}>
                {!transaction ? (
                    <>
                    <DialogTitle>Process a Redemption Transaction</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Insert Context text here
                        </DialogContentText>
                    
                    <form
                        onSubmit={handleSubmit}
                        id="redemption-transaction-form">
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
                    </form>
                    {!error ? null : <Alert severity="error">{error}</Alert>}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" form="redemption-transaction-form" variant="contained">
                            Process Transaction
                        </Button>
                    </DialogActions>
                    </>
                ) : (
                    <>
                        <DialogTitle>Transaction Processed Successfully</DialogTitle>
                        <DialogContent>
                            <Alert severity="success" sx={{ mb: 2 }}>
                                Transaction with id {transaction.id} has been processed successfully.
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
};