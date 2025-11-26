import { useUser } from "../../contexts/UserContext";
import { DataTable } from "../../components/data-table/DataTable";
import { AddPromotionDialog } from "../../components/addDialogs/AddPromotionsDialog";
import "./Promotions.css";

export function Promotions() {
  const { user } = useUser();

  return (
    <div id="promotions-page">
      <div className="table-page-header">
        <h2>Promotions</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <AddPromotionDialog />
        </div>
      </div>

      <DataTable baseURL="/promotions" role={user?.role} />
    </div>
  );
}
