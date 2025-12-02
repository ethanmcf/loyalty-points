import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { AddUserDialog } from "../../components/addDialogs/AddUserDialog";
import { AddTransactionDialog } from "../../components/addDialogs/AddTransactionsDialog";
import { ApplyRedemptionTransactionDialog } from "../../components/actionDialogs/ApplyRedemptionTransactionDialog";
import { TypeHistory } from "./VisualizationData";

export function CashierDashboard({transactions}) {
  const navigate = useNavigate();

  const { user } = useUser();
  const [roleView, setRoleView] = useState(user.role);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);

  return (
    <div>
      <div className="dashboard-container">
        <div style={{ flex: 1, minWidth: '300px' }} className="gray">
            <div style={{ padding: '16px', background: '#fff', borderRadius: '8px' }}>
                <TypeHistory transactions={transactions} />
            </div>
        </div>
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