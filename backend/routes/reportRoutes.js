const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Visitor = require("../models/Visitors");
const Complaint = require("../models/Complaint");
const Notice = require("../models/Notice");
const Event = require("../models/Event");
const { authMiddleware } = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/", async (req, res) => {
    try {

        const residents = await User.countDocuments({
            role: "resident",
            status: "Approved"
        });
        const approvedResidents = await User.countDocuments({
            role: "resident",
            status: "Approved"
        });

        const pendingResidents = await User.countDocuments({
            role: "resident",
            status: "Pending"
        });

        const rejectedResidents = await User.countDocuments({
            role: "resident",
            status: "Rejected"
        });

        const visitors = await Visitor.countDocuments();

        const complaints = await Complaint.countDocuments();
        const pendingComplaints = await Complaint.countDocuments({
            status: "Pending"
        });

        const inProgressComplaints = await Complaint.countDocuments({
            status: "In Progress"
        });

        const resolvedComplaints = await Complaint.countDocuments({
            status: "Resolved"
        });

        const notices = await Notice.countDocuments();


        const complaintsByMonth = {};

        const allComplaints = await Complaint.find();


        allComplaints.forEach((complaint) => {

            const complaintDate = complaint.date;


            if (!complaintDate) return;


            const parts = complaintDate.split("/");


            const day = parts[0];
            const month = parts[1];
            const year = parts[2];


            const dateObj = new Date(
                year,
                month - 1,
                day
            );


            const monthName = dateObj.toLocaleString(
                "default",
                {
                    month: "short"
                }
            );


            if (complaintsByMonth[monthName]) {

                complaintsByMonth[monthName]++;

            }
            else {

                complaintsByMonth[monthName] = 1;

            }

        });


        const complaintTrend = Object.keys(complaintsByMonth).map((month) => ({

            month,
            complaints: complaintsByMonth[month]

        }));
        const events = await Event.countDocuments();
        res.json({

            residents,

            visitors,

            complaints,

            notices,

            events,

            pendingComplaints,

            inProgressComplaints,

            resolvedComplaints,


            approvedResidents,
            pendingResidents,
            rejectedResidents,
            complaintTrend

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});

module.exports = router;