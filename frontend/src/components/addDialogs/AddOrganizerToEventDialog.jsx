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
import { getUserById } from "../../apis/UsersApi";

/* 
* This Dialog is for adding an organizer to an Event.
* Only for managers and superusers.
*/
export function AddOrganizerToEventDialog() {
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [event, setEvent] = useState();
    const [organizer, setOrganizer ] = useState();
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

        const eventId = formJson.id ? Number(formJson.id) : null;
        const utorid = formJson.utorid;

        if (!canProcess) return;

        try {
            const res = await getSingleEvent(localStorage.token, eventId);
            if (!res) {
                setError("Invalid event Id");
                return;
            }
            await postOrganizerToEvent(localStorage.token, eventId, utorid);
            setEvent(res);
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
                Add an organizer to an event
            </Button>

            <Dialog open={isOpen} onClose={handleClose}>
                {!event ? (
                    <>
                    <DialogTitle>Add a new organizer to an event</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Insert the id of an event to 
                        </DialogContentText>

                        <form
                            onSubmit={handleSubmit}
                            id="add-organizer-form">
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
                                label="UtorId of the organizer"
                                fullWidth
                                variant="standard"
                                autoFocus
                            />
                        </form>
                        {!error ? null : <Alert severity="error">{error}</Alert>}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" form="add-organizer-form" variant="contained">
                            Add Organizer
                        </Button>
                    </DialogActions>
                    </>
                ) : (
                    <>
                        <DialogTitle>Add Event Organizer</DialogTitle>
                        <DialogContent>
                            <Alert severity="success" sx={{ mb: 2 }}>
                                the user has been added as the organizer to event with id {event.id}.
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