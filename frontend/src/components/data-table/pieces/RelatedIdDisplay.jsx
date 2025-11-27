import Tooltip from "@mui/material/Tooltip";
import { useEffect, useState } from "react";

export function RelatedIdDisplay({ type, id }) {
  const [tooltipMessage, setTooltipMessage] = useState("");
  const [relatedData, setRelatedData] = useState("");

  const configureTooltip = async () => {
    if (type === "purchase") {
      return <>N/A</>;
    } else if (type === "redemption") {
      // related id is the id of the cashier
      if (id) {
        try {
          const user = await getUserById(localStorage.token, Number(id));
          setRelatedData(user.utorid);
          setTooltipMessage("Cashier who processed the redemption.");
        } catch (error) {
          console.error("Error");
        }
      } else {
        setRelatedData("N/A");
        setTooltipMessage(
          "Cashier who processed the redemption. This transaction has not yet been processed."
        );
      }
    } else if (type === "transfer") {
      // related id is the id of the reciever

      setRelatedData("");
      setTooltipMessage("The utorid if the reciever of the transfer");
    } else if (params.row.type === "adjustment") {
      // the ID of the transaction for which the adjustment is being made to.
      setRelatedData("");
      setTooltipMessage(
        "the ID of the transaction for which the adjustment is being made to. "
      );
    } else if (params.row.type === "event") {
      // the ID of the event from which points were disbursed
      setRelatedData("");
      setTooltipMessage("the ID of the event from which points were disbursed");
    }
  };
  useEffect(() => {
    configureTooltip();
  }, []);

  return <Tooltip title={tooltipMessage}>{relatedData}</Tooltip>;
}
