import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";

// Table-related imports
import { DataTable } from "../../components/data-table/DataTable";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { AddUserDialog } from "../../components/addDialogs/AddUserDialog";


export function RegularDashboard() {
  const navigate = useNavigate();

  // get user info
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
            <h3>
            Recent Transactions
            </h3>
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
              <DataTable baseURL="/transactions" role={roleView} />
            </div>
          </div>
          <div className="action-container">
            <h4>
              Your Points: { user.points }
            </h4>
            <button className="fill-button" onClick={() => navigate("/profile")}>Your Profile</button>
            <button className="fill-button" onClick={() => navigate("/events")}>Your Events</button>
            <button className="fill-button" onClick={() => navigate("/promotions")}>Your Promotions</button>
            <button className="fill-button" onClick={() => navigate("/transactions")}>Your Transactions</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegularDashboard;