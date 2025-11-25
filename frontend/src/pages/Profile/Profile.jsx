import "./Profile.css";
import { useUser } from "../../contexts/UserContext";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import {
  PromotionsManagerColumns,
  PromotionsRegularColumns,
  TransactionColumns,
} from "../../components/data-table-mui/DataTableConstants";
import { useState } from "react";

import PersonalIfno from "./PersonalIfno";
import UpdateInfo from "./UpdateInfo";
import { useEffect } from "react";
import { getMyTransactions } from "../../apis/UsersApi";

function Profile() {
  const { user } = useUser();
  const [transactions, setTransactions] = useState([]);
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
        <Box sx={{ width: "100%" }}>
          <DataGrid
            showToolbar
            rows={transactions.results}
            columns={TransactionColumns}
            rowCount={transactions.count}
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
    </>
  );
}

export default Profile;
