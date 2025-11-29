import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { AddTransactionDialog } from "../../components/addDialogs/AddTransactionsDialog";
import { AddEventsDialog } from "../../components/addDialogs/AddEventsDialog";

// Table-related imports
import { DataTable } from "../../components/data-table/DataTable";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

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
          <div className="table-container">
            <div className="filters">
              <FormControl>
                <InputLabel id="demo-simple-select-label"></InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={roleView}
                  label="Role View"
                  onChange={handleRoleChange}
                >
                  <MenuItem value={"regular"}>Regular</MenuItem>
                  <MenuItem value={"cashier"}>Cashier</MenuItem>
                  <MenuItem value={"manager"}>Manager</MenuItem>
                  <MenuItem value={"superuser"}>SuperUser</MenuItem>
                </Select>
              </FormControl>
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
          <div className="action-container">
            <button
              className="fill-button"
              onClick={() => navigate("/profile")}
            >
              Your Profile
            </button>
            <button className="fill-button" onClick={() => navigate("/events")}>
              Your Events
            </button>
            <button
              className="fill-button"
              onClick={() => navigate("/promotions")}
            >
              Your Promotions
            </button>
            <button
              className="fill-button"
              onClick={() => navigate("/transactions")}
            >
              Your Transactions
            </button>
            <div className="transactions-container">
              <AddTransactionDialog />
            </div>
            <div className="events-container">
              {/* Have to add event, add guests to event, add organizer, remove guest, award points to guests */}
              <AddEventsDialog />
            </div>
            <div className="users-container"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;
