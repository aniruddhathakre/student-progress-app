const cron = require("node-cron");
const Student = require("./models/StudentModel");
const {
  getContestHistory,
  getSubmissionHistory,
} = require("./utils/codeforcesService");
const { sendInactivityEmail } = require("./utils/emailService");

const syncAllStudentsData = async () => {
  try {
    const allStudents = await Student.find({});
    console.log(`${allStudents.length} students to sync`);

    for (const student of allStudents) {
      try {
        console.log(`Syncing data for ${student.codeforcesHandle}`);

        const [contestHistory, submissionHistory] = await Promise.all([
          getContestHistory(student.codeforcesHandle),
          getSubmissionHistory(student.codeforcesHandle),
        ]);

        if (contestHistory && contestHistory.length > 0) {
          const latestContest = contestHistory[contestHistory.length - 1];
          student.currentRating = latestContest.newRating;
          const maxRating = contestHistory.reduce(
            (max, c) => Math.max(max, c.newRating),
            0
          );
          student.maxRating = Math.max(student.maxRating || 0, maxRating);
          student.contestHistory = contestHistory;
        }

        if (submissionHistory && submissionHistory.length > 0) {
          student.submissionHistory = submissionHistory;
        }

        student.lastSyncedAt = new Date();
        await student.save();
        console.log(`Sync successfull for ${student.codeforcesHandle}`);

        if (
          !student.isEmailDisabled &&
          student.submissionHistory &&
          student.submissionHistory.length > 0
        ) {
          const lastSubmission = student.submissionHistory.reduce(
            (latest, sub) => {
              sub.creationTimeSeconds > latest.creationTimeSeconds
                ? sub
                : latest;
            }
          );
          const lastSubmissionDate = new Date(
            lastSubmission.creationTimeSeconds * 1000
          );
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

          if (lastSubmissionDate < sevenDaysAgo) {
            console.log(`${student.name} is inactive. Sending reminder email.`);
            await sendInactivityEmail(student.email, student.name);
            student.reminderEmailCount = (student.reminderEmailCount || 0) + 1;
            await student.save();
          }
        }
      } catch (error) {
        console.error(
          `Failed to sync data for ${student.codeforcesHandle}:`,
          error.message
        );
      }
    }
    console.log("Daily Student Sync Job Finished");
  } catch (error) {
    console.error("An error occurred in the main sync job:", error);
  }
};

const scheduleJobs = () => {
  cron.schedule(
    "0 2 * * *",
    () => {
      syncAllStudentsData();
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    }
  );
  console.log("Cron jobs scheduled successfully.");
};

module.exports = { scheduleJobs, syncAllStudentsData };
