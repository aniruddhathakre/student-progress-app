const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { scheduleJobs } = require("./cronJobs");

dotenv.config();

const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");

connectDB();

const app = express();

// app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/api/students", studentRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running at port : ${PORT}`);
  scheduleJobs();
});

// extra step to deploy on render

const whitelist = ["http://localhost:5173"];
if (process.env.FRONTEND_URL) {
  whitelist.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
