const Log = require("../models/Log");

exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find().populate("studentId", "name email");
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};