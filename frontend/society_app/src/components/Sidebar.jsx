import "../styles/Sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";
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
  FaTimes,
  FaVoteYea
} from "react-icons/fa";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    if (typeof window !== "undefined" && window.innerWidth <= 900) {
      setSidebarOpen(false);
    }
  };

  const handleNavClick = (path) => {
    navigate(path);
    if (typeof window !== "undefined" && window.innerWidth <= 900) {
      setSidebarOpen(false);
    }
  };

  return (
    <aside className={`youtube-sidebar ${sidebarOpen ? "open" : ""}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo" onClick={() => handleNavClick("/dashboard")}>
          <div className="logo-icon">
            <FaBuilding />
          </div>
          <div className="logo-text">
            <h2>GokulDham</h2>
            <p>Society Management</p>
          </div>
        </div>

        <button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen(false)}
          title="Close Menu"
        >
          <FaTimes />
        </button>
      </div>

      {/* Navigation Section */}
      <div className="sidebar-nav">
        <span className="menu-title">MAIN MENU</span>

        <div
          className={`menu-link ${location.pathname === "/dashboard" ? "active" : ""}`}
          onClick={() => handleNavClick("/dashboard")}
        >
          <div className="link-icon"><FaHome /></div>
          <span>Dashboard</span>
        </div>

        <div
          className={`menu-link ${location.pathname === "/residents" || location.pathname.includes("/resident") ? "active" : ""}`}
          onClick={() => handleNavClick("/residents")}
        >
          <div className="link-icon"><FaUsers /></div>
          <span>Residents</span>
        </div>

        <div
          className={`menu-link ${location.pathname === "/visitors" || location.pathname.includes("/visitor") ? "active" : ""}`}
          onClick={() => handleNavClick("/visitors")}
        >
          <div className="link-icon"><FaUserFriends /></div>
          <span>Visitors</span>
        </div>

        <span className="menu-title">SOCIETY SERVICES</span>

        <div
          className={`menu-link ${location.pathname === "/polls" ? "active" : ""}`}
          onClick={() => handleNavClick("/polls")}
        >
          <div className="link-icon"><FaVoteYea /></div>
          <span>Polls & Voting</span>
        </div>

        <div
          className={`menu-link ${location.pathname === "/complaints" || location.pathname.includes("/complaint") ? "active" : ""}`}
          onClick={() => handleNavClick("/complaints")}
        >
          <div className="link-icon"><FaExclamationCircle /></div>
          <span>Complaints</span>
        </div>

        <div
          className={`menu-link ${location.pathname === "/notices" || location.pathname.includes("/notice") ? "active" : ""}`}
          onClick={() => handleNavClick("/notices")}
        >
          <div className="link-icon"><FaBullhorn /></div>
          <span>Notices</span>
        </div>

        <div
          className={`menu-link ${location.pathname === "/events" || location.pathname.includes("/event") ? "active" : ""}`}
          onClick={() => handleNavClick("/events")}
        >
          <div className="link-icon"><FaCalendarAlt /></div>
          <span>Events</span>
        </div>

        <div
          className={`menu-link ${location.pathname === "/documents" || location.pathname.includes("/document") ? "active" : ""}`}
          onClick={() => handleNavClick("/documents")}
        >
          <div className="link-icon"><FaFileAlt /></div>
          <span>Documents</span>
        </div>

        <div
          className={`menu-link ${location.pathname === "/payments" ? "active" : ""}`}
          onClick={() => handleNavClick("/payments")}
        >
          <div className="link-icon"><FaCreditCard /></div>
          <span>Payments</span>
        </div>

        <div
          className={`menu-link ${location.pathname === "/reports" ? "active" : ""}`}
          onClick={() => handleNavClick("/reports")}
        >
          <div className="link-icon"><FaChartBar /></div>
          <span>Reports</span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="sidebar-bottom">
        <div
          className={`menu-link ${location.pathname === "/settings" ? "active" : ""}`}
          onClick={() => handleNavClick("/settings")}
        >
          <div className="link-icon"><FaCog /></div>
          <span>Settings</span>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <div className="link-icon"><FaSignOutAlt /></div>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;