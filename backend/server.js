const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const examRoutes = require("./routes/examRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/exam", examRoutes);

app.get("/", (req, res) => {
  res.send("AI Proctoring Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));