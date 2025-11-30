import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { AddTransactionDialog } from "../../components/addDialogs/AddTransactionsDialog";
import { AddEventsDialog } from "../../components/addDialogs/AddEventsDialog";
import { MarkTransactionSuspicious } from "../../components/actionDialogs/MarkTransactionSuspicious";
import { AddOrganizerToEventDialog } from "../../components/addDialogs/AddOrganizerToEventDialog";

// Table-related imports
import { DataTable } from "../../components/data-table/DataTable";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { AddGuestToEventDialog } from "../../components/addDialogs/AddGuestToEventDialog";
import { VerifyUserDialog } from "../../components/actionDialogs/VerifyUserDialog";
import { MarkCashierSuspiciousDialog } from "../../components/actionDialogs/MarkCashierSuspiciousDialog";
import { PromoteUserDialog } from "../../components/actionDialogs/PromoteUserDialog";

export function ManagerDashboard() {
  const navigate = useNavigate();

  const { user } = useUser();
  const [roleView, setRoleView] = useState(user.role);

  const handleRoleChange = (event) => {
    setRoleView(event.target.value);
  };

  return (
    <div>
      <div className="dashboard-container">
        <div className="info-container">
          <div className="user-management gray">
            <h3>User Management</h3>
            <div className="user-container">
                {/* mark transaction as suspicious */}
                <MarkTransactionSuspicious />
                {/* add event organizers */}
                <AddOrganizerToEventDialog />
                {/* add guests to an event */}
                <AddGuestToEventDialog />
                {/* remove guests from an event */}
                {/* Verify a user */}
                <VerifyUserDialog />
                {/* make a cashier suspicious */}
                <MarkCashierSuspiciousDialog />
                {/* promote/demote users */}
                <PromoteUserDialog />
            </div>
          </div>
          <div className="table-container">
            <div className="filters">
            </div>
            <div>
              <h3>All Events</h3>
              <DataTable baseURL="/events" role={roleView} />
              <h3>All Promotions</h3>
              <DataTable baseURL="/promotions" role={roleView} />
              <h3>All users</h3>
              <DataTable baseURL="/users" role={roleView} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;
