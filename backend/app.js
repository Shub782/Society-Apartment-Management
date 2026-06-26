require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const residentRoutes = require("./routes/residentRoutes");
const visitorRoutes =  require("./routes/visitorRoutes");

const app = express();


app.use(cors());
app.use(express.json());
app.use("/api/residents", residentRoutes);
app.use("/api/visitors",visitorRoutes);


connectDB();

app.get("/", (req, res) => {
  res.send("Society Apartment Management API 🚀");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🔥`);
});