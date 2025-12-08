import "./Profile.css";
import { useUser } from "../../contexts/UserContext";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import {
  PromotionsManagerColumns,
  PromotionsRegularColumns,
} from "../../components/dataTable/DataTableConstants";
import { DataTable } from "../../components/dataTable/DataTable";
import PersonalIfno from "./PersonalIfno";
import UpdateInfo from "./UpdateInfo";
import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";

function Profile() {
  const { user } = useUser();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  return (
    <>
      {user.suspicious && (
        <Alert
          severity="error"
          sx={{ marginLeft: "3rem", marginRight: "3rem", marginBottom: 2 }}
        >
          ALERT: Your account has been designated as <b>suspicious</b>. If you
          think this is an error, please contact{" "}
          <a href="mailto:superuser@mail.utoronto.ca">
            superuser@mail.utoronto.ca
          </a>
        </Alert>
      )}
      <PersonalIfno />
      <UpdateInfo />
      <div className="content-container">
        <h2>My transactions</h2>
        <DataTable baseURL="/users/me/transactions" role={user.role} />
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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <h2>My Events</h2>
          <Tooltip title="Events I am Attending as a Guest">
            <InfoOutlineIcon />
          </Tooltip>
        </div>

        <DataTable baseURL="/events/me/guest" role={user.role} />
      </div>
    </>
  );
}

export default Profile;
