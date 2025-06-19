const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendInactivityEmail = async (toEmail, studentName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Reminder from TLE Eliminators!",
    html: `<p>Hi ${studentName},</p><p>You haven't made any submissions on Codeforces in the last week. Just a friendly reminder to get back to problem-solving.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Inactivity email sent to ${toEmail}`);
  } catch (error) {
    console.error(`Failed to send email to ${toEmail}:`, error);
  }
};
module.exports = { sendInactivityEmail };
