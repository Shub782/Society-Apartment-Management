const express = require("express");
const router = express.Router();

const Settings = require("../models/Settings");
const User = require("../models/User");
const upload = require("../middleware/multer");
const { authMiddleware } = require("../middleware/authMiddleware");

router.use(authMiddleware);


// GET Settings

router.get("/", async (req, res) => {

    try {

        let settings = await Settings.findOne();

        if (!settings) {

            settings = await Settings.create({});

        }

        res.json(settings);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// UPDATE Settings

router.put("/", async (req, res) => {

    try {

        let settings = await Settings.findOne();

        if (!settings) {

            settings = new Settings();

        }

        settings.secretaryName = req.body.secretaryName;
        settings.secretaryEmail = req.body.secretaryEmail;
        settings.secretaryPhone = req.body.secretaryPhone;
        settings.societyName = req.body.societyName;
        settings.societyAddress = req.body.societyAddress;

        await settings.save();

        res.json({
            message: "Settings updated successfully",
            settings
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

router.put("/change-password", async (req, res) => {

    try {

        const {
            currentPassword,
            newPassword,
            confirmPassword
        } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "New passwords do not match"
            });
        }

        const settings = await Settings.findOne();

        if (!settings) {
            return res.status(404).json({
                message: "Settings not found"
            });
        }

        const user = await User.findOne({
            email: settings.secretaryEmail
        });

        if (!user) {
            return res.status(404).json({
                message: "Secretary account not found"
            });
        }

        const isMatch = await user.comparePassword(currentPassword);
        const isPlainTextMatch = user.password === currentPassword;

        if (!isMatch && !isPlainTextMatch) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        user.password = newPassword;

        await user.save();

        res.json({
            message: "Password updated successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});
router.put(
    "/upload-profile",
    upload.single("profileImage"),
    async (req, res) => {

        try {

            let settings = await Settings.findOne();

            if (!settings) {
                settings = new Settings();
            }

            settings.profileImage = req.file.filename;

            await settings.save();

            res.json({
                success: true,
                message: "Profile image uploaded successfully!",
                profileImage: settings.profileImage
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                success: false,
                message: "Failed to upload profile image."
            });

        }

    }
);

module.exports = router;