import {getSingleEvent, postGuestToEvent, postOrganizerToEvent} from "../../apis/EventsApi";
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

/* 
* This Dialog is for adding a guest to an event.
* Only for use by managers and superusers.
*/
export function AddGuestToEventDialog() {
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [event, setEvent] = useState();
    const [error, setError] = useState();

    const canProcess = user?.role === 'manager' || user?.role === 'superuser';

    const handleClickOpen = () => {
        if (canProcess) {
            setIsOpen(true);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setTransaction(null);
        setError(null);
        window.location.reload();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const formJson = Object.fromEntries(formData.entries());

        setError(null);

        const eventId = formJson.id ? Number(formJson.id) : null;
        const utorid = formJson.utorid;

        if (!canProcess) return;

        try {
            const res = await getSingleEvent(localStorage.token, eventId);
            if (!res) {
                setError("Invalid Event Id");
                return;
            }
            await postGuestToEvent(eventId, utorid, localStorage.token);
            setEvent(res);
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
                Add a Guest to an Event
            </Button>

            <Dialog open={isOpen} onClose={handleClose}>
                {!event ? (
                    <>
                    <DialogTitle>Add a Guest to an Event</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Insert the utorid of a user and the id of an event
                        </DialogContentText>

                        <form
                            onSubmit={handleSubmit}
                            id="add-guest-form">
                            <TextField 
                                required
                                margin="dense"
                                id="id"
                                name="id"
                                label="Event Id"
                                fullWidth
                                variant="standard"
                                autoFocus
                            />
                            <TextField
                                required
                                margin="dense"
                                id="utorid"
                                name="utorid"
                                label="UtorId of the Guest"
                                fullWidth
                                variant="standard"
                                autoFocus
                            />
                            {!error ? null : <Alert severity="error">{error}</Alert>}
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" form="add-guest-form" variant="contained">
                            Add Guest
                        </Button>
                    </DialogActions>
                    </>
                ) : (
                    <>
                        <DialogTitle>Add Guest to Event</DialogTitle>
                        <DialogContent>
                            <Alert severity="success" sx={{ mb: 2 }}>
                                The user has been added as a guest to event with id {event.id}.
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