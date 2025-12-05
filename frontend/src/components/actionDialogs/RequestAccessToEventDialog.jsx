import { sendAddToEventEmail } from "../../apis/utils/sendEmail";
import Button from "@mui/material/Button";

export default function RequestEventAccessButton({ token, tier, utorid}) {
  const handleRequest = async () => {
    try {
      await sendAddToEventEmail(
        "nadaaalomrani@gmail.com",
        token, 
        tier, 
        utorid
      );
      alert("Request sent!");
    } catch (err) {
      console.error("Email failed:", err);
      alert("Failed to send request");
    }
  };

  return (
    <Button variant="outlined" onClick={handleRequest}>
      Request Invite to Event
    </Button>
  );
}
