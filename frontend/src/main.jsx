import { ThemeProvider, createTheme } from "@mui/material/styles";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
const theme = createTheme({
  components: {
    MuiAppBar: {
      defaultProps: { elevation: 0, color: "transparent", position: "static" },
      styleOverrides: {
        root: {
          backgroundColor: "#fff",
        },
      },
    },
  },
});

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);
