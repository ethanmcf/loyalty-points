import { useUser } from "../../contexts/UserContext";
import { DataTable } from "../../components/data-table-mui/DataTable";
import { AddPromotionsDialog } from "../../components/addDialogs/AddPromotionsDialog"; 
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
                    <AddPromotionsDialog />
        
                </div>
            </div>

            <DataTable 
                baseURL="/promotions" 
                role={user?.role} 
            />
        </div>
    );
}