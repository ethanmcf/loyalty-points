import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { registerUser } from "../../apis/UsersApi";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import { useUser } from "../../contexts/UserContext";

export function AddUserDialog({ isOpen, setIsOpen }) {
  const { user } = useUser();
  const [isCreated, setIsCreated] = useState(false);
  const [createdUser, setCreatedUser] = useState();
  const [error, setError] = useState();
  const canAdd = user?.role === "manager" || user?.role === "superuser";

  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setCreatedUser(null);
    setIsCreated(false);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    try {
      const res = await registerUser(
        localStorage.token,
        formJson.utorid,
        formJson.name,
        formJson.email
      );

      setCreatedUser(res);
      setIsCreated(true);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      {canAdd && (
        <>
          <IconButton sx={{ display: { xs: "flex", md: "none" } }}>
            <AddIcon onClick={handleClickOpen} />
          </IconButton>
          <Button
            sx={{ display: { xs: "none", md: "flex" } }}
            variant="text"
            onClick={handleClickOpen}
          >
            Add New User
          </Button>
        </>
      )}

      <Dialog open={isOpen} onClose={handleClose}>
        {!isCreated ? (
          <>
            <DialogTitle>Add a new user</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please fill out the following form to add a new user to the
                system.
              </DialogContentText>

              <form
                onSubmit={handleSubmit}
                id="new-user-form"
                style={{ marginBottom: "5px" }}
              >
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="utorid"
                  name="utorid"
                  label="UtorID"
                  type="text"
                  fullWidth
                  variant="standard"
                />
                <TextField
                  required
                  margin="dense"
                  id="name"
                  name="name"
                  label="Name"
                  type="text"
                  fullWidth
                  variant="standard"
                />
                <TextField
                  required
                  margin="dense"
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="standard"
                />
              </form>
              {!error ? null : <Alert severity="error">{error}</Alert>}
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" form="new-user-form">
                Create User
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>User Created</DialogTitle>
            <DialogContent>
              <div>
                {Object.keys(createdUser).map((userProperty, index) => (
                  <div key={index}>
                    <b>{userProperty}: </b>
                    {createdUser[userProperty]}
                  </div>
                ))}
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
