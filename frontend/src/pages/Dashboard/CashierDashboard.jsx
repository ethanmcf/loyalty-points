import "./Dashboard.css";
import { useState } from "react";
import { AddUserDialog } from "../../components/addDialogs/AddUserDialog";
import { AddTransactionDialog } from "../../components/addDialogs/AddTransactionsDialog";
import { ApplyRedemptionTransactionDialog } from "../../components/actionDialogs/ApplyRedemptionTransactionDialog";
import { TypeHistory } from "./VisualizationData";
import { ActivityOverview } from "./DashboardActivity"; 

export function CashierDashboard({transactions}) {

  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);

  return (
    <div>
      <div className="dashboard-container">
        <ActivityOverview transactions={transactions} /> 
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