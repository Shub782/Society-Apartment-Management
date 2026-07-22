const mongoose = require("mongoose");

const OptionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    votes: { type: Number, default: 0 }
});

const PollSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    options: [OptionSchema],
    votedUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: String, default: "Secretary" },
    status: { type: String, enum: ["Active", "Closed"], default: "Active" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Poll", PollSchema);
