import Tooltip from "@mui/material/Tooltip";
import { useEffect, useState } from "react";
import { getUserById } from "../../../apis/UsersApi";
import Chip from "@mui/material/Chip";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";

export function RelatedIdDisplay({ type, id }) {
  const [tooltipMessage, setTooltipMessage] = useState("");
  const [relatedData, setRelatedData] = useState("");
  const { user } = useUser();
  const navigate = useNavigate();

  const redirectUser = () => {
    if (type === "transfer") {
      // id of the reciever, only manager and super user can access
      navigate(`/users/${id}`);
    } else if (type === "adjustment") {
      navigate(`/transactions/${id}`);
    } else if (type === "event") {
      navigate(`/events/${id}`); // if its published then regular users can access, otherwise, only managers and super users
    } else if (type === "redemption") {
      if (id) {
        // if user is not null
        navigate(`/users/${id}`);
      }
    }
  };

  const configureTooltip = async () => {
    if (type === "purchase") {
      setRelatedData("N/A");
      setTooltipMessage("Purchases do not have a related id");
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
      try {
        if (user.role === "regular") {
          setRelatedData(id);
        } else {
          const transUser = await getUserById(localStorage.token, Number(id));
          setRelatedData(transUser.utorid);
        }
        setTooltipMessage("The utorid if the reciever of the transfer");
      } catch (error) {
        console.error(error);
      }
    } else if (type === "adjustment") {
      // the ID of the transaction for which the adjustment is being made to.
      console.log(id);
      setRelatedData(id);
      setTooltipMessage(
        "the ID of the transaction for which the adjustment is being made to. "
      );
    } else if (type === "event") {
      // the ID of the event from which points were disbursed
      setRelatedData(id);
      setTooltipMessage("the ID of the event from which points were disbursed");
    }
  };
  useEffect(() => {
    configureTooltip();
  }, []);

  return (
    <Tooltip title={tooltipMessage}>
      <Chip onClick={redirectUser} label={relatedData} />
    </Tooltip>
  );
}
