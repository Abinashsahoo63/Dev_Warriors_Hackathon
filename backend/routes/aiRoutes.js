const express = require("express");
const router = express.Router();
const analyze = require("../controllers/aiController").analyzeFrame;
const authMiddleware = require("../middleware/authMiddleware");

router.post("/analyze", authMiddleware, analyze);

module.exports = router;