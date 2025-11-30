import { useUser } from "../../contexts/UserContext";
import { DataTable } from "../../components/data-table/DataTable";
import { AddTransactionDialog } from "../../components/addDialogs/AddTransactionsDialog";
import "../../styles/tablesPage.css";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import { useState } from "react";

// Transactions page listing out all transactions
export function Transactions() {
  // only allows Managers and Superusers to view the list.
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div id="transactions-page" className="page">
      <div className="table-page-header">
        <div className="table-page-title">
          <h2> Transactions </h2>
          <Tooltip
            title={
              "Below displays the list of transactions currently in the system. You can edit and manage each transactions's data by pressing the View Details button."
            }
          >
            <InfoOutlineIcon />
          </Tooltip>
        </div>

        <AddTransactionDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      <DataTable baseURL="/transactions" role={user?.role} isOpen={isOpen} />
    </div>
  );
}
