import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from "@mui/material";
import { grey } from "@mui/material/colors";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const theme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "dark",
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "*": {
            scrollbarWidth: "thin",
            scrollbarColor: `${grey[700]} ${grey[900]}`,
          },
          "*::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
            backgroundColor: grey[900],
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: grey[700],
            borderRadius: "4px",
          },
          "*::-webkit-scrollbar-corner": {
            // this hides an annoying white box which appears when both scrollbars are present
            backgroundColor: "transparent",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          input: { fontFamily: "monospace" },
        },
      },
    },
  })
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
