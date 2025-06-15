const Student = require("../models/StudentModel");

const getStudent = async (req, res) => {
  try {
    const students = await Student.find({});

    res.status(200).json(students);
  } catch (error) {
    console.log(error);
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

module.exports = { getStudent, createStudent, updateStudent, deleteStudent };
