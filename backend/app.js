require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const residentRoutes = require("./routes/residentRoutes");
const visitorRoutes =  require("./routes/visitorRoutes");
const userRoutes = require("./routes/userRoutes");
const flatRoutes = require("./routes/flatRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const eventRoutes = require("./routes/events");
const noticeRoutes = require("./routes/notices");
const reportRoutes = require("./routes/reportRoutes");
const documentRoutes = require("./routes/documentRoutes");

const app = express();


app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/residents", residentRoutes);
app.use("/api/visitors",visitorRoutes);
app.use("/api/users", userRoutes);
app.use("/api/flats",flatRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/notices",noticeRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/documents", documentRoutes);

connectDB();

app.get("/", (req, res) => {
  res.send("Society Apartment Management API 🚀");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🔥`);
});