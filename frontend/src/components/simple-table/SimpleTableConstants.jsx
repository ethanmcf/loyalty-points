import { AwardSingleGuestDialog } from "../../pages/Events/pieces/AwardSingleGuestDialog";
import { DeleteGuestDialog } from "../delete-dialogs/DeleteGuestDialog";
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
    field: "award",
    headerName: "Award",
    type: "actions",
    filterable: false,
    sortable: false,
    renderCell: (params) => <AwardSingleGuestDialog userId={params.row.id} />,
  },
  {
    field: "delete",
    headerName: "Delete",
    type: "actions",
    filterable: false,
    sortable: false,
    renderCell: (params) => <DeleteGuestDialog userId={params.row.id} />,
  },
];
