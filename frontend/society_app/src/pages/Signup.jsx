import "../styles/Signup.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaLock,
  FaHome,
  FaKey,
  FaCheckCircle,
  FaTag,
  FaShieldAlt
} from "react-icons/fa";

function Signup() {
  const [flats, setFlats] = useState([]);
  const [showFlats, setShowFlats] = useState(false);
  const [occupancyType, setOccupancyType] = useState("rent"); // 'rent' or 'owner'
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    flatNo: "",
    password: "",
    confirmPassword: ""
  });
  const [selectedFlat, setSelectedFlat] = useState("");

  const groupedFlats = {
    A: flats.filter((flat) => flat.flatNo.startsWith("A")),
    B: flats.filter((flat) => flat.flatNo.startsWith("B")),
    C: flats.filter((flat) => flat.flatNo.startsWith("C")),
    D: flats.filter((flat) => flat.flatNo.startsWith("D")),
    E: flats.filter((flat) => flat.flatNo.startsWith("E"))
  };

  useEffect(() => {
    fetchFlats();
  }, []);

  const fetchFlats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/flats");
      setFlats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async () => {
    if (!selectedFlat) {
      alert("Please select an apartment");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/users/signup", {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        flatNo: selectedFlat,
        occupancyType: occupancyType,
        password: formData.password
      });

      alert(res.data.message);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Signup Failed");
    }
  };

  // Pricing calculations
  const rentFee = {
    monthlyRent: "₹15,000",
    maintenance: "₹1,500",
    deposit: "₹30,000",
    totalInitial: "₹46,500"
  };

  const ownerFee = {
    monthlyMaintenance: "₹2,500",
    infraCharge: "₹10,000",
    oneTimeDocFee: "₹2,000",
    totalInitial: "₹14,500"
  };

  const currentPricing = occupancyType === "rent" ? rentFee : ownerFee;

  return (
    <div className="signup-page-container">
      <div className="signup-card-box">
        {/* Header Branding */}
        <div className="signup-brand-header">
          <div className="brand-logo-icon">
            <FaBuilding />
          </div>
          <h2>Join GokulDham Society</h2>
          <p>Create your account & select your residency plan</p>
        </div>

        {/* Residency / Occupancy Type Selector */}
        <div className="occupancy-selector-section">
          <span className="occupancy-label-tag">CHOOSE RESIDENCY TYPE</span>
          <div className="occupancy-pill-grid">
            <div
              className={`occupancy-card ${occupancyType === "rent" ? "active" : ""}`}
              onClick={() => setOccupancyType("rent")}
            >
              <div className="occupancy-icon">
                <FaKey />
              </div>
              <div className="occupancy-info">
                <h4>Tenant (On Rent)</h4>
                <p>Monthly Rent & Maintenance</p>
                <span className="price-badge">₹15,000 / mo</span>
              </div>
              {occupancyType === "rent" && <FaCheckCircle className="selected-check" />}
            </div>

            <div
              className={`occupancy-card ${occupancyType === "owner" ? "active" : ""}`}
              onClick={() => setOccupancyType("owner")}
            >
              <div className="occupancy-icon">
                <FaHome />
              </div>
              <div className="occupancy-info">
                <h4>Permanent Owner</h4>
                <p>Society Membership & Maintenance</p>
                <span className="price-badge">₹2,500 / mo</span>
              </div>
              {occupancyType === "owner" && <FaCheckCircle className="selected-check" />}
            </div>
          </div>
        </div>

        {/* Dynamic Pricing Summary Card */}
        <div className="pricing-summary-card">
          <div className="pricing-summary-header">
            <FaTag className="tag-icon" />
            <span>
              Payment Structure ({occupancyType === "rent" ? "Rent Resident" : "Flat Owner"})
            </span>
          </div>

          <div className="pricing-details-grid">
            {occupancyType === "rent" ? (
              <>
                <div className="pricing-item">
                  <small>Monthly Rent</small>
                  <strong>{rentFee.monthlyRent}</strong>
                </div>
                <div className="pricing-item">
                  <small>Maintenance</small>
                  <strong>{rentFee.maintenance}</strong>
                </div>
                <div className="pricing-item">
                  <small>Security Deposit</small>
                  <strong>{rentFee.deposit}</strong>
                </div>
              </>
            ) : (
              <>
                <div className="pricing-item">
                  <small>Monthly Maint.</small>
                  <strong>{ownerFee.monthlyMaintenance}</strong>
                </div>
                <div className="pricing-item">
                  <small>Infra Charge</small>
                  <strong>{ownerFee.infraCharge}</strong>
                </div>
                <div className="pricing-item">
                  <small>Doc & Admin Fee</small>
                  <strong>{ownerFee.oneTimeDocFee}</strong>
                </div>
              </>
            )}
            <div className="pricing-item total-highlight">
              <small>Initial Payable</small>
              <strong className="total-amount">{currentPricing.totalInitial}</strong>
            </div>
          </div>
        </div>

        {/* Form Inputs Grid */}
        <div className="signup-form-grid">
          <div className="signup-input-wrapper full-width">
            <FaUser className="signup-field-icon" />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="signup-input-wrapper full-width">
            <FaEnvelope className="signup-field-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="signup-input-wrapper">
            <FaPhone className="signup-field-icon" />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="signup-input-wrapper clickable-flat" onClick={() => setShowFlats(!showFlats)}>
            <FaBuilding className="signup-field-icon" />
            <input
              type="text"
              placeholder="Select Apartment"
              value={selectedFlat}
              readOnly
            />
          </div>

          <div className="signup-input-wrapper">
            <FaLock className="signup-field-icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="signup-input-wrapper">
            <FaLock className="signup-field-icon" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Apartment Selection Dropdown Drawer */}
        {showFlats && (
          <div className="flat-selector-box">
            <div className="flat-selector-header">
              <h4>Select Your Apartment</h4>
              <button className="close-flat-btn" onClick={() => setShowFlats(false)}>
                ✕
              </button>
            </div>

            {Object.keys(groupedFlats).map((wingKey) => (
              <div key={wingKey} className="wing-section">
                <span className="wing-title">{wingKey} Wing</span>
                <div className="flat-buttons-grid">
                  {groupedFlats[wingKey].map((flat) => (
                    <button
                      key={flat._id}
                      type="button"
                      disabled={flat.occupied}
                      className={flat.occupied ? "flat-btn occupied" : "flat-btn available"}
                      onClick={() => {
                        setSelectedFlat(flat.flatNo);
                        setFormData({
                          ...formData,
                          flatNo: flat.flatNo
                        });
                        setShowFlats(false);
                      }}
                    >
                      {flat.flatNo}
                      <small>{flat.occupied ? "Occupied" : "Available"}</small>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Terms Checkbox */}
        <div className="signup-terms-row">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">
            I agree to the <a href="/terms">Terms & Conditions</a> and Society Rules
          </label>
        </div>

        {/* Submit Button */}
        <button className="create-account-btn" onClick={handleSignup}>
          Create Account & Request Join
        </button>

        <p className="login-redirect-text">
          Already have an account? <a href="/">Login to Portal</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;