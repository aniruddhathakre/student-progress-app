const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter a name"],
    },
    email: {
      type: String,
      required: [true, "Enter email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Enter valid email",
      ],
    },
    phone: {
      type: Number,
      default: 0,
    },
    codeforcesHandle: {
      type: String,
      required: [true, "Add codeforces handle"],
      unique: true,
    },
    currentRating: {
      type: Number,
      default: 0,
    },
    maxRating: {
      type: Number,
      default: 0,
    },
    contestHistory: {
      type: Array,
      default: [],
    },
    submissionHistory: {
      type: Array,
      default: [],
    },
    lastSyncedAt: {
      type: Date,
    },
    isEmailDisbale: {
      type: Boolean,
      default: false,
    },
    reminderEmailCount: {
      type: Number,
      default: 0,
    },
  },
  {
    // Automatically add createdAt , updatedAt
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);
