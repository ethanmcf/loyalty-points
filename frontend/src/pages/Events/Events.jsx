import { useUser } from "../../contexts/UserContext";
import { DataTable } from "../../components/data-table/DataTable";
import { AddEventsDialog } from "../../components/addDialogs/AddEventsDialog";
import "../../styles/tablesPage.css";
import { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";

export function Events() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div id="events-page" className="page">
      <div className="table-page-header">
        <div className="table-page-title">
          <h2>Events</h2>
          {user.role === "cashier" || user.role === "regular" ? (
            <Tooltip
              title={
                "Below displays the list of events that you are organizing. You can manage the guest list or update information you are authorized for."
              }
            >
              <InfoOutlineIcon />
            </Tooltip>
          ) : (
            <Tooltip
              title={
                "Below displays the list of events currently in the system. You can edit and manage each events's data by pressing the View Details button."
              }
            >
              <InfoOutlineIcon />
            </Tooltip>
          )}
        </div>

        <AddEventsDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      <DataTable baseURL="/events" role={user?.role} isOpen={isOpen} />
    </div>
  );
}
