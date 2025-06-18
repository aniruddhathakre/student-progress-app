import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
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
  BarChart,
  Bar,
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
  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);
  const [submissionsError, setSubmissionsError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!id) return;
      try {
        setStudentLoading(true);
        const { data: studentData } = await api.getStudentById(id);
        setStudent(studentData);
        setStudentError(null);
        setStudentLoading(false);

        setContestLoading(true);
        setSubmissionsLoading(true);

        const [contestResult, submissionResult] = await Promise.allSettled([
          api.getContestHistory(studentData.codeforcesHandle),
          api.getSubmissionHistory(studentData.codeforcesHandle),
        ]);

        if (contestResult.status == "fulfilled") {
          const formattedData = contestResult.value.data.map((contest) => ({
            contestName: contest.contestName,
            rating: contest.newRating,
            timestamp: contest.ratingUpdateTimeSeconds * 1000,
            date: new Date(
              contest.ratingUpdateTimeSeconds * 1000
            ).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
          }));
          setContestHistory(formattedData);
        } else {
          setContestError("Could not load contest history.");
          console.error("Contest History Error:", contestResult.reason);
        }
        setContestLoading(false);

        if (submissionResult.status === "fulfilled") {
          setSubmissions(submissionResult.value.data);
        } else {
          setSubmissionsError("Could not load submission history.");
          console.error("Submission History Error:", submissionResult.reason);
        }
        setSubmissionsLoading(false);
      } catch (error) {
        setStudentError("Failed to fetch student data.");
        setStudentLoading(false);
        console.error("Main student fetch error:", error);
      }
    };
    fetchAllData();
  }, [id]);

  const problemStats = useMemo(() => {
    if (!submissions.length) return null;

    const solvedSubmissions = submissions.filter((sub) => sub.verdict === "OK");

    const uniqueSolved = Array.from(
      new Map(solvedSubmissions.map((sub) => [sub.problem.name, sub])).values()
    );

    const totalSolved = uniqueSolved.length;

    if (totalSolved === 0) return { totalSolved: 0 };

    const hardestProblem = uniqueSolved.reduce(
      (max, sub) => (sub.problem.rating > max.problem.rating ? sub : max),
      uniqueSolved[0]
    );

    const ratingSum = uniqueSolved.reduce(
      (sum, sub) => sum + (sub.problem.rating || 0),
      0
    );
    const averageRating = Math.round(ratingSum / totalSolved);

    const ratingBuckets = {};
    uniqueSolved.forEach((sub) => {
      const rating = sub.problem.rating;
      if (rating) {
        const bucket = Math.floor(rating / 200) * 200;
        ratingBuckets[bucket] = (ratingBuckets[bucket] || 0) + 1;
      }
    });
    const barChartData = Object.keys(ratingBuckets)
      .map((bucket) => ({
        rating: `<span class="math-inline">\{bucket\}\-</span>{parseInt(bucket) + 199}`,
        problems: ratingBuckets[bucket],
      }))
      .sort((a, b) => parseInt(a.rating) - parseInt(b.rating));

    return { totalSolved, hardestProblem, averageRating, barChartData };
  }, [submissions]);

  const filteredContestHistory = useMemo(() => {
    // Handle the 'all' case first
    if (timeFilter === "all") {
      return contestHistory;
    }

    // The rest is the date filtering logic
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

      <Paper sx={{ p: 3, maxWidth: "900px", margin: "auto", mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Problem Solving Data
        </Typography>
        {submissionsLoading ? (
          <CircularProgress />
        ) : submissionsError ? (
          <Typography color="error">{submissionsError}</Typography>
        ) : !problemStats ? (
          <Typography>No submission data available.</Typography>
        ) : (
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <Typography variant="h6">Key Statistics</Typography>
              <Typography>
                Total Unique Problems Solved: {problemStats.totalSolved}
              </Typography>
              <Typography>
                Average Problem Rating: {problemStats.averageRating}
              </Typography>
              {problemStats.hardestProblem && (
                <Typography>
                  Hardest Problem Solved:{" "}
                  {problemStats.hardestProblem.problem.name} (
                  {problemStats.hardestProblem.problem.rating})
                </Typography>
              )}
            </Grid>
            <Grid xs={12} md={6}>
              <Typography variant="h6">Problems by Rating</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={problemStats.barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="problems" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default StudentProfilePage;
