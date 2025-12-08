import { useNavigate } from "react-router-dom";

export function NavigatingText({ text, url }) {
  const navigate = useNavigate();

  return <div onDoubleClick={() => navigate(`${url}`)}>{text}</div>;
}
