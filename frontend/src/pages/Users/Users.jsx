import { useUser } from "../../contexts/UserContext";
import { DataTable } from "../../components/data-table-mui/DataTable";
export function Users() {
  const { user } = useUser();

  return (
    <div id="user-page">
      <h2>Events</h2>
      <DataTable baseURL="/users" />
    </div>
  );
}
