import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { useUser } from "../../contexts/UserContext";
import { getPromotionById, deletePromotion } from "../../apis/PromotionsApi";

export function DeletePromotionsDialog({ id }) {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [deletedPromotion, setDeletedPromotion] = useState();
  const [canDelete, setCanDelete] = useState(
    user.role === "manager" || user.role === "superuser"
  );
  const fetchPromotion = async () => {
    try {
      const res = await getPromotionById(localStorage.getItem("token"), id);
      setDeletedPromotion(res);
      const currentTime = new Date();
      const startDateTime = new Date(res.startTime);
      const endDateTime = new Date(res.endTime);

      if (startDateTime <= currentTime || endDateTime <= currentTime) {
        setCanDelete(false);
      }
    } catch (error) {
      console.error(error);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    fetchPromotion();
  }, [id]);

  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDelete = async () => {
    // adding the delete API call
    try {
      await deletePromotion(localStorage.token, id);
      window.location.reload();
      handleClose();
    } catch (error) {
      console.error("Promotion deletion failed:", error);
    }
  };

  return (
    <>
      <Button variant="icon" onClick={handleClickOpen} disabled={!canDelete}>
        <DeleteIcon color={canDelete ? "error" : "disabled"} />
      </Button>
      {deletedPromotion && (
        <Dialog open={isOpen} onClose={handleClose}>
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogContent>
            Please confirm that you would like to delete the following
            promotion:
            <p>
              <b>Name:</b> {deletedPromotion.name}
            </p>
            <p>
              <b>Type:</b> {deletedPromotion.type}
            </p>
            <p>
              <b>Starts:</b>
              {new Date(deletedPromotion.startTime).toLocaleDateString()}
            </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleDelete}>Delete</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
