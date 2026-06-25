import Sidebar from "../components/Sidebar";
import StatCard from "../components/statCard";
import RecentComplaints from "../components/RecentComplaints";
import "../styles/Dashboard.css";


function Dashboard() {

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="dashboard-header">
          <h2>Society Dashboard</h2>
          <p>Welcome to the Society Management Platform</p>
        </div>
        <div className="cards-container">
          <StatCard title="Total Residents" value="" />
          <StatCard title="Active Complaints" value="" />
          <StatCard title="Visitors Today" value="" />
          <StatCard title="Pending Payments" value="" />
        </div>
          <RecentComplaints />
      </div>
    </div>
    
    
  );
}

export default Dashboard;