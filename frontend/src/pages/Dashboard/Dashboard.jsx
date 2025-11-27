import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { NavLink } from "react-router-dom";
import RegularDashboard from "./RegularDashboard";
import ManagerDashboard from "./ManagerDashboard";
import CashierDashboard from "./CashierDashboard";

// // Table-related imports
// import { DataTable } from "../../components/data-table-mui/DataTable";
// import FormControl from "@mui/material/FormControl";
// import InputLabel from "@mui/material/InputLabel";
// import Select from "@mui/material/Select";
// import MenuItem from "@mui/material/MenuItem";
// import { AddUserDialog } from "../../components/addDialogs/AddUserDialog";


export function Dashboard() {
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
        <div className="title-container">
          <h2>Dashboard</h2>
          <h3>
            Hi { user.name }!
          </h3>
        </div>
        {user.role === "superuser" && (
          <ManagerDashboard />
        )}

        {user.role === "manager" && (
          <ManagerDashboard />
        )}

        {user.role === "regular" && (
          <RegularDashboard />
        )}

        {user.role === "cashier" && (
          <CashierDashboard />
        )}
      </div>
    </div>
  );
}

export default Dashboard;