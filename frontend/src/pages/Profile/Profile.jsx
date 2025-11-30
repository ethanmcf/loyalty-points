import "./Profile.css";
import { useUser } from "../../contexts/UserContext";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import {
  PromotionsManagerColumns,
  PromotionsRegularColumns,
} from "../../components/data-table/DataTableConstants";
import { DataTable } from "../../components/data-table/DataTable";
import PersonalIfno from "./PersonalIfno";
import UpdateInfo from "./UpdateInfo";
import { useEffect } from "react";
import { getMyTransactions } from "../../apis/UsersApi";
import { useState } from "react";

function Profile() {
  const { user } = useUser();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const myTrans = await getMyTransactions(localStorage.getItem("token"));
        setTransactions(myTrans);
      } catch {
        setTransactions([]);
      }
    };
    loadTransactions();
  }, []);

  return (
    <>
      <PersonalIfno />
      <UpdateInfo />
      <div className="content-container">
        <h2>My transactions</h2>
        <DataTable baseURL="/users/me/transactions" roleV={user.role} />
      </div>
      <div className="content-container">
        <h2>My promotions</h2>
        <Box sx={{ width: "100%" }}>
          <DataGrid
            showToolbar
            rows={user.promotions}
            columns={
              user.role === "manager" || user.role === "superuser"
                ? PromotionsManagerColumns
                : PromotionsRegularColumns
            }
            rowCount={user.promotions.length}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            filterMode="server"
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Box>
      </div>
      <div className="content-container">
        <h2>My Events</h2>
        <DataTable baseURL="/events/me/guest" roleV={user.role} />
      </div>
    </>
  );
}

export default Profile;
