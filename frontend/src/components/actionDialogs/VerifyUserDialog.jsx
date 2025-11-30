import {getSingleEvent, postOrganizerToEvent} from "../../apis/EventsApi";
import { use, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useUser } from "../../contexts/UserContext";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import { getUserById, updateUserById } from "../../apis/UsersApi";

/*
* This Dialog is for verifying a user
* Only for managers and superusers.
*/
export function VerifyUserDialog() {
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [newUser, setNewUser] = useState();
    const [error, setError] = useState();

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formJson = Object.fromEntries(formData.entries());

        setError(null);

        const userId = formJson.id ? Number(formJson.id) : null;

        if (!canProcess) return;

        try {
            const res = await updateUserById(localStorage.token, userId, {verified: true});
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
                Verify a User
            </Button>

            <Dialog open={isOpen} onClose={handleClose}>
                {!newUser ? (
                    <>
                    <DialogTitle>Verify a User</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Insert the Id of a user to verify
                        </DialogContentText>

                        <form
                            onSubmit={handleSubmit}
                            id="verify-user-form">
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
                            </form>
                            {!error ? null : <Alert severity="error">{error}</Alert>}
                    </DialogContent>
                    <DialogActions>
                       <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" form="verify-user-form" variant="contained">
                            Verify
                        </Button> 
                    </DialogActions>
                    </>
                ) : (
                    <>
                    <DialogTitle>Verify User</DialogTitle>
                    <DialogContent>
                        <Alert severity="success" sx={{ mb: 2 }}>
                            The user with id {newUser.id} has been verified.
                        </Alert>
                        <DialogActions>
                            <Button onClick={handleClose} variant="contained">
                                Close
                            </Button>
                        </DialogActions>
                    </DialogContent>
                    </>
                )}
            </Dialog>
        </div>
    );
}