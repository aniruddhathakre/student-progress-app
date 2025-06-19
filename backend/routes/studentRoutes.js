const express = require("express");
const router = express.Router();
const {
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentById,
  getStudentContestHistory,
  getStudentSubmissionHistory,
  manualSync,
} = require("../controllers/studentController");

router.route("/").get(getStudent).post(createStudent);

router
  .route("/:id")
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

router.route("/:handle/contests").get(getStudentContestHistory);

router.route("/:handle/submissions").get(getStudentSubmissionHistory);

router.route("/sync").post(manualSync);

module.exports = router;
