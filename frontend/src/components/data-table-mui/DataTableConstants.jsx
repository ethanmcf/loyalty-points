/**
 * Filterable: If this is false, then its NOT used as a filter
 * ValueGetter: If this exists, then this is not in the original API response
 */

export const UserColumns = [
  { field: "id", headerName: "ID", type: "number", filterable: false },
  {
    field: "name",
    field: "Name",
    type: "string",
  },
  {
    field: "utorid",
    field: "UtorID",
    type: "string",
    filterable: false,
  },
  {
    field: "email",
    field: "Email",
    type: "string",
    filterable: false,
  },
  {
    field: "birthday",
    field: "Birthday",
    type: "string",
    filterable: false,
  },
  {
    field: "role",
    headerName: "Role",
    type: "singleSelect",
    valueOptions: ["regular", "cashier", "manager", "superuser"],
  },
  {
    field: "points",
    field: "Points",
    type: "string",
    filterable: false,
  },
  {
    field: "createdAt",
    field: "Created At",
    type: "string",
    filterable: false,
  },
  {
    field: "lastLogin",
    field: "Last Login",
    type: "string",
    filterable: false,
  },
  {
    field: "verified",
    headerName: "Verified",
    type: "boolean",
  },
  {
    field: "avatarUrl",
    field: "Avatar Url",
    type: "string",
    filterable: false,
  },
  {
    field: "activated",
    headerName: "Activated",
    type: "boolean",
    valueGetter: (value, row) => {
      if (!row.lastLogin) {
        return null;
      }

      return lastLogin !== undefined || lastLogin !== null || lastLogin !== "";
    },
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
    field: "Remarks",
    type: "string",
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
    header: "Show Full",
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
