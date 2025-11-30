import { useUser } from "../../contexts/UserContext";
import { DataTable } from "../../components/data-table/DataTable";
import { useState } from "react";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import "../../styles/tablesPage.css";
import { AddUserDialog } from "../../components/addDialogs/AddUserDialog";
import Tooltip from "@mui/material/Tooltip";

// Table page listing out all the users
export function Users() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div id="user-page" className="page">
      <div className="table-page-header">
        <div className="table-page-title">
          <h2>Users</h2>
          <Tooltip
            title={
              "Below displays the list of users currently in the system. You can edit and manage each user's data by pressing the View Details button."
            }
          >
            <InfoOutlineIcon />
          </Tooltip>
        </div>
        <AddUserDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <DataTable baseURL="/users" role={user.role} isOpen={isOpen} />
    </div>
  );
}
