import { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import {
  EventManagerColumns,
  EventRegularColumns,
  PromotionsManagerColumns,
  PromotionsRegularColumns,
  TransactionColumns,
  UserColumns,
} from "./DataTableConstants";

const VITE_BACKEND_URL = "BACKENDURL ENV"; // TODO: change this with env

/**
 * @typedef {"/transactions" | "/users" | "/transactions" | "/promotions"} overviewURL The baseURLS that the table supports 
 *

/**
 *
 * @typedef {Object} DataTableProps
 * @property {string} baseURL The type of table we are using this for (i.e. events, users, etc.)
 */

/**
 *
 * @param {DataTableProps} props
 * @returns A table with filters and sorting
 *  * @reference https://mui.com/x/api/data-grid/data-grid/
 */
export function DataTable({ baseURL }) {
  // UserContext
  const { user } = useUser();

  // Use State Values
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [columns, setColumns] = useState();
  const [IsLoading, setIsLoading] = useState(false);
  let role; // TODO: need to get role

  const [paginationModel, setPaginationModel] = useState({
    page: 0, // default is 1 (when we call the api, we are going to add one)
    pageSize: 10, // default is 10, this is called Limit in the API call
  });
  const [filterModel, setFilterModel] = useState({
    items: [],
  });

  // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  const fetchData = async () => {
    setIsLoading(true);

    // step 1: get the filters and pagination

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

    // step 2: set up url
    const url = `${VITE_BACKEND_URL}${baseURL}?${params.toString()}`;
    console.log("URL: ", url);
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
    // TODO: verify the baseURL isnt empty and is valid

    // step 1: generate columns
    const newColumns = generateColumns();
    setColumns(newColumns);

    // step 2: fetch data
    fetchData();

    setIsLoading(false);
  }, [baseURL, paginationModel, filterModel]);

  // generates the columns to match MUI expected structure
  function generateColumns() {
    let newColumns = [];
    if (baseURL === "/users") {
      newColumns = UserColumns;
    } else if (baseURL === "/transactions") {
      newColumns = TransactionColumns;
    } else if (baseURL === "/events") {
      if (user.role === "regular" || user.role === "cashier") {
        // Type 1: Regular User
        newColumns = EventRegularColumns;
      } else {
        // Type 2: Manager and Higher
        newColumns = EventManagerColumns;
      }
    } else if (baseURL === "/promotions") {
      if (user.role === "regular" || user.role === "cashier") {
        // Type 1: Regular User
        newColumns = PromotionsRegularColumns;
      } else {
        // Type 2: Manager and higher
        newColumns = PromotionsManagerColumns;
      }
    } else {
      console.error("Cannot recognize type: ", type);
      return;
    }

    // Reference: https://mui.com/x/react-data-grid/cells/
    if (
      baseURL === "/promotions" ||
      baseURL === "/users" ||
      baseURL === "/events" ||
      baseURL === "/transactions"
    ) {
      const detailsPageColumn = {
        field: "actions",
        headerName: "Actions",
        renderCell: (params) => (
          <strong>
            <Button
              variant="contained"
              size="small"
              style={{ marginLeft: 16 }}
              tabIndex={params.hasFocus ? 0 : -1}
              onClick={() => navigate(`/${type}/${params.row.id}`)}
            >
              View Details
            </Button>
          </strong>
        ),
      };
      newColumns.push(detailsPageColumn);
    }
    return newColumns;
  }

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      loading={IsLoading}
      initialState={{ pagination: { paginationModel } }}
      pageSizeOptions={[5, 10]}
      checkboxSelection
      filterModel={filterModel}
      setFilterModel={setFilterModel}
      filterMode="server"
      paginationMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      sx={{ border: 0 }}
    />
  );
}
