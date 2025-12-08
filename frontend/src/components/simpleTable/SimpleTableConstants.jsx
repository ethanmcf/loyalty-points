import { ActionGuestDialog } from "../actionDialogs/ActionGuestDialog";
import { DeleteOrganizerDialog } from "../deleteDialogs/DeleteOrganizerDialog";

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
    filterable: false,
    sortable: false,
    type: "actions",
    renderCell: (params) => <DeleteOrganizerDialog userId={params.row.id} />,
  },
];

export const GuestsColumns = [
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
    flex: 2,
  },
  {
    field: "action",
    headerName: "Actions",
    type: "actions",
    filterable: false,
    sortable: false,
    renderCell: (params) => <ActionGuestDialog userId={params.row.id} />,
  },
];
