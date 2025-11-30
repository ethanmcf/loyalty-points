import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { AddUserDialog } from "../../components/addDialogs/AddUserDialog";
import { AddTransactionDialog } from "../../components/addDialogs/AddTransactionsDialog";
import { ApplyRedemptionTransactionDialog } from "../../components/actionDialogs/ApplyRedemptionTransactionDialog";

export function CashierDashboard() {
  const navigate = useNavigate();

  const { user } = useUser();
  const [roleView, setRoleView] = useState(user.role);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);

  return (
    <div>
      <div className="dashboard-container">
        <div className="main-container">
          <h3>User Management</h3>
          <div className="user-container">
            <AddUserDialog isOpen={isUserOpen} setIsOpen={setIsUserOpen} />
            <AddTransactionDialog
              isOpen={isTransactionsOpen}
              setIsOpen={setIsTransactionsOpen}
            />
            <ApplyRedemptionTransactionDialog />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CashierDashboard;
