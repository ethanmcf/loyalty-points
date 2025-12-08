/**
 * Filterable: If this is false, then its NOT used as a filter
 * ValueGetter: If this exists, then this is not in the original API response or has a conditional render
 */
import { ViewDetailsButton } from "./pieces/ViewDetailsButton";
import { SuspiciousTransactionsDialog } from "../actionDialogs/SuspiciousTransactionsDialog";
import { ProcessRedemptionTransactionsDialog } from "../actionDialogs/ProcessRedemptionTransactionsDialog";
import { DeletePromotionsDialog } from "../deleteDialogs/DeletePromotionsDialog";
import { DeleteEventsDialog } from "../deleteDialogs/DeleteEventsDialog";
import Chip from "@mui/material/Chip";
import { RelatedIdDisplay } from "./pieces/RelatedIdDisplay";
import {
  getGridNumericOperators,
  getGridStringOperators,
} from "@mui/x-data-grid";

const containsOperator = [
  getGridStringOperators().find((operator) => operator.value === "contains"),
];
const gtelteOperator = getGridNumericOperators().filter(
  (operator) => operator.value === "<=" || operator.value === ">="
);
export const UserColumns = [
  {
    field: "id",
    headerName: "ID",
    type: "number",
    width: 100,
    filterable: false,
  },
  {
    field: "name",
    headerName: "Name",
    type: "string",
    filterOperators: containsOperator,
    flex: 1,
  },
  {
    field: "utorid",
    headerName: "UtorID",
    type: "string",
    flex: 1,
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
    minWidth: 150,
    valueOptions: ["regular", "cashier", "manager", "superuser"],
    renderCell: (params) => (
      <Chip
        label={params.row.role}
        color={
          params.row.role === "regular"
            ? "primary"
            : params.row.role === "cashier"
            ? "secondary"
            : params.row.role === "manager"
            ? "success"
            : "warning"
        }
      />
    ),
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
    type: "String",
    filterable: false,
    renderCell: (params) => {
      const src = !params.row.avatarUrl
        ? "/default-avatar.png"
        : `${import.meta.env.VITE_BACKEND_URL}/${params.row.avatarUrl}`;
      return (
        <div
          style={{
            width: "100%",
            display: "flex",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={src}
            style={{
              width: 25,
              height: 25,
            }}
          ></img>
        </div>
      );
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
    field: "details",
    headerName: "Details",
    width: 150,
    filterable: false,
    sortable: false,
    renderCell: (params) => (
      <ViewDetailsButton url={`/users/${params.row.id}`} />
    ),
  },
];
export const TransactionColumns = [
  {
    field: "id",
    headerName: "ID",
    width: 100,
    type: "number",
  },
  {
    field: "utorid",
    headerName: "UtorID",
    type: "string",
    filterOperators: containsOperator,
    flex: 1,
  },
  {
    field: "createdBy",
    headerName: "Created By",
    filterOperators: containsOperator,
    type: "string",
    flex: 1,
  },
  {
    field: "suspicious",
    headerName: "Suspicious",
    type: "boolean",
  },
  {
    field: "promotionId",
    headerName: "Number of Promotion Ids",
    type: "number",
    valueGetter: (value, row) => {
      if (row.promotionIds) {
        return row.promotionIds.length;
      } else {
        return 0;
      }
    },
  },
  {
    field: "type",
    headerName: "Type",
    type: "singleSelect",
    minWidth: 150,
    valueOptions: ["purchase", "redemption", "transfer", "adjustment", "event"], //do we put events as well?
    renderCell: (params) => {
      if (params.row.type === "purchase") {
        return <Chip color="primary" label="purchase" />;
      } else if (params.row.type === "redemption") {
        return <Chip color="secondary" label="redemption" />;
      } else if (params.row.type === "transfer") {
        return <Chip color="warning" label="transfer" />;
      } else if (params.row.type === "adjustment") {
        return <Chip color="error" label="adjustment" />;
      } else if (params.row.type === "event") {
        return <Chip color="info" label="event" />;
      }
    },
  },
  {
    field: "relatedId",
    headerName: "Related ID",
    type: "number",
    minWidth: 150,
    renderCell: (params) => {
      return (
        <RelatedIdDisplay type={params.row.type} id={params.row.relatedId} />
      );
    },
  },
  {
    field: "amount",
    headerName: "Amount",
    type: "number",
    filterOperators: gtelteOperator,
  },
  {
    field: "remarks",
    headerName: "Remarks",
    type: "string",
    flex: 1,
    valueGetter: (value, row) => {
      if (!row.remarks) {
        return "N/A";
      } else {
        return row.remarks;
      }
    },
  },

  {
    field: "toggleSuspicious",
    headerName: "Toggle Suspicious",
    filterable: false,
    sortable: false,
    renderCell: (params) => <SuspiciousTransactionsDialog id={params.row.id} />,
  },
  {
    field: "processRedemption",
    headerName: "Process Redemption",
    type: "actions",
    filterable: false,
    sortable: false,
    renderCell: (params) => (
      <ProcessRedemptionTransactionsDialog id={params.row.id} />
    ),
  },
  {
    field: "details",
    headerName: "Details",
    width: 150,
    filterable: false,
    sortable: false,
    renderCell: (params) => (
      <ViewDetailsButton url={`/transactions/${params.row.id}`} />
    ),
  },
];

const EventColumnsBase = [
  {
    field: "id",
    headerName: "ID",
    type: "number",
    width: 100,
  },
  {
    field: "name",
    headerName: "Name",
    filterOperators: containsOperator,
    type: "string",
    minWidth: 150,
    flex: 1,
  },
  {
    field: "location",
    headerName: "Location",
    filterOperators: containsOperator,
    type: "string",
    flex: 1,
    minWidth: 150,
  },
  {
    field: "startTime",
    headerName: "Start Time",
    type: "string",
    minWidth: 150,
  },
  {
    field: "endTime",
    headerName: "End Time",
    type: "string",
    minWidth: 150,
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
    valueGetter: (value, row) => {
      if (!row.capacity) {
        return "N/A";
      } else {
        return row.capacity;
      }
    },
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
];

export const EventRegularColumns = [
  ...EventColumnsBase,
  // Reference: https://mui.com/x/react-data-grid/cells/
  {
    field: "details",
    headerName: "Details",
    width: 150,
    filterable: false,
    sortable: false,
    renderCell: (params) => (
      <ViewDetailsButton url={`/events/${params.row.id}`} />
    ),
  },
];

export const EventManagerColumns = [
  ...EventColumnsBase,
  { field: "pointsRemain", headerName: "Points Remaining", type: "number" },
  { field: "pointsAwarded", headerName: "Points Awarded", type: "number" },
  { field: "published", headerName: "Published", type: "boolean" },
  // Reference: https://mui.com/x/react-data-grid/cells/
  {
    field: "details",
    headerName: "Details",
    width: 150,
    filterable: false,
    sortable: false,
    renderCell: (params) => (
      <ViewDetailsButton url={`/events/${params.row.id}`} />
    ),
  },
  {
    field: "action",
    headerName: "Actions",
    filterable: false,
    sortable: false,
    renderCell: (params) => <DeleteEventsDialog id={params.row.id} />,
  },
];

const PromotionsColumnsBase = [
  {
    field: "id",
    headerName: "ID",
    type: "number",
    width: 100,
  },
  {
    field: "name",
    headerName: "Name",
    type: "string",
    filterOperators: containsOperator,
    flex: 1,
  },
  {
    field: "type",
    headerName: "Type",
    type: "singleSelect",
    valueOptions: ["automatic", "one-time"],
    minWidth: 150,
    renderCell: (params) => (
      <Chip
        label={params.row.type}
        color={params.row.type === "automatic" ? "primary" : "secondary"}
      />
    ),
  },

  {
    field: "minSpending",
    headerName: "Min. Spending Requirement ($)",
    type: "number",
    valueGetter: (value, row) => {
      if (row.minSpending) {
        return row.minSpending;
      } else {
        return "0";
      }
    },
  },
  {
    field: "rate",
    headerName: "Promotion Rate",
    type: "number",
    valueGetter: (value, row) => {
      if (row.rate) {
        return row.rate;
      } else {
        return "0.25";
      }
    },
  },
  {
    field: "points",
    headerName: "Promotion Points",
    type: "number",
  },
];

export const PromotionsRegularColumns = [
  ...PromotionsColumnsBase,
  {
    field: "endTime",
    headerName: "End Time",
    type: "string",
  },
  {
    field: "details",
    headerName: "Details",
    width: 150,
    filterable: false,
    sortable: false,
    renderCell: (params) => (
      <ViewDetailsButton url={`/promotions/${params.row.id}`} />
    ),
  },
  {
    field: "delete",
    headerName: "Delete",
    filterable: false,
    sortable: false,
    renderCell: (params) => <DeletePromotionsDialog id={params.row.id} />,
  },
];

export const PromotionsManagerColumns = [
  ...PromotionsColumnsBase,
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
    field: "details",
    headerName: "Details",
    width: 150,
    filterable: false,
    sortable: false,
    renderCell: (params) => (
      <ViewDetailsButton url={`/promotions/${params.row.id}`} />
    ),
  },
  {
    field: "delete",
    headerName: "Delete",
    filterable: false,
    sortable: false,
    renderCell: (params) => <DeletePromotionsDialog id={params.row.id} />,
  },
];

export const UserTransactionsColumns = [
  {
    field: "id",
    headerName: "ID",
    type: "number",
  },
  {
    field: "createdBy",
    headerName: "Created By",
    type: "string",
    flex: 1,
  },
  {
    field: "suspicious",
    headerName: "Suspicious",
    type: "boolean",
  },
  {
    field: "promotionId",
    headerName: "Number of Promotion Ids",
    type: "number",
    valueGetter: (value, row) => {
      if (row.promotionIds) {
        return row.promotionIds.length;
      } else {
        return 0;
      }
    },
  },
  {
    field: "type",
    headerName: "Type",
    type: "singleSelect",
    minWidth: 150,
    valueOptions: ["purchase", "redemption", "transfer", "adjustment", "event"], //do we put events as well?
    renderCell: (params) => {
      if (params.row.type === "purchase") {
        return <Chip color="primary" label="purchase" />;
      } else if (params.row.type === "redemption") {
        return <Chip color="secondary" label="redemption" />;
      } else if (params.row.type === "transfer") {
        return <Chip color="warning" label="transfer" />;
      } else if (params.row.type === "adjustment") {
        return <Chip color="error" label="adjustment" />;
      } else if (params.row.type === "event") {
        return <Chip color="info" label="event" />;
      }
    },
  },
  {
    field: "relatedId",
    headerName: "Related ID",
    type: "number",
    renderCell: (params) => {
      return (
        <RelatedIdDisplay type={params.row.type} id={params.row.relatedId} />
      );
    },
  },
  {
    field: "amount",
    headerName: "Amount",
    type: "number",
    filterOperators: gtelteOperator,
  },
  {
    field: "remarks",
    headerName: "Remarks",
    type: "string",
    valueGetter: (value, row) => {
      if (!row.remarks) {
        return "N/A";
      } else {
        return row.remarks;
      }
    },
  },
  {
    field: "details",
    headerName: "Details",
    width: 150,
    filterable: false,
    sortable: false,
    renderCell: (params) => (
      <ViewDetailsButton url={`/transactions/${params.row.id}`} />
    ),
  },
];
