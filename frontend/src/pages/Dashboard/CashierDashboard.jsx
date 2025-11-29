import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { AddUserDialog } from "../../components/addDialogs/AddUserDialog";
import { AddTransactionDialog } from "../../components/addDialogs/AddTransactionsDialog";
import { ProcessRedemptionTransactionsDialog } from "../../components/actionDialogs/ProcessRedemptionTransactionsDialog";

export function CashierDashboard() {
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
                <div className="action-container">
                    <AddUserDialog />
                    <AddTransactionDialog />
                    <ProcessRedemptionTransactionsDialog id='1'/>
                    <button className="fill-button" onClick={() => navigate("/transactions")}>Process a Redemption Request</button>
                </div>
                </div>
            </div>
        </div>
    );
}

export default CashierDashboard;