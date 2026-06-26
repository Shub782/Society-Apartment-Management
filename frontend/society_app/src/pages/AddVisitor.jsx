import { useState } from "react";
import "../styles/AddResident.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaHome,
  FaPhone,
  FaCalendar,
  FaClock
} from "react-icons/fa";

function AddVisitor() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    visitorName: "",
    phone: "",
    flatNo: "",
    purpose: "",
    date: "",
    timeIn: "",
    status: "Inside"
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {

      const res = await axios.post(
        "http://localhost:5000/api/visitors",
        formData
      );

      console.log(res.data);


      navigate("/visitors");

    } catch (error) {

      console.log(error);

      alert("Failed to Add Visitor");
    }
  };

  return (
    <div className="add-resident-page">
      <div className="add-resident-card">

        <h2>Add Visitor</h2>
        <p>Register a visitor entry</p>

        <div className="form-grid">

          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="visitorName"
              placeholder="Visitor Name"
              value={formData.visitorName}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <FaPhone className="input-icon" />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <FaHome className="input-icon" />
            <input
              type="text"
              name="flatNo"
              placeholder="Visiting Flat No"
              value={formData.flatNo}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="purpose"
              placeholder="Purpose of Visit"
              value={formData.purpose}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <FaCalendar className="input-icon" />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <FaClock className="input-icon" />
            <input
              type="time"
              name="timeIn"
              value={formData.timeIn}
              onChange={handleChange}
            />
          </div>

        </div>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Inside">Inside</option>
          <option value="Left">Left</option>
        </select>

        <button
          className="save-btn"
          onClick={handleSubmit}
        >
          Save Visitor
        </button>

      </div>
    </div>
  );
}

export default AddVisitor;