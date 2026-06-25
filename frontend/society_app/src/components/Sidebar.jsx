import "../styles/Sidebar.css";
import { Link } from "react-router-dom";
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
  FaSignOutAlt
} from "react-icons/fa";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Society Apartment Management</h2>

      <ul className="sidebar-menu">

        <li>
          <Link to="/" className="menu-link">
            <FaHome /> <span>Dashboard</span>
          </Link>
        </li>

        <li>
          <Link to="/residents" className="menu-link">
            <FaUsers /> <span>Residents</span>
          </Link>
        </li>

        <li>
          <Link to="/visitors" className="menu-link">
            <FaUserFriends /> <span>Visitors</span>
          </Link>
        </li>

        <li className="menu-item"><FaExclamationCircle /> <span>Complaints</span></li>
        <li className="menu-item"><FaBullhorn /> <span>Notices</span></li>
        <li className="menu-item"><FaCalendarAlt /> <span>Events</span></li>
        <li className="menu-item"><FaFileAlt /> <span>Documents</span></li>
        <li className="menu-item"><FaCreditCard /> <span>Payments</span></li>
        <li className="menu-item"><FaChartBar /> <span>Reports</span></li>
        <li className="menu-item"><FaCog /> <span>Settings</span></li>
        <li className="menu-item"><FaSignOutAlt /> <span>Logout</span></li>

      </ul>
    </div>
  );
}

export default Sidebar;