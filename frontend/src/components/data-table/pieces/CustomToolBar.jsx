import {
  Toolbar,
  ToolbarButton,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  GridDeleteIcon,
  ExportCsv,
  ExportPrint,
} from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useState, useRef, useEffect } from "react";
import { GridToolbarDivider } from "@mui/x-data-grid/internals";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PrintIcon from "@mui/icons-material/Print";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { deletePromotion } from "../../../apis/promotionsApis";
import { deleteSingleEvent } from "../../../apis/EventsApi";

// Reference: https://mui.com/x/react-data-grid/components/toolbar/
export function CustomToolBar(props) {
  const { rowSelectionModel, baseURL } = props;
  const [open, setOpen] = useState(false);
  const [error, setError] = useState();
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  useEffect(() => {
    console.log("row selection changed: ", rowSelectionModel);
  }, [rowSelectionModel]);

  const handleClickOpen = () => {
    setOpen(true);
    console.log("Deleting the IDS: ", rowSelectionModel.ids);
  };

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    [...rowSelectionModel.ids].forEach(async (id) => {
      try {
        if (baseURL === "/promotions") {
          await deletePromotion(localStorage.token, id);
        } else if (baseURL === "/events" || baseURL === "/events/me/guest") {
          await deleteSingleEvent(id, localStorage.token);
        }
      } catch (error) {
        setError(error.message);
        setIsErrorDialogOpen(true);
        setOpen(false);
      }
    });
  };

  const handleCloseErrorDialog = (e) => {
    e.preventDefault();
    setIsErrorDialogOpen(false);
    setError(null);
  };
  return (
    <>
      <Toolbar>
        {baseURL !== "/users" &&
          baseURL !== "/transactions" &&
          baseURL !== "/transactions?type=event" &&
          baseURL !== "/users/me/transactions" && (
            <ToolbarButton
              onClick={handleClickOpen}
              disabled={
                !(
                  (rowSelectionModel.ids.size > 0 &&
                    rowSelectionModel.type === "include") ||
                  (rowSelectionModel.ids.size === 0 &&
                    rowSelectionModel.type === "exclude")
                )
              }
            >
              <GridDeleteIcon />
            </ToolbarButton>
          )}
        <GridToolbarDivider />
        <Tooltip title="Columns">
          <ColumnsPanelTrigger render={<ToolbarButton />}>
            <ViewColumnIcon fontSize="small" />
          </ColumnsPanelTrigger>
        </Tooltip>

        <Tooltip title="Filters">
          <FilterPanelTrigger
            render={(props, state) => (
              <ToolbarButton {...props} color="default">
                <Badge
                  badgeContent={state.filterCount}
                  color="primary"
                  variant="dot"
                >
                  <FilterListIcon fontSize="small" />
                </Badge>
              </ToolbarButton>
            )}
          />
        </Tooltip>
        <GridToolbarDivider />
        {/* Reference: https://mui.com/x/react-data-grid/components/export/ */}
        <ExportCsv render={<ToolbarButton />}>
          <FileDownloadIcon fontSize="small" />
        </ExportCsv>
        <ExportPrint render={<ToolbarButton />}>
          <PrintIcon fontSize="small" />
        </ExportPrint>
      </Toolbar>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Deleting {rowSelectionModel.ids.size} Items</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please confirm that you are deleting the items with the following
            ids: {JSON.stringify([...rowSelectionModel.ids])}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isErrorDialogOpen} onClose={handleCloseErrorDialog}>
        <DialogTitle>Deleting Error</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A few of your items were unable to be deleted due to the error:
            <span style={{ color: "red" }}>{error}</span>. However, the other
            ones have been successful.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleCloseErrorDialog}>
            I understand.
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
