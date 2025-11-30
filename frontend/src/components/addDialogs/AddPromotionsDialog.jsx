import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import { createPromotion } from "../../apis/promotionsApis";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";

export function AddPromotionDialog() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [createdPromotion, setCreatedPromotion] = useState();
  const [error, setError] = useState();

  // Only Managers and Superusers can use this dialog
  const canAdd = user?.role === "manager" || user?.role === "superuser";

  const handleClickOpen = () => {
    if (canAdd) {
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setCreatedPromotion(null);
    setIsCreated(false);
    setError(null);
    // TODO: find out state management
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    // ?? Not sure if we should do this but I converted necessary fields to numbers, using undefined or null if not applicable/zero.
    // The backend handles undefined/null correctly, it but expects positive numbers for these.
    const payload = {
      name: formJson.name,
      description: formJson.description,
      type: formJson.type,
      startTime: formJson.startTime,
      endTime: formJson.endTime,
      minSpending: formJson.minSpending
        ? Number(formJson.minSpending)
        : undefined,
      rate: formJson.rate ? Number(formJson.rate) : undefined,
      points: formJson.points ? Number(formJson.points) : undefined,
    };

    // The createPromotion function we defined takes a single payload object
    try {
      const res = await createPromotion(localStorage.token, payload);

      setCreatedPromotion(res);
      setIsCreated(true);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen} disabled={!canAdd}>
        Add New Promotion
      </Button>

      <Dialog open={isOpen} onClose={handleClose}>
        {!isCreated ? (
          <>
            <DialogTitle>Add a new promotion</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please fill out the following form to create a new promotion.
              </DialogContentText>

              <form
                onSubmit={handleSubmit}
                id="new-promotion-form"
                style={{ marginBottom: "5px" }}
              >
                {/* Required Fields */}
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="name"
                  name="name"
                  label="Promotion Name"
                  type="text"
                  fullWidth
                  variant="standard"
                />
                <TextField
                  required
                  margin="dense"
                  id="description"
                  name="description"
                  label="Description"
                  type="text"
                  multiline
                  rows={2}
                  fullWidth
                  variant="standard"
                />
                <TextField
                  select
                  required
                  margin="dense"
                  id="type"
                  name="type"
                  label="Promotion Type"
                  defaultValue="automatic" // Set default value
                  fullWidth
                  variant="standard" // not sure if the menu items below are ok or if we should replace with something else?
                >
                  <MenuItem value="automatic">Automatic</MenuItem>
                  <MenuItem value="onetime">One-Time</MenuItem>
                </TextField>

                {/* Date/Time Fields */}
                <TextField
                  required
                  margin="dense"
                  id="startTime"
                  name="startTime"
                  label="Start Time"
                  type="datetime-local"
                  fullWidth
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  required
                  margin="dense"
                  id="endTime"
                  name="endTime"
                  label="End Time"
                  type="datetime-local"
                  fullWidth
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                />

                {/* Optional Numeric Fields */}
                <TextField
                  margin="dense"
                  id="minSpending"
                  name="minSpending"
                  label="Minimum Spending (Optional, numeric)"
                  type="number"
                  fullWidth
                  variant="standard"
                  inputProps={{ min: 0 }}
                />
                <TextField
                  margin="dense"
                  id="rate"
                  name="rate"
                  label="Discount Rate (Optional, e.g., 0.2 for 20%)"
                  type="number"
                  fullWidth
                  variant="standard"
                  inputProps={{ step: "any", min: 0 }}
                />
                <TextField
                  margin="dense"
                  id="points"
                  name="points"
                  label="Points Awarded (Optional, numeric)"
                  type="number"
                  fullWidth
                  variant="standard"
                  inputProps={{ min: 0 }}
                />
              </form>

              {!error ? null : <Alert severity="error">{error}</Alert>}
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" form="new-promotion-form">
                Create Promotion
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle style={{}}>Promotion Created</DialogTitle>
            <DialogContent>
              <div>
                {Object.keys(createdPromotion).map((prop, index) => (
                  <div key={index}>
                    <b>{prop}: </b>
                    {/* formatting date properties for readability */}
                    {prop === "startTime" || prop === "endTime"
                      ? new Date(createdPromotion[prop]).toLocaleString()
                      : createdPromotion[prop].toString()}
                  </div>
                ))}
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} variant="outlined">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
