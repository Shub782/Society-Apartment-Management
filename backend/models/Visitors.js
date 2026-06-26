const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  visitorName: String,
  phone: String,
  flatNo: String,
  purpose: String,
  date: String,
  timeIn: String,
  timeOut: {
    type: String,
    default: "-"
},
  status: {
    type: String,
    default: "Inside"
  }
});

module.exports = mongoose.model("Visitor", visitorSchema);