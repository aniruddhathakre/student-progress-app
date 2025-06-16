const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const cors = require("cors");

dotenv.config();

connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/students", studentRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running at port : ${PORT}`);
});
