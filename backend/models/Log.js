const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  eventType: String,
  riskScore: Number,
  screenshot: String
}, { timestamps: true });

module.exports = mongoose.model("Log", logSchema);