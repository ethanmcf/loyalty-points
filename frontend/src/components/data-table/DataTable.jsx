import { useCallback, useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { CustomToolBar } from "./pieces/CustomToolBar";

import {
  EventManagerColumns,
  EventRegularColumns,
  PromotionsManagerColumns,
  PromotionsRegularColumns,
  TransactionColumns,
  UserColumns,
  UserTransactionsColumns,
} from "./DataTableConstants";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const baseUrlTypes = [
  "/users",
  "/transactions",
  "/transactions?type=event",
  "/events",
  "/promotions",
  "/users/me/transactions",
  "/events/me/guest",
];
/**
 *
 * @typedef {Object} DataTableProps
 * @property {"/users" | "/transactions" | "/transactions?type=event" | "/events" | "/promotions" | "/users/me/transactions" | "/events/me/guest" } baseURL The type of table we are using this for (i.e. events, users, etc.)
 * @property {roleType} role
 * @property {boolean} isOpen // the variable controlling dialog for refetching data related to adding dialogs
 */

/**
 * This Table uses server side filtering and pagination
 * @param {DataTableProps} props
 * @returns A table with filters and sorting
 *  @reference https://mui.com/x/api/data-grid/data-grid/
 */
export function DataTable({ baseURL, role, isOpen }) {
  // Use State Values
  const { user } = useUser();
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [columns, setColumns] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [savedFilters, setSavedFilters] = useState(
    JSON.parse(localStorage.getItem(baseURL)) ?? []
  );

  const [paginationModel, setPaginationModel] = useState({
    page: 0, // default is 1 (when we call the api, we are going to add one)
    pageSize: 10, // default is 10, this is called Limit in the API call
  });
  const [filterModel, setFilterModel] = useState({
    items: [],
  });

  /* ======== MultiSelect Functionality ============= */
  // Multiselect functions: https://mui.com/x/react-data-grid/row-selection/
  const [rowSelectionModel, setRowSelectionModel] = useState({
    type: "include",
    ids: new Set(),
  });

  /* ============= GENERATE PARAMS ==================== */
  const generateParams = () => {
    // Reference: https://mui.com/x/react-data-grid/filtering/server-side/
    const filters = filterModel.items; // this is a list

    const params = new URLSearchParams({
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
    });

    // Make them into strings that work
    filters.forEach((filter) => {
      if (!filter.value) {
        return;
      }

      // Go through filtering restrictions
      if (baseURL === "/transactions") {
        if (filters.find((filter) => filter.field === "relatedId")) {
          if (!filters.find((filter) => filter.field === "type")) {
            return; // RelatedId must be used with type
          }
        }

        if (filter.field === "amount") {
          if (filter.operator === ">") {
            params.set("operator", "gte");
          } else if (filter.operator === "<") {
            params.set("operator", "lte");
          }
        }
      }

      // successful setting
      params.set(filter.field, filter.value);
    });

    // for events, only get the ones they are responsible for for non-manager/superusers
    if (role !== "manager" && role !== "superuser") {
      params.set("organizerId", user.id);
    }

    // for viewing personal events
    if (baseURL === "/events/me/guest") {
      params.set("guestId", user.id);
      baseURL = "/events";
    }

    return params.toString();
  };

  /* ========= Fetching Data ========================== */
  // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  const fetchData = async () => {
    setIsLoading(true);

    // step 1: get the filters and pagination
    const generatedParams = generateParams();

    // step 2: set up url
    const url = `${VITE_BACKEND_URL}${baseURL}?${generatedParams}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
    });

    const resJSON = await res.json();

    if (!res.ok) {
      // error
      console.error("Error: ", resJSON.message);
    }
    // on success
    setRows(resJSON.results);
    setRowCount(resJSON.count);
  };

  useEffect(() => {
    if (!baseUrlTypes.includes(baseURL)) {
      setError("Invalid baseURL.");
    } else {
      setError(null);
    }

    // step 1: generate columns
    const newColumns = generateColumns();
    setColumns(newColumns);

    // step 2: fetch data
    fetchData();

    setIsLoading(false);
  }, [baseURL, paginationModel, filterModel, isOpen]);

  const fetchSavedFilter = async (baseURL, params) => {
    const url = `${VITE_BACKEND_URL}${baseURL}?${params}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
    });

    const resJSON = await res.json();

    if (!res.ok) {
      // error
      console.error("Error: ", resJSON.message);
    }
    // on success
    setRows(resJSON.results);
    setRowCount(resJSON.count);
  };

  // generates the columns to match MUI expected structure
  function generateColumns() {
    let newColumns = [];
    if (baseURL === "/users") {
      newColumns = UserColumns;
    } else if (
      baseURL === "/transactions" ||
      baseURL === "/transactions?type=event"
    ) {
      newColumns = TransactionColumns;
    } else if (baseURL === "/events" || baseURL === "/events/me/guest") {
      if (role === "regular" || role === "cashier") {
        // Type 1: Regular User
        newColumns = EventRegularColumns;
      } else {
        // Type 2: Manager and Higher
        newColumns = EventManagerColumns;
      }
    } else if (baseURL === "/promotions") {
      // make new custom endpoint
      if (role === "regular" || role === "cashier") {
        // Type 1: Regular User
        newColumns = PromotionsRegularColumns;
      } else {
        // Type 2: Manager and higher
        newColumns = PromotionsManagerColumns;
      }
    } else if (baseURL === "/users/me/transactions") {
      newColumns = UserTransactionsColumns;
    } else {
      console.error("Cannot recognize type: ", baseURL);
      return;
    }

    return newColumns;
  }

  /* =============== HANDLING FILTERS =================== */
  const handleBookmarkFilter = () => {
    const generatedParams = generateParams();
    const newSavedFilters = [...savedFilters];
    newSavedFilters.push(generatedParams);
    setSavedFilters(newSavedFilters);
    localStorage.setItem(baseURL, JSON.stringify(newSavedFilters));
    console.log(localStorage);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {error && <Alert severity="error">{error}</Alert>}

      <DataGrid
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        disableRowSelectionExcludeModel
        slots={{ toolbar: CustomToolBar }}
        slotProps={{
          toolbar: {
            rowSelectionModel,
            baseURL,
            handleBookmarkFilter,
            fetchSavedFilter,
          },
        }}
        rowSelectionModel={rowSelectionModel}
        checkboxSelection={
          baseURL === "/events" ||
          baseURL === "/events/me/guest" ||
          baseURL === "/promotions"
        }
        showToolbar
        rows={rows}
        columns={columns}
        rowCount={rowCount}
        loading={IsLoading}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        filterModel={filterModel}
        onFilterModelChange={setFilterModel}
        filterMode="server"
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Box>
  );
}
