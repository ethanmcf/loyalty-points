import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { AddRedemptionTransactionDialog } from "../../components/addDialogs/AddRedemptionTransactionDialog";
import { TypeHistory } from "./VisualizationData";

// Table-related imports
import { DataTable } from "../../components/data-table/DataTable";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { AddUserDialog } from "../../components/addDialogs/AddUserDialog";


export function RegularDashboard({ transactions }) {
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
            <div style={{ flex: 1, minWidth: '300px' }} className="gray">
                <div style={{ padding: '16px', background: '#fff', borderRadius: '8px' }}>
                    <TypeHistory transactions={transactions} />
                </div>
            </div>
          <div className="table-container">
            <h3>
            Recent Transactions
            </h3>
            <div className="filters">
              <FormControl>
                <InputLabel id="demo-simple-select-label"></InputLabel>
              </FormControl>
              <AddRedemptionTransactionDialog />
            </div>
            <div>
              <DataTable baseURL="/users/me/transactions" role="regular" />
            </div>
          </div>
          <div className="action-container">
            <h4>
              Your Points: { user.points }
            </h4>
            <button className="fill-button" onClick={() => navigate("/profile")}>YOUR PROFILE</button>
            <button className="fill-button" onClick={() => navigate("/events")}>YOUR EVENTS</button>
            <button className="fill-button" onClick={() => navigate("/promotions")}>YOUR PROFILE</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegularDashboard;