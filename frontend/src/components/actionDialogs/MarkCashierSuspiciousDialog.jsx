import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useUser } from "../../contexts/UserContext";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import { getUserById, updateUserById } from "../../apis/UsersApi";

/*
* This Dialog is for marking a cashier as suspicious
* Only for managers and superusers
*/
export function MarkCashierSuspiciousDialog() {
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [cashier, setCashier] = useState();
    const [suspicious, setSuspicious] = useState();
    const [error, setError] = useState();

    const canProcess = user?.role === 'manager' || user?.role === 'superuser';

    const handleClickOpen = () => {
        if (canProcess) {
            setIsOpen(true);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setCashier(null);
        setSuspicious("");
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
            const res = await getUserById(localStorage.token, id);
            if (!res) {
                setError("Invalid User Id");
                return;
            }
            if (suspicious === "true"){
                await updateUserById(localStorage.token, id, {suspicious: true});
            } else {
                await updateUserById(localStorage.token, id, {suspicious: false});
            }
            setCashier(res);
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
            > Mark a Cashier as Suspicious </Button>

            <Dialog open={isOpen} onClose={handleClose}>
                {!cashier ? (
                    <>
                    <DialogTitle>Mark Cashier as Suspicious</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Insert the Id of the cashier you want to mark as suspicious
                        </DialogContentText>

                        <form
                            onSubmit={handleSubmit}
                            id="mark-cashier-form">
                            <TextField
                                required
                                margin="dense"
                                id="id"
                                name="id"
                                label="Cashier Id"
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
                                label="Mark Cashier as..."
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
                        <Button type="submit" form="mark-cashier-form" variant="contained">
                            Submit
                        </Button>
                    </DialogActions>
                    </>
                ) : (
                    <>
                    <DialogTitle> Success! </DialogTitle>
                    <DialogContent>
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Cashier with id {cashier.id} has been marked as suspicious.
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