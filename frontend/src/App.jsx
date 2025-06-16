import React, { useMemo, useState } from "react";
import DashboardPage from "./pages/DashboardPage";
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import { getTheme } from "./theme";
import StudentProfilePage from "./pages/StudentProfilePage";
import { Routes, Route, Link } from "react-router-dom";

import Brightness4Icon from "@mui/icons-material/Brightness4"; // Moon icon
import Brightness7Icon from "@mui/icons-material/Brightness7"; // Sun icon

function App() {
  const [mode, setMode] = useState("light");

  const toggleColorMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
        <Button component={Link} to="/" variant="outlined">
          Back to Dashboard
        </Button>

        <Tooltip
          title={
            mode === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
      </Box>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/student/:id" element={<StudentProfilePage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
