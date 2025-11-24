import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { OrganizersColumns, GuestsColumns } from "./SimpleTableConstants";
import Box from "@mui/material/Box";

// this table uses client side filtering and pagination
export function SimpleTable({ type, data }) {
  // Use State Values
  const [rows, setRows] = useState(data);
  const [columns, setColumns] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [filterModel, setFilterModel] = useState({
    items: [],
  });

  useEffect(() => {
    setIsLoading(false);
    generateColumns();
    setRows(data);
    setIsLoading(true);
  }, []);

  function generateColumns() {
    let newColumns = [];
    if (type === "organizers") {
      newColumns = OrganizersColumns;
    } else if (type === "guests") {
      newColumns = GuestsColumns;
    }

    setColumns(newColumns);
  }

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        showToolbar
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        paginationModel={paginationModel}
      />
    </Box>
  );
}
