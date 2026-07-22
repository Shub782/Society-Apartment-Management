const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Flat = require("../models/Flat");
const Resident = require("../models/Resident");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");


// Signup
router.post("/signup", async (req, res) => {
    try {

        const {
            fullName,
            email,
            phone,
            flatNo,
            occupancyType,
            password
        } = req.body;

        // Check email
        const existingEmail = await User.findOne({ email });

        if (existingEmail) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // Check flat
        const existingFlat = await User.findOne({ flatNo });

        if (existingFlat) {
            return res.status(400).json({
                message: "Flat already occupied"
            });
        }

        const newUser = new User({
            fullName,
            email,
            phone,
            flatNo,
            occupancyType: occupancyType || "rent",
            password
        });

        await newUser.save();

        const updatedFlat = await Flat.findOneAndUpdate(
            { flatNo },
            { occupied: true },
            { new: true }
        );

        console.log(updatedFlat);

        res.status(201).json({
            message: "Account Created Successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }
});
router.get("/pending", authMiddleware, isAdmin, async (req, res) => {
    try {
        const users = await User.find({
            status: "Pending"
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Approve Resident
router.put("/approve/:id", authMiddleware, isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status: "Approved" },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Create a Resident record upon approval
        const newResident = new Resident({
            name: user.fullName,
            flatNo: user.flatNo,
            phone: user.phone,
            email: user.email,
            occupancyType: user.occupancyType || "rent",
            status: "Active"
        });
        await newResident.save();

        res.json({
            message: "Resident approved successfully",
            user,
            resident: newResident
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Reject Resident
router.put("/reject/:id", authMiddleware, isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { status: "Rejected" },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await Flat.findOneAndUpdate(
            { flatNo: user.flatNo },
            { occupied: false }
        );

        res.json({
            message: "Resident rejected successfully",
            user
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});
// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await user.comparePassword(password);
        const isPlainTextMatch = user.password === password;

        if (!isMatch && !isPlainTextMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }

        if (user.status === "Pending") {
            return res.status(400).json({
                success: false,
                message: "Your account is waiting for approval."
            });
        }

        if (user.status === "Rejected") {
            return res.status(400).json({
                success: false,
                message: "Your registration request has been rejected by the society administrator. Contact society Secretary"
            });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || "super_secret_jwt_key_gokuldham_society_1234",
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
module.exports = router;