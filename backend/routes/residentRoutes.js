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
router.get("/:id", async (req, res) => {
  try {

    const resident = await Resident.findById(req.params.id);

    res.json(resident);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
});
router.delete("/:id", async (req, res) => {
    try {

        await Resident.findByIdAndDelete(req.params.id);

        res.json({
            message: "Resident Deleted Successfully"
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});
router.put("/:id", async (req, res) => {
  try {

    const updatedResident = await Resident.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedResident);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;