const express = require("express");
const SOS = require("../models/SOS");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(authMiddleware);

// Trigger Emergency Alert
router.post("/trigger", async (req, res) => {
    try {
        const { userId, fullName, flatNo, phone, emergencyType, message } = req.body;

        if (!fullName || !flatNo || !emergencyType) {
            return res.status(400).json({ error: "fullName, flatNo and emergencyType are required" });
        }

        const newSOS = new SOS({
            userId,
            fullName,
            flatNo,
            phone: phone || "",
            emergencyType,
            message: message || "",
            status: "Active"
        });

        await newSOS.save();
        res.status(201).json({ message: "Emergency alert triggered successfully!", sos: newSOS });
    } catch (error) {
        console.error("Error triggering SOS:", error);
        res.status(500).json({ error: "Failed to trigger SOS alert" });
    }
});

// Get Active Emergency Alerts
router.get("/active", async (req, res) => {
    try {
        const activeAlerts = await SOS.find({ status: "Active" }).sort({ createdAt: -1 });
        res.json(activeAlerts);
    } catch (error) {
        console.error("Error fetching active SOS alerts:", error);
        res.status(500).json({ error: "Failed to fetch SOS alerts" });
    }
});

// Resolve Emergency Alert
router.put("/:id/resolve", async (req, res) => {
    try {
        const { id } = req.params;
        const resolved = await SOS.findByIdAndUpdate(id, { status: "Resolved" }, { new: true });
        if (!resolved) {
            return res.status(404).json({ error: "Alert not found" });
        }
        res.json({ message: "Emergency alert resolved successfully", sos: resolved });
    } catch (error) {
        console.error("Error resolving SOS:", error);
        res.status(500).json({ error: "Failed to resolve SOS alert" });
    }
});

module.exports = router;
