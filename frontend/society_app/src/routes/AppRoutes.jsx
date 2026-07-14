import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Signup from "../pages/Signup";
import Terms from "../pages/Terms";
import Residents from "../pages/Residents";
import MainLayout from "../layouts/MainLayout";
import AddResident from "../pages/AddResident";
import EditResident from "../pages/EditResident";
import Visitors from "../pages/Visitors";
import AddVisitors from "../pages/AddVisitor";
import PendingResidents from "../pages/PendingResidents";
import Settings from "../pages/Settings";
import Complaints from "../pages/Complaints";
import AddComplaint from "../pages/AddComplaint";
import Events from "../pages/Events";
import AddEvent from "../pages/AddEvent";
import EditEvent from "../pages/EditEvent";
import Notices from "../pages/Notices";
import AddNotice from "../pages/AddNotice";
import EditNotice from "../pages/EditNotice";
import Reports from "../pages/Reports";
import Documents from "../pages/Documents";
import AddDocument from "../pages/AddDocument";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<MainLayout />}></Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/residents" element={<Residents />} />
        <Route path="/add-resident" element={<AddResident />} />
        <Route path="/edit-resident/:id" element={<EditResident />} />
        <Route path="/visitors" element={<Visitors />} />
        <Route path="/addvisitor" element={<AddVisitors />} />
        <Route path="/pending-residents" element={<PendingResidents />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/add-complaint" element={<AddComplaint />} />
        <Route path="/events" element={<Events />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/add-event" element={<AddEvent />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/add-notice" element={<AddNotice />} />
        <Route path="/edit-notice/:id" element={<EditNotice />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/add-document" element={<AddDocument />} />
        <Route
          path="/edit-event/:id"
          element={<EditEvent />}
        />
      </Routes>
    </BrowserRouter>
  );
}