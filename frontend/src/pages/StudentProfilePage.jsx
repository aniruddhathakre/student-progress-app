import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import * as api from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const StudentProfilePage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [studentLoading, setStudentLoading] = useState(true);
  const [studentError, setStudentError] = useState(null);
  const [contestHistory, setContestHistory] = useState([]);
  const [contestLoading, setContestLoading] = useState(true);
  const [contestError, setContestError] = useState(null);
  const [timeFilter, setTimeFilter] = useState("all");

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        setStudentLoading(true);
        const { data } = await api.getStudentById(id);
        setStudent(data);

        fetchContestDetails(data.codeforcesHandle);
      } catch (error) {
        setError("Failed to fetch student data.");
        console.error(error);
      } finally {
        setStudentLoading(false);
      }
    };

    const fetchContestDetails = async (handle) => {
      try {
        setContestLoading(true);
        const { data } = await api.getContestHistory(handle);

        const formattedData = data.map((contest) => ({
          contestName: contest.contestName,
          rating: contest.newRating,
          date: new Date(
            contest.ratingUpdateTimeSeconds * 1000
          ).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
          timestamp: contest.ratingUpdateTimeSeconds * 1000,
        }));

        setContestHistory(formattedData);
      } catch (error) {
        setContestError("Could not load contest history");
        console.error(error);
      } finally {
        setContestLoading(false);
      }
    };

    if (id) {
      fetchStudentDetails();
    }
  }, [id]);

  const filteredContestHistory = useMemo(() => {
    if (timeFilter === "all") {
      return contestHistory;
    }

    const now = new Date();
    const daysToSubtract = parseInt(timeFilter, 10);
    const filterDate = new Date();
    filterDate.setDate(now.getDate() - daysToSubtract);

    return contestHistory.filter(
      (contest) => contest.timestamp >= filterDate.getTime()
    );
  }, [contestHistory, timeFilter]);

  const handleTimeFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setTimeFilter(newFilter);
    }
  };

  if (studentLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (studentError) {
    return (
      <Typography color="error" align="center" sx={{ mt: 5 }}>
        {studentError}
      </Typography>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {student && (
        <Paper sx={{ p: 3, maxWidth: "900px", margin: "auto", mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {student.name}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {student.email}
          </Typography>
          <Typography variant="body1">
            <strong>Codeforces Handle:</strong> {student.codeforcesHandle}
          </Typography>
          {/* ... etc ... */}
        </Paper>
      )}

      <Paper sx={{ p: 3, maxWidth: "900px", margin: "auto", mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" component="h2">
            Rating History
          </Typography>

          {/* --- 5. THE FILTER BUTTONS --- */}
          <ToggleButtonGroup
            color="primary"
            value={timeFilter}
            exclusive
            onChange={handleTimeFilterChange}
            aria-label="time filter"
          >
            <ToggleButton value="30">30d</ToggleButton>
            <ToggleButton value="90">90d</ToggleButton>
            <ToggleButton value="365">365d</ToggleButton>
            <ToggleButton value="all">All</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {contestLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : contestError ? (
          <Typography color="error">{contestError}</Typography>
        ) : filteredContestHistory.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={filteredContestHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                domain={["dataMin - 100", "dataMax + 100"]}
                allowDataOverflow
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Typography>No contest history found for this user.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default StudentProfilePage;
