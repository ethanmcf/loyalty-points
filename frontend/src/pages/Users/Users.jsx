import { useUser } from "../../contexts/UserContext";
import { DataTable } from "../../components/data-table-mui/DataTable";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState } from "react";

import "./User.css";
import Button from "@mui/material/Button";
export function Users() {
  const { user } = useUser();
  const [roleView, setRoleView] = useState(user.role);

  const handleRoleChange = (event) => {
    setRoleView(event.target.value);
  };

  const handleAddUser = () => {};

  return (
    <div id="user-page">
      <div className="table-page-header">
        <h2>Users</h2>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Button></Button>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Role View</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={roleView}
              label="Role View"
              onChange={handleRoleChange}
            >
              <MenuItem value={"regular"}>Regular</MenuItem>
              <MenuItem value={"cashier"}>Cashier</MenuItem>
              <MenuItem value={"manager"}>Manager</MenuItem>
              <MenuItem value={"superuser"}>SuperUser</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <DataTable baseURL="/users" />
    </div>
  );
}
