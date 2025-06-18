const cron = require("node-cron");
const Student = require("./models/StudentModel");
const {
  getContestHistory,
  getSubmissionHistory,
} = require("./utils/codeforcesService");

const syncAllStudentsData = async () => {
  try {
    const allStudents = await Student.find({});
    console.log(`${allStudents.length} students to sync`);

    for (const student of allStudents) {
      try {
      } catch (error) {}
    }
  } catch (error) {}
};
