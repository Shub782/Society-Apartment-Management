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
          <Route path="/edit-resident/:id"element={<EditResident />}/>
          <Route path="/visitors" element={<Visitors />} />
          <Route path="/addvisitor" element={<AddVisitors />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </BrowserRouter>
  );
}