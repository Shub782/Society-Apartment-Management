const express = require("express");
const router = express.Router();
const Visitor = require("../models/Visitors");
const { authMiddleware } = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", async (req, res) => {
  const visitors = await Visitor.find();
  res.json(visitors);
});

router.post("/", async (req, res) => {
  try {
    const newVisitor = new Visitor(req.body);
    await newVisitor.save();
    res.status(201).json(newVisitor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    res.json(visitor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedVisitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedVisitor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Visitor.findByIdAndDelete(req.params.id);

    res.json({
      message: "Visitor Deleted Successfully"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/", async (req, res) => {
  try {
    const newVisitor = new Visitor(req.body);
    await newVisitor.save();
    res.status(201).json(newVisitor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    res.json(visitor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedVisitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedVisitor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Visitor.findByIdAndDelete(req.params.id);

    res.json({
      message: "Visitor Deleted Successfully"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id/left", async (req, res) => {
    try {

        const visitor = await Visitor.findById(req.params.id);

        if (!visitor) {
            return res.status(404).json({
                message: "Visitor not found"
            });
        }

        // Already marked as left
        if (visitor.status === "Left") {
            return res.json(visitor);
        }

        visitor.status = "Left";
        visitor.timeOut = new Date().toLocaleTimeString();

        await visitor.save();

        res.json(visitor);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }
});
module.exports = router;
