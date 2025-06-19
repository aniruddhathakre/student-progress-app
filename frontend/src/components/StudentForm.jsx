import React, { useEffect, useState } from "react";
import { Box, TextField, Button } from "@mui/material";

const StudentForm = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    codeforcesHandle: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        codeforcesHandle: initialData.codeforcesHandle || "",
      });
    } else {
      setFormData({ name: "", email: "", phone: "", codeforcesHandle: "" });
    }
  }, [initialData]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <TextField
        required
        margin="normal"
        fullWidth
        id="name"
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <TextField
        required
        margin="normal"
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        fullWidth
        id="phone"
        label="Phone Number"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
      />
      <TextField
        required
        margin="normal"
        fullWidth
        id="codeforcesHandle"
        label="Codeforces Handle"
        name="codeforcesHandle"
        value={formData.codeforcesHandle}
        onChange={handleChange}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button onClick={onCancel} sx={{ mr: 1 }}>
          Cancel
        </Button>
        <Button variant="contained" type="submit">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default StudentForm;
