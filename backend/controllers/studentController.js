const Student = require("../models/StudentModel");
const {
  getContestHistory,
  getSubmissionHistory,
} = require("../utils/codeforcesService");

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

    const student = await Student.create({
      name,
      email,
      phone,
      codeforcesHandle,
    });

    res.status(200).json(student);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating student", error: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
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

module.exports = {
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentById,
  getStudentContestHistory,
  getStudentSubmissionHistory,
};
