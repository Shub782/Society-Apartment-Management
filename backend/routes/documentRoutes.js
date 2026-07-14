const express = require("express");
const router = express.Router();
const Document = require("../models/Document");
const upload = require("../middleware/multer");
const fs = require("fs");
const path = require("path");

// GET all documents
router.get("/", async (req, res) => {
    try {
        const documents = await Document.find().sort({ uploadedAt: -1 });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new document (Admin only typically, but we handle auth in frontend for now)
router.post("/", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const document = new Document({
            title: req.body.title,
            description: req.body.description,
            fileUrl: req.file.filename
        });

        await document.save();
        res.status(201).json(document);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a document
router.delete("/:id", async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        // Delete the file from the uploads folder
        const filePath = path.join(__dirname, "..", "uploads", document.fileUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Document.findByIdAndDelete(req.params.id);
        res.json({ message: "Document deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
