import StatCard from "../components/statCard";
import RecentComplaints from "../components/RecentComplaints";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Dashboard.css";

import {
  FaUser,
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaClipboardCheck,
  FaUsers,
  FaUserFriends,
  FaExclamationCircle,
  FaCreditCard
} from "react-icons/fa";

function Dashboard() {
  const [residentCount, setResidentCount] = useState(0);
  const [visitorCount, setVisitorCount] = useState(0);
  const [pendingPaymentsCount, setPendingPaymentsCount] = useState(1);
  const [paymentSubtitle, setPaymentSubtitle] = useState("₹1,500 Monthly Maint. Due");
  const [showNotifications, setShowNotifications] = useState(false);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [complaints, setComplaints] = useState([]);

  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const fullName = localStorage.getItem("fullName");
  const flatNo = localStorage.getItem("flatNo");
  const navigate = useNavigate();

  const fetchProfileImage = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/settings");
      if (res.data.profileImage) {
        setProfileImage(`http://localhost:5000/uploads/${res.data.profileImage}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/complaints");
      setComplaints(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPaymentStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      if (role === "admin") {
        const res = await axios.get("http://localhost:5000/api/payments/stats", config);
        const count = typeof res.data.pendingCount === "number" ? res.data.pendingCount : 0;
        setPendingPaymentsCount(count);
        setPaymentSubtitle(
          count === 0
            ? "All Society Dues Cleared"
            : `${count} Resident Dues Pending`
        );
      } else {
        if (userId) {
          const res = await axios.get(`http://localhost:5000/api/payments/status/${userId}`, config);
          if (res.data.hasPaid) {
            setPendingPaymentsCount(0);
            setPaymentSubtitle("All Dues Cleared");
          } else {
            setPendingPaymentsCount(1);
            setPaymentSubtitle("₹1,500 Monthly Maint. Due");
          }
        }
      }
    } catch (error) {
      console.log(error);
      setPendingPaymentsCount(1);
      setPaymentSubtitle("₹1,500 Monthly Maint. Due");
    }
  };

  useEffect(() => {
    fetchResidents();
    fetchVisitors();
    if (role === "admin") {
      fetchPendingUsers();
    }
    fetchProfileImage();
    fetchComplaints();
    fetchPaymentStats();
  }, []);

  const fetchResidents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/residents");
      setResidentCount(res.data.length);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchVisitors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/visitors");
      setVisitorCount(res.data.length);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get("http://localhost:5000/api/users/pending", config);
      const sanitized = res.data.map(u => ({
        ...u,
        flatNo: u.flatNo || "",
        phone: u.phone || "",
        email: u.email || "",
        fullName: u.fullName || ""
      }));
      setPendingUsers(sanitized);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="main-content" style={{ marginLeft: 0, width: "100%" }}>
      <div className="dashboard-header">
        <svg
          className="header-border-svg"
          viewBox="0 0 1000 260"
          preserveAspectRatio="none"
        >
          <rect
            className="border-path"
            x="4"
            y="4"
            width="992"
            height="252"
            rx="22"
            ry="22"
          />
          <rect
            className="border-light"
            x="4"
            y="4"
            width="992"
            height="252"
            rx="22"
            ry="22"
          />
        </svg>

        <div className="header-content">
          <span className="header-tag">
            {role === "admin" ? "ADMIN PANEL" : "RESIDENT PANEL"}
          </span>

          <h2>
            {role === "admin" ? "Society Dashboard" : "Resident Dashboard"}
          </h2>

          <p>
            {role === "admin"
              ? "Manage residents, visitors and society operations from one place."
              : "View notices, events and your society information from one place."}
          </p>
        </div>
      </div>

      <div className="cards-container">
        <StatCard
          title="Total Residents"
          value={residentCount}
          icon={<FaUsers />}
          subtitle="Active Residents"
        />

        <StatCard
          title="Active Complaints"
          value={complaints.length}
          icon={<FaExclamationCircle />}
          subtitle={
            complaints.length === 0 ? "No Complaints" : "Open Complaints"
          }
        />

        <StatCard
          title="Visitors"
          value={visitorCount}
          icon={<FaUserFriends />}
          subtitle="Today's Visitors"
        />

        <StatCard
          title="Pending Payments"
          value={pendingPaymentsCount}
          icon={<FaCreditCard />}
          subtitle={paymentSubtitle}
        />
      </div>

      <RecentComplaints complaints={complaints} />

      {showModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Resident Details</h2>

            <div className="detail-row">
              <FaUser className="detail-icon" />
              <div>
                <span>Name</span>
                <p>{selectedUser.fullName}</p>
              </div>
            </div>

            <div className="detail-row">
              <FaBuilding className="detail-icon" />
              <div>
                <span>Flat Number</span>
                <p>{selectedUser.flatNo}</p>
              </div>
            </div>

            <div className="detail-row">
              <FaEnvelope className="detail-icon" />
              <div>
                <span>Email Address</span>
                <p>{selectedUser.email}</p>
              </div>
            </div>

            <div className="detail-row">
              <FaPhone className="detail-icon" />
              <div>
                <span>Phone Number</span>
                <p>{selectedUser.phone}</p>
              </div>
            </div>

            <div className="detail-row">
              <FaClipboardCheck className="detail-icon" />
              <div>
                <span>Status</span>
                <p>{selectedUser.status}</p>
              </div>
            </div>

            <div className="modal-buttons">
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;