import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import { createNewTransaction } from "../../apis/TransactionsApi";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
/**
 * Create a new Purchase or Adjustment transaction.
 */
export function AddTransactionDialog({
  isOpen,
  setIsOpen,
  preFilledRelatedId,
}) {
  const { user } = useUser();

  const [isCreated, setIsCreated] = useState(false);
  const [createdTransaction, setCreatedTransaction] = useState();
  const [error, setError] = useState();
  const [transactionType, setTransactionType] = preFilledRelatedId
    ? useState("adjustment")
    : useState("purchase");

  // Only Cashiers, Managers, and Superusers can create transactions
  const canAdd = user?.role !== "regular";

  const handleClickOpen = () => {
    if (canAdd) {
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setCreatedTransaction(null);
    setIsCreated(false);
    setError(null);
    setTransactionType("purchase"); // Reset type to default
  };

  const handleTypeChange = (e) => {
    setTransactionType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    setError(null);

    // Convert numbers and ensure correct formatting or null
    const spent = formJson.spent ? Number(formJson.spent) : undefined;
    const amount = formJson.amount ? Number(formJson.amount) : undefined;
    const relatedId = formJson.relatedId
      ? Number(formJson.relatedId)
      : undefined;

    let promotionIds = [];
    if (formJson.promotionIds) {
      // Assume promotionIds is a comma-separated string from a single TextField
      promotionIds = formJson.promotionIds
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id)
        .map(Number);
    }

    try {
      // The createNewTransaction API function expects separate arguments:
      console.log(promotionIds);
      const res = await createNewTransaction(
        localStorage.token,
        formJson.utorid,
        transactionType,
        spent,
        amount,
        promotionIds.length > 0 ? promotionIds : undefined, // pass undefined if empty
        formJson.remark,
        relatedId
      );

      setCreatedTransaction(res);
      setIsCreated(true);
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  return (
    <>
      {canAdd && (
        <>
          <IconButton sx={{ display: { xs: "flex", md: "none" } }}>
            <AddIcon onClick={handleClickOpen} disabled={!canAdd} />
          </IconButton>
          <Button
            sx={{ display: { xs: "none", md: "flex" } }}
            variant="text"
            onClick={handleClickOpen}
            disabled={!canAdd}
          >
            Add New Transaction
          </Button>
        </>
      )}

      <Dialog open={isOpen} onClose={handleClose}>
        {!isCreated ? (
          <>
            <DialogTitle>Create a new transaction</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please select the transaction type and fill out the following
                form.
              </DialogContentText>

              {/* Type Selector */}
              <TextField
                select
                required
                margin="dense"
                id="type"
                name="type"
                label="Transaction Type"
                value={transactionType}
                onChange={handleTypeChange}
                fullWidth
                variant="standard"
              >
                <MenuItem value="purchase">Purchase (Earn Points)</MenuItem>
                {/* Adjustment is manager/superuser only, the button is disabled for regular user */}
                <MenuItem value="adjustment">
                  Adjustment (Add/Deduct Points)
                </MenuItem>
              </TextField>

              <form
                onSubmit={handleSubmit}
                id="new-transaction-form"
                style={{ marginBottom: "5px" }}
              >
                <TextField
                  required
                  margin="dense"
                  id="utorid"
                  name="utorid"
                  label="Affected User UtorID"
                  type="text"
                  fullWidth
                  variant="standard"
                />

                {transactionType === "purchase" && (
                  <>
                    <TextField
                      required
                      margin="dense"
                      id="spent"
                      name="spent"
                      label="Amount Spent ($)"
                      type="number"
                      fullWidth
                      variant="standard"
                      slotProps={{ input: { step: "0.01", min: 0 } }}
                    />
                    <DialogContentText sx={{ mt: 2 }}>
                      Points are calculated automatically based on amount spent
                      and promotions.
                    </DialogContentText>
                  </>
                )}

                {transactionType === "adjustment" && (
                  <>
                    <TextField
                      required
                      margin="dense"
                      id="amount"
                      name="amount"
                      label="Points Amount (Positive to add, Negative to deduct)"
                      type="number"
                      fullWidth
                      variant="standard"
                    />
                    <TextField
                      required
                      margin="dense"
                      id="relatedId"
                      name="relatedId"
                      label="Related Transaction ID (for adjustment reference)"
                      type="number"
                      fullWidth
                      variant="standard"
                      slotProps={{ input: { min: 1 } }}
                      value={preFilledRelatedId}
                      disabled={!!preFilledRelatedId}
                    />
                  </>
                )}

                {/* Optional Common Fields */}
                <TextField
                  margin="dense"
                  id="promotionIds"
                  name="promotionIds"
                  label="Promotion IDs (comma-separated, optional)"
                  type="text"
                  fullWidth
                  variant="standard"
                  helperText="Example: 101, 102"
                />
                <TextField
                  margin="dense"
                  id="remark"
                  name="remark"
                  label="Remark (Optional)"
                  type="text"
                  fullWidth
                  variant="standard"
                />

                {/* I believe these are required by API but not needed in form*/}
                {transactionType === "purchase" && (
                  <input type="hidden" name="amount" value={0} />
                )}
                {transactionType === "adjustment" && (
                  <input type="hidden" name="spent" value={0} />
                )}
              </form>

              {!error ? null : <Alert severity="error">{error}</Alert>}
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" form="new-transaction-form">
                Create{" "}
                {transactionType.charAt(0).toUpperCase() +
                  transactionType.slice(1)}
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>Transaction Created</DialogTitle>
            <DialogContent>
              <div>
                {Object.keys(createdTransaction).map((prop, index) => (
                  <div key={index}>
                    <b>{prop}: </b>
                    {Array.isArray(createdTransaction[prop])
                      ? createdTransaction[prop].join(", ")
                      : createdTransaction[prop].toString()}
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
