const { spawn } = require("child_process");
const Log = require("../models/Log");

exports.analyzeFrame = async (req, res) => {
  try {
    const python = spawn("python", ["../ai-engine/main.py"]);

    let result = "";

    python.stdout.on("data", (data) => {
      result += data.toString();
    });

    python.on("close", async () => {
      const aiResult = JSON.parse(result);

      await Log.create({
        studentId: req.user.id,
        eventType: aiResult.eventType,
        riskScore: aiResult.riskScore,
        screenshot: aiResult.screenshot
      });

      res.json(aiResult);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};