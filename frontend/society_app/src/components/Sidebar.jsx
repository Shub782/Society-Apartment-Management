import "../styles/Sidebar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaUserFriends,
  FaExclamationCircle,
  FaBullhorn,
  FaCalendarAlt,
  FaFileAlt,
  FaCreditCard,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaBuilding,
  FaTimes
} from "react-icons/fa";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <button
        className="close-sidebar"
        onClick={() => setSidebarOpen(false)}
      >
        <FaTimes />
      </button>

      {/* Logo */}
      <div className="sidebar-logo">

        <div className="logo-icon">
          <FaBuilding />
        </div>

        <div className="logo-text">
          <h2>GokulDham</h2>
          <p>Society Management</p>
        </div>

      </div>

      {/* Navigation */}

      <div className="sidebar-nav">

        <span className="menu-title">MAIN</span>

        <Link
          to="/dashboard"
          className={`menu-link ${location.pathname === "/dashboard" ? "active" : ""
            }`}
        >
          <FaHome />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/residents"
          className={`menu-link ${location.pathname === "/residents" ? "active" : ""
            }`}
        >
          <FaUsers />
          <span>Residents</span>
        </Link>

        <Link
          to="/visitors"
          className={`menu-link ${location.pathname === "/visitors" ? "active" : ""
            }`}
        >
          <FaUserFriends />
          <span>Visitors</span>
        </Link>

        <span className="menu-title">MANAGEMENT</span>

        <div
          className="menu-link"
          onClick={() => navigate("/complaints")}
        >
          <FaExclamationCircle />
          <span>Complaints</span>
        </div>

        <div className="menu-link"
         onClick={() => navigate("/notices")}
        >
          <FaBullhorn />
          <span>Notices</span>
        </div>

        <div
          className="menu-link"
          onClick={() => navigate("/events")}
        >
          <FaCalendarAlt />
          <span>Events</span>
        </div>

        <div className="menu-link" onClick={() => navigate("/documents")}>
          <FaFileAlt />
          <span>Documents</span>
        </div>

        <div className="menu-link">
          <FaCreditCard />
          <span>Payments</span>
        </div>

        <div className="menu-link" 
          onClick={() => navigate("/reports")}
          >
          <FaChartBar />
          <span>Reports</span>
        </div>

      </div>

      {/* Bottom */}

      <div className="sidebar-bottom">

        <Link
          to="/settings"
          className={`menu-link ${location.pathname === "/settings" ? "active" : ""
            }`}
        >
          <FaCog />
          <span>Settings</span>
        </Link>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;