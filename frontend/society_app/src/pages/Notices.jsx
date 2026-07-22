import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaBullhorn,
  FaExclamationTriangle,
  FaWrench,
  FaCalendarAlt,
  FaSmile,
  FaUser,
  FaClock,
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
  FaThumbtack,
  FaBookmark,
  FaTag
} from "react-icons/fa";
import "../styles/Notice.css";

const Notices = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const role = localStorage.getItem("role");

  const fetchNotices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notices");
      setNotices(res.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const deleteNotice = async (id) => {
    if (!window.confirm("Delete this notice permanently?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/notices/${id}`);
      fetchNotices();
    } catch (error) {
      console.log(error);
    }
  };

  const getCategoryIcon = (category) => {
    const cat = (category || "").toLowerCase();
    if (cat.includes("emergency")) return <FaExclamationTriangle />;
    if (cat.includes("maintenance")) return <FaWrench />;
    if (cat.includes("meeting")) return <FaCalendarAlt />;
    if (cat.includes("festival")) return <FaSmile />;
    return <FaBullhorn />;
  };

  // Filter Notices
  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      (notice.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (notice.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (notice.postedBy || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      (notice.category || "").toLowerCase() === selectedCategory.toLowerCase();

    const matchesPriority =
      selectedPriority === "all" ||
      (notice.priority || "").toLowerCase() === selectedPriority.toLowerCase();

    return matchesSearch && matchesCategory && matchesPriority;
  });

  return (
    <div className="page notices-page-wrapper">
      {/* Header Section */}
      <div className="notice-header">
        <div className="notice-header-left">
          <div className="header-content-card">
            <span className="section-tag">
              <FaBullhorn className="tag-icon" /> NOTICE BOARD
            </span>
            <h1>Society Announcements</h1>
            <p>
              Stay updated with essential society notices, scheduled maintenance work, official general meetings, and emergency broadcasts.
            </p>
            <div className="header-buttons">
              <button
                className="dashboard-btn"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </button>

              {role === "admin" && (
                <button
                  className="add-btn"
                  onClick={() => navigate("/add-notice")}
                >
                  <FaPlus /> Post New Notice
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="notice-controls-bar">
        <div className="search-box-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search notices by title, description or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-chips-row">
          <div className="filter-group">
            <span className="filter-label"><FaTag /> Category:</span>
            <button
              className={`filter-chip ${selectedCategory === "all" ? "active" : ""}`}
              onClick={() => setSelectedCategory("all")}
            >
              All
            </button>
            <button
              className={`filter-chip ${selectedCategory === "general" ? "active" : ""}`}
              onClick={() => setSelectedCategory("general")}
            >
              General
            </button>
            <button
              className={`filter-chip ${selectedCategory === "maintenance" ? "active" : ""}`}
              onClick={() => setSelectedCategory("maintenance")}
            >
              Maintenance
            </button>
            <button
              className={`filter-chip ${selectedCategory === "meeting" ? "active" : ""}`}
              onClick={() => setSelectedCategory("meeting")}
            >
              Meeting
            </button>
            <button
              className={`filter-chip ${selectedCategory === "emergency" ? "active" : ""}`}
              onClick={() => setSelectedCategory("emergency")}
            >
              Emergency
            </button>
          </div>

          <div className="filter-group">
            <span className="filter-label"><FaBookmark /> Priority:</span>
            <button
              className={`filter-chip priority-chip ${selectedPriority === "all" ? "active" : ""}`}
              onClick={() => setSelectedPriority("all")}
            >
              All
            </button>
            <button
              className={`filter-chip priority-chip urgent ${selectedPriority === "urgent" ? "active" : ""}`}
              onClick={() => setSelectedPriority("urgent")}
            >
              Urgent
            </button>
            <button
              className={`filter-chip priority-chip important ${selectedPriority === "important" ? "active" : ""}`}
              onClick={() => setSelectedPriority("important")}
            >
              Important
            </button>
          </div>
        </div>
      </div>

      {/* Notices Cards Grid */}
      <div className="notice-grid">
        {filteredNotices.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FaBullhorn />
            </div>
            <h2>No Notices Found</h2>
            <p>
              {searchTerm || selectedCategory !== "all" || selectedPriority !== "all"
                ? "No notices match your current search and filter criteria."
                : "No active notices available at the moment."}
            </p>
          </div>
        ) : (
          filteredNotices.map((notice) => {
            const categoryClass = notice.category ? notice.category.toLowerCase() : "general";
            const priorityClass = notice.priority ? notice.priority.toLowerCase() : "normal";

            return (
              <div
                className={`notice-card category-border-${categoryClass} priority-glow-${priorityClass}`}
                key={notice._id}
              >
                {/* Decorative Pin for Urgent/Important */}
                {(priorityClass === "urgent" || priorityClass === "important") && (
                  <div className="card-pin-badge" title="Pinned Announcement">
                    <FaThumbtack />
                  </div>
                )}

                {/* Card Header with Category & Priority Badges */}
                <div className="notice-card-top-bar">
                  <div className={`notice-category-badge cat-${categoryClass}`}>
                    <span className="cat-icon">{getCategoryIcon(notice.category)}</span>
                    <span className="cat-text">{notice.category || "General"}</span>
                  </div>

                  <span className={`notice-priority-badge prio-${priorityClass}`}>
                    {priorityClass === "urgent" && <span className="urgent-pulse-dot" />}
                    {notice.priority || "Normal"}
                  </span>
                </div>

                {/* Card Main Title & Content */}
                <div className="notice-card-body">
                  <h2>{notice.title}</h2>
                  <p className="notice-description">{notice.description}</p>
                </div>

                {/* Meta Details: Author & Timestamp */}
                <div className="notice-card-meta">
                  <div className="meta-item">
                    <FaUser className="meta-icon" />
                    <span>{notice.postedBy || "Management"}</span>
                  </div>
                  <div className="meta-item">
                    <FaClock className="meta-icon" />
                    <span>{new Date(notice.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>

                {/* Admin Action Buttons */}
                {role === "admin" && (
                  <div className="notice-card-actions">
                    <button
                      className="edit-notice-btn"
                      onClick={() => navigate(`/edit-notice/${notice._id}`)}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="delete-notice-btn"
                      onClick={() => deleteNotice(notice._id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notices;