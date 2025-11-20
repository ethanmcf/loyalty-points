import { PaginationBar } from "../pagination/PaginationBar";
import { Table } from "../table/Table";

export function DataTable() {
  return (
    <div id="data-table">
      {/* The Filter Bar */}
      {/* The Table */}
      <Table />
      {/* The Pagination Bar */}
      <PaginationBar />
    </div>
  );
}
