const Student = require("../models/StudentModel");
const {
  getContestHistory,
  getSubmissionHistory,
} = require("../utils/codeforcesService");
const { syncAllStudentsData } = require("../cronJobs");

const getStudent = async (req, res) => {
  try {
    const students = await Student.find({});

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const createStudent = async (req, res) => {
  try {
    const { name, email, phone, codeforcesHandle } = req.body;

    const existingStudent = await Student.findOne({
      $or: [{ email }, { codeforcesHandle }],
    });
    if (existingStudent) {
      return res.status(400).json({
        message: "A student with this email or handle already exists.",
      });
    }

    const [contestHistory, submissionHistory] = await Promise.all([
      getContestHistory(codeforcesHandle),
      getSubmissionHistory(codeforcesHandle),
    ]);

    const newStudentData = {
      name,
      email,
      phone,
      codeforcesHandle,
      contestHistory: contestHistory || [],
      submissionHistory: submissionHistory || [],
      lastSyncedAt: new Date(),
    };

    if (contestHistory && contestHistory.length > 0) {
      const latestContest = contestHistory[contestHistory.length - 1];
      newStudentData.currentRating = latestContest.newRating;
      newStudentData.maxRating = contestHistory.reduce(
        (max, c) => Math.max(max, c.newRating),
        0
      );
    }

    const student = await Student.create(newStudentData);
    res.status(201).json(student);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating student", error: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Always update the basic fields with new data, or keep the old data if not provided
    student.name = req.body.name || student.name;
    student.email = req.body.email || student.email;
    student.phone = req.body.phone || student.phone;

    // check for emailDisable
    if (typeof req.body.isEmailDisabled === "boolean") {
      student.isEmailDisabled = req.body.isEmailDisabled;
    }

    const handleChanged =
      req.body.codeforcesHandle &&
      student.codeforcesHandle !== req.body.codeforcesHandle;

    // If the handle changed, we must sync new data
    if (handleChanged) {
      console.log(
        `Handle changed. Syncing for new handle: ${req.body.codeforcesHandle}`
      );

      // Fetch new data from Codeforces using the NEW handle
      const [contestHistory, submissionHistory] = await Promise.all([
        getContestHistory(req.body.codeforcesHandle),
        getSubmissionHistory(req.body.codeforcesHandle),
      ]);

      // Update handle and all synced data
      student.codeforcesHandle = req.body.codeforcesHandle;
      student.contestHistory = contestHistory || [];
      student.submissionHistory = submissionHistory || [];
      student.lastSyncedAt = new Date();

      // Recalculate ratings based on new history
      if (contestHistory && contestHistory.length > 0) {
        const latestContest = contestHistory[contestHistory.length - 1];
        student.currentRating = latestContest.newRating;
        const maxRating = contestHistory.reduce(
          (max, c) => Math.max(max, c.newRating),
          0
        );
        student.maxRating = Math.max(student.maxRating || 0, maxRating);
      } else {
        // If new handle has no contest history, reset ratings
        student.currentRating = 0;
        student.maxRating = student.maxRating || 0;
      }
    }

    const updatedStudent = await student.save();

    res.status(200).json(updatedStudent);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating student", error: error, message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getStudentContestHistory = async (req, res) => {
  try {
    const contestHistory = await getContestHistory(req.params.handle);

    res.status(200).json(contestHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentSubmissionHistory = async (req, res) => {
  try {
    const submissions = await getSubmissionHistory(req.params.handle);
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const manualSync = async (req, res) => {
  console.log("Manual Sync Triggered via API");
  syncAllStudentsData();
  res.status(202).json({
    message: "Sync process initiated successfully.",
  });
};

module.exports = {
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentById,
  getStudentContestHistory,
  getStudentSubmissionHistory,
  manualSync,
};
