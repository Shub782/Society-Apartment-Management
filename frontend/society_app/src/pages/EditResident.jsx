import { useState, useEffect } from "react";
import "../styles/AddResident.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaHome,
  FaPhone,
  FaEnvelope
} from "react-icons/fa";

function EditResident() {

  const navigate = useNavigate();
  const { id } = useParams();

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

  const fetchResident = async () => {
    try {

      const res = await axios.get(
        `http://localhost:5000/api/residents/${id}`
      );

      setFormData(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchResident();
  }, []);

  const handleSubmit = async () => {
    try {

      await axios.put(
        `http://localhost:5000/api/residents/${id}`,
        formData
      );


      navigate("/residents");

    } catch (error) {

      console.log(error);

      alert("Failed to Update Resident");
    }
  };
console.log(formData);
  return (
    <div className="add-resident-page">
      <div className="add-resident-card">

        <button
          className="back-btn"
          onClick={() => navigate("/residents")}
        >
          ← Back to Residents
        </button>

        <h2>Edit Resident</h2>
        <p>Update resident information</p>

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
              placeholder="Flat number"
             value={formData.flatNo || ""}
              disabled
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
          Update Resident
        </button>

      </div>
    </div>
  );
}

export default EditResident;