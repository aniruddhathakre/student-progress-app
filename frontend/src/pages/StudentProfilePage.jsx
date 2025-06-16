import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import * as api from "../services/api";

const StudentProfilePage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const { data } = await api.getStudentById(id);
        setStudent(data);
      } catch (error) {
        setError("Failed to fetch student data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Typography color="error" align="center" sx={{ mt: 5 }}>
        {error}
      </Typography>
    );
  }
  if (!student) {
    return (
      <Typography align="center" sx={{ mt: 5 }}>
        Student not found.
      </Typography>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Paper sx={{ p: 3, maxWidth: "800px", margin: "auto" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {student.name}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Email:</strong> {student.email}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Phone:</strong> {student.phone || "N/A"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Codeforces Handle:</strong> {student.codeforcesHandle}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Current Rating:</strong> {student.currentRating}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Max Rating:</strong> {student.maxRating}
        </Typography>
      </Paper>
    </Box>
  );
};

export default StudentProfilePage;
