/**
 * Filterable: If this is false, then its NOT used as a filter
 * ValueGetter: If this exists, then this is not in the original API response or has a conditional render
 */

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const UserColumns = [
  { field: "id", headerName: "ID", type: "number", filterable: false },
  {
    field: "name",
    headerName: "Name",
    type: "string",
  },
  {
    field: "utorid",
    headerName: "UtorID",
    type: "string",
    filterable: false,
  },
  {
    field: "email",
    headerName: "Email",
    type: "string",
    filterable: false,
  },
  {
    field: "birthday",
    headerName: "Birthday",
    type: "string",
    filterable: false,
    valueGetter: (value, row) => {
      if (!row.birthday) {
        return "N/A";
      }

      return row.birthday;
    },
  },
  {
    field: "role",
    headerName: "Role",
    type: "singleSelect",
    valueOptions: ["regular", "cashier", "manager", "superuser"],
  },
  {
    field: "points",
    headerName: "Points",
    type: "string",
    filterable: false,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    type: "string",
    filterable: false,
  },
  {
    field: "lastLogin",
    headerName: "Last Login",
    type: "string",
    filterable: false,
    valueGetter: (value, row) => {
      if (!row.lastLogin) {
        return "N/A";
      }

      return row.lastLogin;
    },
  },
  {
    field: "verified",
    headerName: "Verified",
    type: "boolean",
  },
  {
    field: "avatarUrl",
    headerName: "Avatar Url",
    type: "string",
    filterable: false,
    valueGetter: (value, row) => {
      if (!row.avatarUrl) {
        return "N/A";
      }

      return row.avatarUrl;
    },
  },
  {
    field: "activated",
    headerName: "Activated",
    type: "boolean",
    valueGetter: (value, row) => {
      if (!row.lastLogin) {
        return null;
      }

      return (
        row.lastLogin !== undefined ||
        row.lastLogin !== null ||
        row.lastLogin !== ""
      );
    },
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 300,
    renderCell: (params) => (
      <strong>
        <Button
          variant="contained"
          size="small"
          tabIndex={params.hasFocus ? 0 : -1}
          onClick={() => {
            navigate(`/users/${params.row.id}`);
          }}
        >
          View Details
        </Button>
      </strong>
    ),
  },
];
export const TransactionColumns = [
  {
    field: "id",
    headerName: "ID",
    type: "number",
  },
  {
    field: "name",
    headerName: "Name",
    type: "string",
  },
  {
    field: "createdBy",
    headerName: "Created By",
    type: "string",
  },
  {
    field: "suspicious",
    headerName: "Suspicious",
    type: "boolean",
  },
  {
    field: "promotionId",
    headerName: "Promotion Id",
    type: "number",
  },
  {
    field: "type",
    headerName: "Type",
    type: "singleSelect",
    valueOptions: ["purchase", "redemption", "transfer", "adjustment"],
  },
  {
    field: "relatedId",
    headerName: "Related ID",
    type: "number",
  },
  {
    field: "amount",
    headerName: "Amount",
    type: "number",
  },
  {
    field: "remarks",
    headerName: "Remarks",
    type: "string",
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 300,
    renderCell: (params) => (
      <strong>
        <Button
          variant="contained"
          size="small"
          tabIndex={params.hasFocus ? 0 : -1}
          onClick={() => {
            navigate(`/transactions/${params.row.id}`);
          }}
        >
          View Details
        </Button>
      </strong>
    ),
  },
];

export const EventRegularColumns = [
  {
    field: "id",
    headerName: "ID",
    type: "number",
  },
  {
    field: "name",
    headerName: "Name",
    type: "string",
  },
  {
    field: "location",
    headerName: "Location",
    type: "string",
  },
  {
    field: "startTime",
    headerName: "Start Time",
    type: "string",
  },
  {
    field: "endTime",
    headerName: "End Time",
    type: "string",
  },
  {
    field: "started",
    headerName: "Started",
    type: "boolean",
    valueGetter: (value, row) => {
      if (!row.startTime) {
        return null;
      }
      const currentTime = new Date();
      const startDateTime = new Date(row.startTime);
      return startDateTime <= currentTime;
    },
  },
  {
    field: "ended",
    headerName: "Ended",
    type: "boolean",
    valueGetter: (value, row) => {
      if (!row.endTime) {
        return null;
      }
      const currentTime = new Date();
      const endDateTime = new Date(row.endTime);
      return endDateTime <= currentTime;
    },
  },
  {
    field: "capacity",
    headerName: "Capacity",
    type: "number",
  },
  {
    field: "numGuests",
    headerName: "Number of Guests",
    type: "number",
  },
  {
    field: "showFull",
    headerName: "Show Full",
    type: "boolean",
    valueGetter: (value, row) => {
      if (!row.numGuests) {
        return null;
      }

      if (!row.capacity) {
        return false; // if capacity is null, there is no limit
      }
      return row.numGuests === row.capacity;
    },
  },
  // Reference: https://mui.com/x/react-data-grid/cells/
  {
    field: "actions",
    headerName: "Actions",
    width: 300,
    renderCell: (params) => (
      <strong>
        <Button
          variant="contained"
          size="small"
          tabIndex={params.hasFocus ? 0 : -1}
          onClick={() => {
            navigate(`/events/${params.row.id}`);
          }}
        >
          View Details
        </Button>
      </strong>
    ),
  },
];

export const EventManagerColumns = [
  ...EventRegularColumns,
  { field: "pointsRemain", headerName: "Points Remaining", type: "number" },
  { field: "pointsAwarded", headerName: "Points Awarded", type: "number" },
  { field: "published", headerName: "Published", type: "boolean" },
];

export const PromotionsRegularColumns = [
  {
    field: "id",
    headerName: "ID",
    type: "number",
  },
  {
    field: "name",
    headerName: "Name",
    type: "string",
  },
  {
    field: "type",
    headerName: "Type",
    type: "singleSelect",
    valueOptions: ["automatic", "one-time"],
  },
  {
    field: "endTime",
    headerName: "End Time",
    type: "string",
  },
  {
    field: "minSpending",
    headerName: "Minimum Spending Requirement",
    type: "number",
  },
  {
    field: "rate",
    headerName: "Promotion Rate",
    type: "number",
  },
  {
    field: "points",
    headerName: "Promotion Points",
    type: "number",
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 300,
    renderCell: (params) => (
      <strong>
        <Button
          variant="contained"
          size="small"
          tabIndex={params.hasFocus ? 0 : -1}
          onClick={() => {
            navigate(`/promotions/${params.row.id}`);
          }}
        >
          View Details
        </Button>
      </strong>
    ),
  },
];

export const PromotionsManagerColumns = [
  ...PromotionsRegularColumns,
  {
    field: "startTime",
    headerName: "Start Time",
    type: "string",
  },
  {
    field: "started",
    headerName: "Started",
    type: "boolean",
    valueGetter: (value, row) => {
      if (!row.startTime) {
        return null;
      }
      const currentTime = new Date();
      const startDateTime = new Date(row.startTime);
      return startDateTime <= currentTime;
    },
  },
  {
    field: "ended",
    headerName: "Ended",
    type: "boolean",
    valueGetter: (value, row) => {
      if (!row.endTime) {
        return null;
      }
      const currentTime = new Date();
      const endDateTime = new Date(row.endTime);
      return endDateTime <= currentTime;
    },
  },
];
