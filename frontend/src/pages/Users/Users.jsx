import { useUser } from "../../contexts/UserContext";
import { DataTable } from "../../components/data-table-mui/DataTable";
import "./User.css";
export function Users() {
  const { user } = useUser();

  return (
    <div id="user-page">
      <div className="table-page-header">
        <h2>Users</h2>
      </div>
      <DataTable baseURL="/users" />
    </div>
  );
}
