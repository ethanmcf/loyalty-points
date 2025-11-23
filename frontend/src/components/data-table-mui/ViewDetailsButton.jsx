import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
export function ViewDetailsButton({ url }) {
  const navigate = useNavigate();
  return (
    <Button
      variant="contained"
      size="small"
      onClick={() => {
        navigate(url);
      }}
    >
      View Details
    </Button>
  );
}
