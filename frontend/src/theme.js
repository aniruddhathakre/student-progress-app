import { createTheme } from "@mui/material/styles";

// This function creates a theme based on the mode ('light' or 'dark')
export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            // Palette values for light mode
            primary: { main: "#1976d2" },
            background: { default: "#f4f6f8", paper: "#ffffff" },
            text: { primary: "#000000" },
          }
        : {
            // Palette values for dark mode
            primary: { main: "#90caf9" },
            background: { default: "#121212", paper: "#1e1e1e" },
            text: { primary: "#ffffff" },
          }),
    },
  });
