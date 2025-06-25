import axios from "axios";

// const API = axios.create({ baseURL: "http://localhost:5000/api" });

const API = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://your-backend-render-url.onrender.com"
      : "http://localhost:5000/api",
});

export const getStudents = () => API.get("/students");

export const createStudent = (newStudent) => API.post("/students", newStudent);

export const updateStudent = (id, updatedStudentData) =>
  API.put(`/students/${id}`, updatedStudentData);

export const deleteStudent = (id) => API.delete(`/students/${id}`);

export const getStudentById = (id) => API.get(`/students/${id}`);

export const getContestHistory = (handle) =>
  API.get(`/students/${handle}/contests`);

export const getSubmissionHistory = (handle) =>
  API.get(`/students/${handle}/submissions`);
