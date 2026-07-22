const mongoose = require("mongoose");

const SOSSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fullName: { type: String, required: true },
    flatNo: { type: String, required: true },
    phone: { type: String, default: "" },
    emergencyType: { 
        type: String, 
        enum: ["Medical", "Fire", "Lift Stuck", "Security"], 
        required: true 
    },
    message: { type: String, default: "" },
    status: { type: String, enum: ["Active", "Resolved"], default: "Active" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SOS", SOSSchema);
