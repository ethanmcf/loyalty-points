import { DeleteOrganizerDialog } from "../delete-dialogs/DeleteOrganizerDialog";

export const OrganizersColumns = [
  { field: "id", headerName: "ID", type: "number", filterable: false },
  {
    field: "name",
    headerName: "Name",
    type: "string",
    flex: 2,
  },
  {
    field: "utorid",
    headerName: "UtorID",
    type: "string",
    filterable: false,
    flex: 2,
  },
  {
    field: "actions",
    headerName: "Actions",
    flex: 3,
    filterable: false,
    sortable: false,
    renderCell: (params) => <DeleteOrganizerDialog userId={params.row.id} />,
  },
];

export const GuestsColumns = [
  { field: "id", headerName: "ID", type: "number", flex: 1, filterable: false },
  {
    field: "name",
    headerName: "Name",
    type: "string",
    flex: 2,
  },
  {
    field: "utorid",
    headerName: "UtorID",
    type: "string",
    flex: 2,
  },
  {
    field: "actions",
    headerName: "Actions",
    filterable: false,
    flex: 2,
    sortable: false,
    renderCell: (params) => <div>Delete Guest</div>,
  },
];
