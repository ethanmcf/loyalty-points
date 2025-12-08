import { useUser } from "../../contexts/UserContext";
import { DataTable } from "../../components/dataTable/DataTable";
import { AddPromotionDialog } from "../../components/addDialogs/AddPromotionsDialog";
import "../../styles/tablesPage.css";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import { useState } from "react";

// Table listing out all the promotions
export function Promotions() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div id="promotions-page" className="page">
      <div className="table-page-header">
        <div className="table-page-title">
          <h2>Promotions</h2>
          <Tooltip
            title={
              "Below displays the list of promotions currently in the system. You can edit and manage each promotion's data by pressing the View Details button."
            }
          >
            <InfoOutlineIcon />
          </Tooltip>
        </div>

        <AddPromotionDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      <DataTable baseURL="/promotions" role={user?.role} isOpen={isOpen} />
    </div>
  );
}
