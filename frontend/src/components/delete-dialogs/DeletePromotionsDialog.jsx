import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { useUser } from "../../contexts/UserContext";
import { getPromotionById, deletePromotion } from "../../apis/promotionsApi";

export function DeletePromotionDialog({ id }) {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [deletedPromotion, setDeletedPromotion] = useState();

  const fetchPromotion = async () => {
    try {
      const res = await getPromotionById(user.token, id);
      setDeletedPromotion(res);
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
    // TODO based on state management
    window.location.reload(); 
  };

  const handleDelete = async () => {
    // adding the delete API call
    try {
        await deletePromotion(user.token, id);
        handleClose();
    } catch (error) {
        console.error("Promotion deletion failed:", error);
        //TODO need to show actual error msg not one console?
    }
  };

  return (
    <>
      <Button variant="icon" onClick={handleClickOpen}>
        <DeleteIcon color="error" />
      </Button>
      {deletedPromotion && (
        <Dialog open={isOpen} onClose={handleClose}>
          <DialogTitle>Delete Confirmation</DialogTitle>
          <DialogContent>
            Please confirm that you would like to delete the following promotion:
            <p>
              <b>Name:</b> {deletedPromotion.name}
            </p>
            <p>
              <b>Type:</b> {deletedPromotion.type}
            </p>
            <p>
              <b>Starts:</b> {new Date(deletedPromotion.startTime).toLocaleDateString()}
            </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button> 
            <Button onClick={handleDelete}> 
                Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}