const express = require("express");
const Poll = require("../models/Poll");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(authMiddleware);

// Get all polls
router.get("/", async (req, res) => {
    try {
        const polls = await Poll.find().sort({ createdAt: -1 });
        res.json(polls);
    } catch (error) {
        console.error("Error fetching polls:", error);
        res.status(500).json({ error: "Failed to fetch polls" });
    }
});

// Create a new poll (Secretary/Admin only)
router.post("/", async (req, res) => {
    try {
        const { title, description, options, createdBy } = req.body;
        
        if (!title || !options || options.length < 2) {
            return res.status(400).json({ error: "Title and at least 2 voting options are required." });
        }

        const formattedOptions = options.map(optText => ({
            text: optText,
            votes: 0
        }));

        const newPoll = new Poll({
            title,
            description: description || "",
            options: formattedOptions,
            createdBy: createdBy || "Secretary",
            status: "Active"
        });

        await newPoll.save();
        res.status(201).json(newPoll);
    } catch (error) {
        console.error("Error creating poll:", error);
        res.status(500).json({ error: "Failed to create poll" });
    }
});

// Vote on a poll
router.post("/:id/vote", async (req, res) => {
    try {
        const { id } = req.params;
        const { optionId, userId } = req.body;

        if (!optionId || !userId) {
            return res.status(400).json({ error: "optionId and userId are required" });
        }

        const poll = await Poll.findById(id);
        if (!poll) {
            return res.status(404).json({ error: "Poll not found" });
        }

        if (poll.status === "Closed") {
            return res.status(400).json({ error: "Voting on this poll has been closed." });
        }

        // Check if user has already voted
        const alreadyVoted = poll.votedUserIds.some(uid => uid.toString() === userId.toString());
        if (alreadyVoted) {
            return res.status(400).json({ error: "You have already cast your vote on this poll." });
        }

        // Find and increment vote count for selected option
        const targetOption = poll.options.id(optionId);
        if (!targetOption) {
            return res.status(404).json({ error: "Invalid voting option selected." });
        }

        targetOption.votes += 1;
        poll.votedUserIds.push(userId);

        await poll.save();
        res.json({ message: "Vote cast successfully!", poll });
    } catch (error) {
        console.error("Error voting on poll:", error);
        res.status(500).json({ error: "Failed to submit vote" });
    }
});

// Close a poll
router.put("/:id/close", async (req, res) => {
    try {
        const { id } = req.params;
        const poll = await Poll.findByIdAndUpdate(id, { status: "Closed" }, { new: true });
        if (!poll) {
            return res.status(404).json({ error: "Poll not found" });
        }
        res.json({ message: "Poll closed successfully", poll });
    } catch (error) {
        console.error("Error closing poll:", error);
        res.status(500).json({ error: "Failed to close poll" });
    }
});

// Delete a poll
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Poll.findByIdAndDelete(id);
        res.json({ message: "Poll deleted successfully" });
    } catch (error) {
        console.error("Error deleting poll:", error);
        res.status(500).json({ error: "Failed to delete poll" });
    }
});

module.exports = router;
