import { useState } from "react";
import "../styles/AddResident.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaHome,
  FaPhone,
  FaEnvelope
} from "react-icons/fa";

function AddResident() {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    flatNo: "",
    phone: "",
    email: "",
    status: "Active"
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
        "http://localhost:5000/api/residents",
        formData
      );

      

      navigate("/residents");

      console.log(res.data);

    } catch (error) {
      console.log(error);
      alert("Failed to Add Resident");
    }
  };

  return (
    <div className="add-resident-page">
      <div className="add-resident-card">

        <h2>Add Resident</h2>
        <p>Add a new resident to the society</p>

        <div className="form-grid">

          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <FaHome className="input-icon" />
            <input
              type="text"
              name="flatNo"
              placeholder="Flat Number"
              value={formData.flatNo}
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
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

        </div>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button
          className="save-btn"
          onClick={handleSubmit}
        >
          Save Resident
        </button>

      </div>
    </div>
  );
}

export default AddResident;