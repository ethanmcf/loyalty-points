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
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import FolderIcon from "@mui/icons-material/Folder";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
// Reference: https://mui.com/x/react-data-grid/components/toolbar/
export function CustomToolBar(props) {
  const { rowSelectionModel, baseURL, handleBookmarkFilter, setFilterModel } =
    props;
  const [open, setOpen] = useState(false);
  const [error, setError] = useState();
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [filename, setFileName] = useState("");
  const [isFilterListOpen, setIsFilterListOpen] = useState(null);

  const handleOpenFilterList = (e) => {
    setIsFilterListOpen(e.currentTarget);
  };

  const handleCloseFilterList = () => {
    setIsFilterListOpen(null);
  };

  const handleLoadFilterList = (params) => {
    setFilterModel({ items: params });
  };

  useEffect(() => {
    if (baseURL.includes("event")) {
      setFileName("Events");
    } else if (baseURL.includes("promotion")) {
      setFileName("Promotions");
    } else if (baseURL.includes("transaction")) {
      setFileName("Transactions");
    } else if (baseURL.includes("/users")) {
      setFileName("Users");
    }
  }, []);
  const handleClickOpen = () => {
    setOpen(true);
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

  // Reference: https://mui.com/material-ui/react-menu/
  console.log(JSON.parse(JSON.parse(localStorage[baseURL])[0]));
  return (
    <>
      <Toolbar>
        <ToolbarButton
          onClick={handleOpenFilterList}
          disabled={!localStorage[baseURL]}
        >
          <Tooltip title="Open Saved Filters">
            <FolderIcon />
          </Tooltip>
        </ToolbarButton>
        {localStorage[baseURL] && (
          <Menu
            slotProps={{
              paper: {
                style: {
                  maxHeight: 48 * 4.5,
                  maxWidth: "20ch",
                  overflow: "scroll",
                },
              },
            }}
            anchorEl={isFilterListOpen}
            open={Boolean(isFilterListOpen)}
            onClose={handleCloseFilterList}
          >
            {JSON.parse(localStorage[baseURL]).map((params, menuItemIndex) => (
              <MenuItem
                key={menuItemIndex}
                onClick={() => handleLoadFilterList(JSON.parse(params))}
              >
                meow
                {/* {params.split("&").map((param, paramIndex) => (
                  <Chip key={paramIndex} label={param} sx={{ margin: 1 }} />
                ))} */}
              </MenuItem>
            ))}
          </Menu>
        )}
        <ToolbarButton onClick={handleBookmarkFilter}>
          <Tooltip title="Save Filter for this session.">
            <BookmarkAddIcon />
          </Tooltip>
        </ToolbarButton>

        {baseURL !== "/users" &&
          baseURL !== "/transactions" &&
          baseURL !== "/transactions?type=event" &&
          baseURL !== "/users/me/transactions" && (
            <>
              <GridToolbarDivider />
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
            </>
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
        <ExportCsv render={<ToolbarButton />} options={{ filename: filename }}>
          <Tooltip title="Download as CSV File">
            <FileDownloadIcon fontSize="small" />
          </Tooltip>
        </ExportCsv>
        <ExportPrint render={<ToolbarButton />}>
          <Tooltip title="Print as PDF">
            <PrintIcon fontSize="small" />
          </Tooltip>
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
