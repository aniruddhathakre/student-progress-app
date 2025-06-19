import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Switch,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import * as api from "../services/api";
import StudentForm from "../components/StudentForm";
import CloseIcon from "@mui/icons-material/Close";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { CSVLink } from "react-csv";

const DashboardPage = () => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [isConfirmDialogOpen, setisConfirmDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [studentToEdit, setstudentToEdit] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await api.getStudents();
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch", error);
    }
  };

  const handleOpenModal = (student = null) => {
    setstudentToEdit(student);
    setisModalOpen(true);
  };
  const handleCloseModal = () => setisModalOpen(false);

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setisConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.deleteStudent(studentToDelete._id);
      fetchStudents();
      setisConfirmDialogOpen(false);
      setStudentToDelete(null);
    } catch (error) {
      console.error("Failed to delete student:", error);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (studentToEdit) {
        await api.updateStudent(studentToEdit._id, formData);
      } else {
        await api.createStudent(formData);
      }
      fetchStudents();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save student:", error);
    }
  };

  const handleEmailToggle = async (student) => {
    try {
      const updatedData = { isEmailDisabled: !student.isEmailDisabled };
      await api.updateStudent(student._id, updatedData);

      fetchStudents();
    } catch (error) {
      console.error("Failed to update email preference:", error);
    }
  };

  const csvHeaders = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Codeforces Handle", key: "codeforcesHandle" },
    { label: "Current Rating", key: "currentRating" },
    { label: "Max Rating", key: "maxRating" },
    { label: "Last Synced At", key: "lastSyncedAt" },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Student Dashboard
        </Typography>
        <Box>
          <Button
            variant="contained"
            sx={{ mr: 2 }}
            onClick={() => handleOpenModal()}
          >
            Add New Student
          </Button>
        </Box>
      </Box>

      <CSVLink
        data={students}
        headers={csvHeaders}
        filename={"student_progress_report.csv"}
        style={{ textDecoration: "none" }} // To make the button look normal
        target="_blank"
      >
        <Button variant="contained" color="success">
          Download as CSV
        </Button>
      </CSVLink>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                Email
              </TableCell>
              {/* --- ADD THIS HEADER CELL BACK --- */}
              <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                Phone
              </TableCell>
              <TableCell>Codeforces Handle</TableCell>
              <TableCell align="center">Current Rating</TableCell>
              <TableCell align="center">Max Rating</TableCell>
              <TableCell>Last Synced</TableCell>
              <TableCell align="center">Emails On</TableCell>
              <TableCell align="center">Reminders Sent</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{student.name}</TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  {student.email}
                </TableCell>

                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  {student.phone || "N/A"}
                </TableCell>
                <TableCell>{student.codeforcesHandle}</TableCell>
                <TableCell align="center">
                  {student.currentRating || "N/A"}
                </TableCell>
                <TableCell align="center">
                  {student.maxRating || "N/A"}
                </TableCell>
                <TableCell>
                  {student.lastSyncedAt
                    ? new Date(student.lastSyncedAt).toLocaleString("en-GB")
                    : "Never"}
                </TableCell>
                <TableCell align="center">
                  <Switch
                    checked={!student.isEmailDisabled}
                    onChange={() => handleEmailToggle(student)}
                    color="success"
                  />
                </TableCell>
                <TableCell align="center">
                  {student.reminderEmailCount || 0}
                </TableCell>
                <TableCell align="right">
                  <Link to={`/student/${student._id}`}>
                    <IconButton
                      title="View Details"
                      size="small"
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Link>
                  <IconButton
                    title="Edit"
                    size="small"
                    onClick={() => handleOpenModal(student)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    title="Delete"
                    size="small"
                    color="error"
                    onClick={() => handleDeleteClick(student)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {studentToEdit ? "Edit Student" : "Add New Student"}
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <StudentForm
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
            initialData={studentToEdit}
          />
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={isConfirmDialogOpen}
        onClose={() => setisConfirmDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Student"
        message={`Are you sure you want to delete ${studentToDelete?.name}? This action cannot be undone.`}
      />
    </Box>
  );
};

export default DashboardPage;
