import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaBars,
  FaBuilding,
  FaUserCircle,
  FaBell,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaClipboardCheck,
  FaCreditCard,
  FaExclamationTriangle,
  FaPaperPlane,
  FaCalendarAlt,
  FaBullhorn,
  FaUserFriends,
  FaAmbulance,
  FaFire,
  FaShieldAlt,
  FaCheckCircle,
  FaTimes
} from "react-icons/fa";
import "../styles/Layout.css";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(typeof window !== "undefined" ? window.innerWidth > 900 : true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifTab, setNotifTab] = useState("all");

  // Admin Notification Data
  const [pendingUsers, setPendingUsers] = useState([]);
  const [unpaidResidents, setUnpaidResidents] = useState([]);
  const [openComplaints, setOpenComplaints] = useState([]);
  const [reminderSentMap, setReminderSentMap] = useState({});

  // Resident Notification Data
  const [residentNotifs, setResidentNotifs] = useState([]);

  // Emergency SOS State
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [selectedEmergencyType, setSelectedEmergencyType] = useState("Medical");
  const [sosMessage, setSosMessage] = useState("");
  const [activeSOSAlerts, setActiveSOSAlerts] = useState([]);
  const [sosLoading, setSosLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const fullName = localStorage.getItem("fullName") || "Resident";
  const flatNo = localStorage.getItem("flatNo") || "A-101";

  useEffect(() => {
    if (role === "admin") {
      fetchAdminNotifications();
    } else {
      fetchResidentNotifications();
    }
    fetchProfileImage();
    fetchActiveSOSAlerts();

    // Poll SOS alerts every 10 seconds for real-time safety
    const sosInterval = setInterval(fetchActiveSOSAlerts, 10000);
    return () => clearInterval(sosInterval);
  }, [role]);

  const fetchProfileImage = async () => {
    try {
      const res = await axios.get("https://society-apartment-management.onrender.com/api/settings");
      if (res.data.profileImage) {
        setProfileImage(`https://society-apartment-management.onrender.com/uploads/${res.data.profileImage}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchActiveSOSAlerts = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get("https://society-apartment-management.onrender.com/api/sos/active", config);
      setActiveSOSAlerts(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTriggerSOS = async () => {
    setSosLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const payload = {
        userId,
        fullName: fullName || "Resident",
        flatNo: flatNo || "A-101",
        emergencyType: selectedEmergencyType,
        message: sosMessage
      };

      await axios.post("https://society-apartment-management.onrender.com/api/sos/trigger", payload, config);
      alert(`EMERGENCY SOS ALERT SENT! Security and Secretary have been notified.`);
      setShowSOSModal(false);
      setSosMessage("");
      fetchActiveSOSAlerts();
    } catch (error) {
      console.error(error);
      alert("Failed to trigger SOS alert. Please contact gate security directly.");
    } finally {
      setSosLoading(false);
    }
  };

  const handleResolveSOS = async (sosId) => {
    if (!window.confirm("Mark this emergency alert as RESOLVED?")) return;
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.put(`https://society-apartment-management.onrender.com/api/sos/${sosId}/resolve`, {}, config);
      alert("Emergency alert resolved!");
      fetchActiveSOSAlerts();
    } catch (error) {
      console.error(error);
      alert("Failed to resolve alert");
    }
  };

  const fetchAdminNotifications = async () => {
    const token = localStorage.getItem("token");
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    // 1. Fetch pending resident registrations
    try {
      const res = await axios.get("https://society-apartment-management.onrender.com/api/users/pending", config);
      const sanitized = (res.data || []).map(u => ({
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

    // 2. Fetch unpaid residents for current month
    try {
      const res = await axios.get("https://society-apartment-management.onrender.com/api/payments/unpaid-residents", config);
      setUnpaidResidents(res.data || []);
    } catch (error) {
      console.log(error);
    }

    // 3. Fetch open complaints
    try {
      const res = await axios.get("https://society-apartment-management.onrender.com/api/complaints");
      const openOnly = (res.data || []).filter(c => c.status !== "Resolved");
      setOpenComplaints(openOnly);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchResidentNotifications = async () => {
    const token = localStorage.getItem("token");
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    let list = [];

    // 1. Payment Due Check
    try {
      if (userId) {
        const payRes = await axios.get(`https://society-apartment-management.onrender.com/api/payments/status/${userId}`, config);
        if (!payRes.data.hasPaid) {
          list.push({
            id: "pay_due",
            type: "payment",
            title: "Maintenance Payment Due",
            message: "Your monthly maintenance payment of ₹1,500 is due.",
            btnText: "Pay Now",
            link: "/payments",
            icon: <FaCreditCard />
          });
        }
      }
    } catch (error) {
      console.log(error);
    }

    // 2. Latest Event Check
    try {
      const eventRes = await axios.get("https://society-apartment-management.onrender.com/api/events");
      if (eventRes.data && eventRes.data.length > 0) {
        list.push({
          id: "event_new",
          type: "event",
          title: "New Event Added",
          message: "A new event has been added to society calendar.",
          btnText: "",
          link: "",
          icon: <FaCalendarAlt />
        });
      }
    } catch (error) {
      console.log(error);
    }

    // 3. Latest Notice Check
    try {
      const noticeRes = await axios.get("https://society-apartment-management.onrender.com/api/notices");
      if (noticeRes.data && noticeRes.data.length > 0) {
        list.push({
          id: "notice_new",
          type: "notice",
          title: "New Notice Published",
          message: "A new notice has been published on the board.",
          btnText: "",
          link: "",
          icon: <FaBullhorn />
        });
      }
    } catch (error) {
      console.log(error);
    }

    // 4. New Resident Joined Check
    try {
      const resList = await axios.get("https://society-apartment-management.onrender.com/api/residents", config);
      if (resList.data && resList.data.length > 0) {
        const latest = resList.data[resList.data.length - 1];
        list.push({
          id: "res_new",
          type: "resident",
          title: "New Resident Joined",
          message: latest.name ? `A new resident (${latest.name}) has joined.` : "A new resident has joined the society.",
          btnText: "",
          link: "",
          icon: <FaUserFriends />
        });
      }
    } catch (error) {
      console.log(error);
    }

    // 5. Complaints Update Check
    try {
      const compRes = await axios.get("https://society-apartment-management.onrender.com/api/complaints");
      if (compRes.data && compRes.data.length > 0) {
        list.push({
          id: "comp_new",
          type: "complaint",
          title: "Complaint Update",
          message: "A complaint update is available.",
          btnText: "",
          link: "",
          icon: <FaExclamationTriangle />
        });
      }
    } catch (error) {
      console.log(error);
    }

    setResidentNotifs(list);
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this resident?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`https://society-apartment-management.onrender.com/api/users/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
      fetchAdminNotifications();
    } catch (error) {
      console.log(error);
      alert("Failed to approve resident");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this resident?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`https://society-apartment-management.onrender.com/api/users/reject/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
      fetchAdminNotifications();
    } catch (error) {
      console.log(error);
      alert("Failed to reject resident");
    }
  };

  const handleSendReminder = (residentId, residentName) => {
    setReminderSentMap(prev => ({ ...prev, [residentId]: true }));
    alert(`Payment reminder sent successfully to ${residentName}!`);
  };

  // Badge Counts
  const totalAdminNotifCount = pendingUsers.length + unpaidResidents.length + openComplaints.length;
  const totalResidentNotifCount = residentNotifs.length;
  const activeBadgeCount = role === "admin" ? totalAdminNotifCount : totalResidentNotifCount;

  return (
    <div className={`portal-app-container ${sidebarOpen ? "sidebar-expanded" : ""}`}>
      {/* Persistent Top Navbar */}
      <header className="portal-top-navbar">
        <div className="navbar-left">
          <button
            className="youtube-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle Menu Drawer"
          >
            <FaBars />
          </button>

          <div className="navbar-brand" onClick={() => navigate("/dashboard")}>
            <div className="brand-logo-small">
              <FaBuilding />
            </div>
            <span className="brand-title">GokulDham</span>
          </div>
        </div>

        <div className="navbar-right">
          {/* Emergency SOS Panic Button (Glowing Red) */}
          <button
            className="sos-panic-btn"
            onClick={() => setShowSOSModal(true)}
            title="Trigger Emergency SOS Panic Button"
          >
            <FaExclamationTriangle className="sos-btn-icon" />
            <span>Emergency SOS</span>
          </button>

          {/* Notification Bell Icon for BOTH Admin and Resident */}
          <div className="notification-wrapper" style={{ position: "relative" }}>
            <button
              className="notification-bell-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
            >
              <FaBell />
              {activeBadgeCount > 0 && (
                <span className="bell-badge-count">{activeBadgeCount}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-panel-box">
                <div className="notif-panel-header">
                  <h4>{role === "admin" ? "Secretary Control Alerts" : "Society Notifications"}</h4>
                  <span className="notif-total-badge">{activeBadgeCount} New</span>
                </div>

                {role === "admin" ? (
                  /* ADMIN NOTIFICATION PANEL */
                  <>
                    <div className="notif-filter-tabs">
                      <button
                        className={`tab-chip ${notifTab === "all" ? "active" : ""}`}
                        onClick={() => setNotifTab("all")}
                      >
                        All ({totalAdminNotifCount})
                      </button>
                      <button
                        className={`tab-chip ${notifTab === "join" ? "active" : ""}`}
                        onClick={() => setNotifTab("join")}
                      >
                        Joins ({pendingUsers.length})
                      </button>
                      <button
                        className={`tab-chip ${notifTab === "payment" ? "active" : ""}`}
                        onClick={() => setNotifTab("payment")}
                      >
                        Dues ({unpaidResidents.length})
                      </button>
                      <button
                        className={`tab-chip ${notifTab === "complaint" ? "active" : ""}`}
                        onClick={() => setNotifTab("complaint")}
                      >
                        Complaints ({openComplaints.length})
                      </button>
                    </div>

                    <div className="notif-scroll-area">
                      {totalAdminNotifCount === 0 ? (
                        <p className="no-notif-msg">All society alerts cleared!</p>
                      ) : (
                        <>
                          {(notifTab === "all" || notifTab === "join") &&
                            pendingUsers.map((user) => (
                              <div key={user._id} className="notification-item-card join-card">
                                <div className="notif-card-header-row">
                                  <div className="notif-icon-box icon-box-resident">
                                    <FaUser />
                                  </div>
                                  <div className="notif-card-body-text">
                                    <h5>New Resident Registration</h5>
                                    <p className="notif-user-text">
                                      <strong>{user.fullName}</strong> requested flat{" "}
                                      <strong>{user.flatNo}</strong>.
                                    </p>
                                  </div>
                                </div>
                                <div className="notif-action-btns">
                                  <button
                                    className="notif-view-btn"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setShowModal(true);
                                      setShowNotifications(false);
                                    }}
                                  >
                                    View
                                  </button>
                                  <button
                                    className="notif-approve-btn"
                                    onClick={() => handleApprove(user._id)}
                                  >
                                    Approve
                                  </button>
                                  <button
                                    className="notif-reject-btn"
                                    onClick={() => handleReject(user._id)}
                                  >
                                    Reject
                                  </button>
                                </div>
                              </div>
                            ))}

                          {(notifTab === "all" || notifTab === "payment") &&
                            unpaidResidents.map((resItem) => (
                              <div key={resItem._id} className="notification-item-card payment-card">
                                <div className="notif-card-header-row">
                                  <div className="notif-icon-box icon-box-payment">
                                    <FaCreditCard />
                                  </div>
                                  <div className="notif-card-body-text">
                                    <h5>Maintenance Payment Overdue</h5>
                                    <p className="notif-user-text">
                                      <strong>{resItem.fullName}</strong> ({resItem.flatNo}) has an
                                      unpaid balance of <strong>₹1,500</strong> for this month.
                                    </p>
                                  </div>
                                </div>
                                <div className="notif-action-btns">
                                  <button
                                    className="notif-reminder-btn"
                                    disabled={reminderSentMap[resItem._id]}
                                    onClick={() =>
                                      handleSendReminder(resItem._id, resItem.fullName)
                                    }
                                  >
                                    <FaPaperPlane />{" "}
                                    {reminderSentMap[resItem._id]
                                      ? "Reminder Sent"
                                      : "Send Reminder"}
                                  </button>
                                  <button
                                    className="notif-view-btn"
                                    onClick={() => {
                                      setShowNotifications(false);
                                      navigate("/payments");
                                    }}
                                  >
                                    View Payments
                                  </button>
                                </div>
                              </div>
                            ))}

                          {(notifTab === "all" || notifTab === "complaint") &&
                            openComplaints.map((comp) => (
                              <div key={comp._id} className="notification-item-card complaint-card">
                                <div className="notif-card-header-row">
                                  <div className="notif-icon-box icon-box-complaint">
                                    <FaExclamationTriangle />
                                  </div>
                                  <div className="notif-card-body-text">
                                    <h5>New Complaint Filed</h5>
                                    <p className="notif-user-text">
                                      <strong>{comp.title}</strong> - Status:{" "}
                                      <span className="status-highlight">{comp.status || "Open"}</span>
                                    </p>
                                  </div>
                                </div>
                                <div className="notif-action-btns">
                                  <button
                                    className="notif-view-btn"
                                    onClick={() => {
                                      setShowNotifications(false);
                                      navigate("/complaints");
                                    }}
                                  >
                                    Manage Complaint
                                  </button>
                                </div>
                              </div>
                            ))}
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  /* RESIDENT NOTIFICATION PANEL */
                  <div className="notif-scroll-area">
                    {residentNotifs.length === 0 ? (
                      <p className="no-notif-msg">No new notifications for you right now!</p>
                    ) : (
                      residentNotifs.map((item) => (
                        <div key={item.id} className="notification-item-card">
                          <div className="notif-card-header-row">
                            <div className={`notif-icon-box icon-box-${item.type}`}>
                              {item.icon}
                            </div>
                            <div className="notif-card-body-text">
                              <h5>{item.title}</h5>
                              <p className="notif-user-text">{item.message}</p>
                            </div>
                          </div>
                          {item.btnText && (
                            <div className="notif-action-btns">
                              <button
                                className="notif-pay-primary-btn"
                                onClick={() => {
                                  setShowNotifications(false);
                                  navigate(item.link);
                                }}
                              >
                                {item.btnText}
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Secretary / Resident Profile Badge */}
          <div
            className="user-profile-badge"
            onClick={() => navigate("/settings")}
            title="Go to Settings"
          >
            <div className="user-avatar-circle">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="nav-profile-img" />
              ) : (
                <FaUserCircle className="user-avatar-icon" />
              )}
            </div>
            <div className="profile-text-details">
              <span className="profile-title">
                {role === "admin" ? "Secretary" : fullName}
              </span>
              {role !== "admin" && <small className="profile-sub">{flatNo}</small>}
            </div>
          </div>
        </div>
      </header>

      {/* Real-time Emergency SOS Alert Banner */}
      {activeSOSAlerts.length > 0 && (
        <div className="sos-global-alert-bar">
          <div className="sos-alert-content">
            <FaExclamationTriangle className="pulse-alert-icon" />
            <span>
              <strong>EMERGENCY ALERT:</strong> {activeSOSAlerts[0].fullName} (Flat{" "}
              {activeSOSAlerts[0].flatNo}) triggered{" "}
              <strong className="emergency-tag-highlight">{activeSOSAlerts[0].emergencyType} Emergency</strong>!
            </span>
          </div>
          {role === "admin" && (
            <button
              className="sos-resolve-btn"
              onClick={() => handleResolveSOS(activeSOSAlerts[0]._id)}
            >
              <FaCheckCircle /> Resolve Alert
            </button>
          )}
        </div>
      )}
      {/* Mobile Sidebar Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Push Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content pushed towards right when sidebar is open */}
      <main className={`portal-main-view ${activeSOSAlerts.length > 0 ? "with-sos-banner" : ""}`}>
        <Outlet />
      </main>

      {/* Emergency SOS Panic Modal */}
      {showSOSModal && (
        <div className="modal-overlay">
          <div className="modal-box sos-trigger-modal">
            <div className="sos-modal-header">
              <div className="sos-header-title">
                <FaExclamationTriangle className="header-sos-icon" />
                <h2>Trigger Emergency Alert</h2>
              </div>
              <button className="sos-close-x" onClick={() => setShowSOSModal(false)}>
                <FaTimes />
              </button>
            </div>

            <p className="sos-modal-subtitle">
              Select the type of emergency. Gate Security and Society Secretary will be alerted instantly.
            </p>

            <div className="sos-type-selector-grid">
              <button
                type="button"
                className={`sos-type-card ${selectedEmergencyType === "Medical" ? "active" : ""}`}
                onClick={() => setSelectedEmergencyType("Medical")}
              >
                <div className="type-icon-circle medical">
                  <FaAmbulance />
                </div>
                <span>Medical</span>
              </button>

              <button
                type="button"
                className={`sos-type-card ${selectedEmergencyType === "Fire" ? "active" : ""}`}
                onClick={() => setSelectedEmergencyType("Fire")}
              >
                <div className="type-icon-circle fire">
                  <FaFire />
                </div>
                <span>Fire</span>
              </button>

              <button
                type="button"
                className={`sos-type-card ${selectedEmergencyType === "Lift Stuck" ? "active" : ""}`}
                onClick={() => setSelectedEmergencyType("Lift Stuck")}
              >
                <div className="type-icon-circle lift">
                  <FaBuilding />
                </div>
                <span>Lift Stuck</span>
              </button>

              <button
                type="button"
                className={`sos-type-card ${selectedEmergencyType === "Security" ? "active" : ""}`}
                onClick={() => setSelectedEmergencyType("Security")}
              >
                <div className="type-icon-circle security">
                  <FaShieldAlt />
                </div>
                <span>Security</span>
              </button>
            </div>

            <div className="sos-input-group">
              <label>Additional Details (Optional)</label>
              <textarea
                placeholder="E.g., Require ambulance at Flat A-102 immediately..."
                value={sosMessage}
                onChange={(e) => setSosMessage(e.target.value)}
                rows={3}
              />
            </div>

            <div className="sos-modal-actions">
              <button className="cancel-sos-btn" onClick={() => setShowSOSModal(false)}>
                Cancel
              </button>
              <button
                className="confirm-sos-btn"
                disabled={sosLoading}
                onClick={handleTriggerSOS}
              >
                {sosLoading ? "Broadcasting..." : "Broadcast Emergency Alert"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Resident Detail View */}
      {showModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Resident Registration Details</h2>

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
              <button className="close-btn" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;