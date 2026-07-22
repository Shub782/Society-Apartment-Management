const express = require("express");
const router = express.Router();

const Complaint = require("../models/Complaint");
const { authMiddleware } = require("../middleware/authMiddleware");

router.use(authMiddleware);

// Get all complaints
router.get("/", async (req, res) => {
    try {

        const complaints = await Complaint.find();

        res.json(complaints);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});

// Add complaint
router.post("/", async (req, res) => {
    try {

        const complaint = new Complaint(req.body);

        await complaint.save();

        res.status(201).json(complaint);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
});

// Update complaint
router.put("/:id", async (req, res) => {
    try {

        const updatedComplaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedComplaint);

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
});

// Delete complaint
router.delete("/:id", async (req, res) => {
    try {

        await Complaint.findByIdAndDelete(req.params.id);

        res.json({
            message: "Complaint deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});

module.exports = router;