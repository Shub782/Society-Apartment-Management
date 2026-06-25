const express = require("express");
const router = express.Router();
const Resident = require("../models/Resident");


router.get("/", async (req, res) => {
  const residents = await Resident.find();
  res.json(residents);
});


router.post("/", async (req, res) => {
  try {
    const newResident = new Resident(req.body);
    await newResident.save();
    res.status(201).json(newResident);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;