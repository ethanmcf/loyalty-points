import { useUser } from "../../contexts/UserContext";
import { DataTable } from "../../components/data-table-mui/DataTable";
import { AddTransactionsDialog } from "../../components/addDialogs/AddTransactionsDialog"; 
import "./Transactions.css"; 

export function Transactions() {
    // only allows Managers and Superusers to view the list.
    const { user } = useUser();

    return (
        <div id="transactions-page">
            <div className="table-page-header">
                <h2> Transactions </h2>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "1rem",
                    }}
                >
                    <AddTransactionsDialog />
                    
                </div>
            </div>

            <DataTable 
                baseURL="/transactions" 
                role={user?.role} 
            />
        </div>
    );
}