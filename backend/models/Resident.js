const mongoose = require("mongoose");

const residentSchema = new mongoose.Schema({
  name: String,
  flatNo: String,
  phone: String,
  email: String,
  status: {
    type: String,
    default: "Active"
  }
});

module.exports = mongoose.model("Resident", residentSchema);