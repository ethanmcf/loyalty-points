import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import { createNewTransaction } from "../../apis/transactionsApi";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { updateUserById } from "../../apis/UsersApi";

/**
 * This Dialog is used to promote/demote a user
 * Used by managers and superusers
 * Managers can only promote to cashier/regular
 * Superusers can promote to any status
 */
export function PromoteUserDialog() {
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [newUser, setNewUser] = useState();
    const [error, setError] = useState();
    const [status, setStatus] = useState();

    const canProcess = user?.role === 'manager' || user?.role === 'superuser';

    const handleClickOpen = () => {
        if (canProcess) {
            setIsOpen(true);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setEvent(null);
        setOrganizer(null);
        window.location.reload();
    };

    const handleStatus = (e) => {
        setStatus(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formJson = Object.fromEntries(formData.entries());

        setError(null);

        const id = formJson.id ? Number(formJson.id) : null;
        const status = formJson.status;

        if (!canProcess) return;

        try {
            const res = await updateUserById(localStorage.token, id, {role: status});
            if (!res) {
                setError("Invalid userId");
                return;
            }
            setNewUser(res);
            setError(null);
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    return (
        <div>
            <Button
                variant="outlined"
                onClick={handleClickOpen}
            >
                Promote or Demote a User
            </Button>

            <Dialog open={isOpen} onClose={handleClose}>
                {!newUser ? (
                    <>
                    <DialogTitle> Change a User's Status</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Insert the Id of a user to promote/demote them.
                        </DialogContentText>

                        <form
                            onSubmit={handleSubmit}
                            id="promote-user-form">
                            <TextField
                                required
                                margin="dense"
                                id="id"
                                name="id"
                                label="User Id"
                                fullWidth
                                variant="standard"
                                autoFocus
                            />
                        
                            {user.role === 'manager' && (
                                <>
                                <TextField
                                    select
                                    required
                                    margin="dense"
                                    id="status"
                                    name="status"
                                    label="Promote/Demote to..."
                                    value={status}
                                    onChange={handleStatus}
                                    fullWidth
                                    variant="standard"
                                >
                                    <MenuItem value="cashier">Cashier</MenuItem>
                                    <MenuItem value="regular">Regular</MenuItem>
                                </TextField>
                                </>
                            )}

                            {user.role === 'superuser' && (
                                <>
                                <TextField
                                    select
                                    required
                                    margin="dense"
                                    id="status"
                                    name="status"
                                    label="Promote/Demote to..."
                                    value={status}
                                    onChange={handleStatus}
                                    fullWidth
                                    variant="standard"
                                >
                                    <MenuItem value="cashier">Cashier</MenuItem>
                                    <MenuItem value="regular">Regular</MenuItem>
                                    <MenuItem value="manager">Manager</MenuItem>
                                    <MenuItem value="superuser">Superuser</MenuItem>
                                </TextField>
                                </>
                            )}
                        </form>
                        {!error ? null : <Alert severity="error">{error}</Alert>}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" form="promote-user-form" variant="contained">
                            Submit
                        </Button>
                    </DialogActions>
                    </>
                ) : (
                    <>
                    <dialogTitle> Success! </dialogTitle>
                    <DialogContent>
                        <Alert severity="success" sx={{ mb: 2 }}>
                            User with id {newUser.id} has been promoted/demoted.
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