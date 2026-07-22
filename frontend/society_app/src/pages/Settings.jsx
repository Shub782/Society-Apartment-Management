import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaMapMarkerAlt,
  FaLock,
  FaCamera,
  FaSave,
  FaKey,
  FaShieldAlt
} from "react-icons/fa";
import "../styles/Settings.css";

function Settings() {
  const [settings, setSettings] = useState({
    secretaryName: "",
    secretaryEmail: "",
    secretaryPhone: "",
    societyName: "",
    societyAddress: ""
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("");
  const role = localStorage.getItem("role");

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/settings");
      setSettings(res.data);
      if (res.data.profileImage) {
        setPreview(`http://localhost:5000/uploads/${res.data.profileImage}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveSettings = async () => {
    try {
      const res = await axios.put("http://localhost:5000/api/settings", settings);
      alert(res.data.message || "Settings updated successfully!");
    } catch (error) {
      console.log(error);
      alert("Failed to save settings");
    }
  };

  const updatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    try {
      const res = await axios.put(
        "http://localhost:5000/api/settings/change-password",
        passwordData
      );
      alert(res.data.message || "Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update password");
    }
  };

  const uploadProfileImage = async () => {
    if (!profileImage) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", profileImage);

    try {
      const res = await axios.put(
        "http://localhost:5000/api/settings/upload-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Profile image uploaded successfully!");
      console.log(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to upload image.");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div className="settings-page-view">
      <div className="settings-container-box">
        {/* Header Banner */}
        <div className="settings-header-card">
          <div className="header-info">
            <span className="settings-section-tag">PROFILE & SETTINGS</span>
            <h1>Account Settings</h1>
            <p>
              Manage your administrator profile, society details, and security credentials.
            </p>
          </div>
          <div className="header-badge-chip">
            <FaShieldAlt className="shield-chip-icon" />
            <span>{role === "admin" ? "Secretary Admin" : "Resident"} Account</span>
          </div>
        </div>

        {/* Profile Details Card */}
        <div className="settings-card-box">
          <div className="card-box-header">
            <h3>
              <FaUser className="header-card-icon" /> Profile Details
            </h3>
            <p>Update your personal information and profile picture.</p>
          </div>

          <div className="profile-hero-section">
            <div className="avatar-wrapper">
              {preview ? (
                <img src={preview} alt="Profile" className="profile-preview-img" />
              ) : (
                <div className="avatar-initials">
                  {settings.secretaryName ? settings.secretaryName.charAt(0).toUpperCase() : "S"}
                </div>
              )}
              <button
                className="camera-overlay-btn"
                onClick={() => document.getElementById("profileImage").click()}
                title="Change Photo"
              >
                <FaCamera />
              </button>
            </div>

            <div className="avatar-actions">
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setProfileImage(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
              <button
                className="btn-secondary-action"
                onClick={() => document.getElementById("profileImage").click()}
              >
                Choose Photo
              </button>
              <button className="btn-primary-action" onClick={uploadProfileImage}>
                Upload Photo
              </button>
            </div>
          </div>

          <div className="settings-form-grid">
            <div className="form-input-group">
              <label>Secretary / Name</label>
              <div className="field-wrapper">
                <FaUser className="input-field-icon" />
                <input
                  type="text"
                  name="secretaryName"
                  value={settings.secretaryName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />
              </div>
            </div>

            <div className="form-input-group">
              <label>Email Address</label>
              <div className="field-wrapper">
                <FaEnvelope className="input-field-icon" />
                <input
                  type="email"
                  name="secretaryEmail"
                  value={settings.secretaryEmail}
                  onChange={handleChange}
                  placeholder="name@society.com"
                />
              </div>
            </div>

            <div className="form-input-group full-span">
              <label>Phone Number</label>
              <div className="field-wrapper">
                <FaPhone className="input-field-icon" />
                <input
                  type="text"
                  name="secretaryPhone"
                  value={settings.secretaryPhone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Society Information Card */}
        <div className="settings-card-box">
          <div className="card-box-header">
            <h3>
              <FaBuilding className="header-card-icon" /> Society Information
            </h3>
            <p>Society name and official address.</p>
          </div>

          <div className="settings-form-grid">
            <div className="form-input-group full-span">
              <label>Society Name</label>
              <div className="field-wrapper">
                <FaBuilding className="input-field-icon" />
                <input
                  type="text"
                  name="societyName"
                  value={settings.societyName}
                  onChange={handleChange}
                  placeholder="Gokuldham Co-operative Housing Society"
                />
              </div>
            </div>

            <div className="form-input-group full-span">
              <label>Society Address</label>
              <div className="field-wrapper textarea-wrapper">
                <FaMapMarkerAlt className="input-field-icon textarea-icon" />
                <textarea
                  name="societyAddress"
                  value={settings.societyAddress}
                  onChange={handleChange}
                  placeholder="Enter full society address"
                />
              </div>
            </div>
          </div>

          <div className="card-action-bar">
            <button className="save-changes-btn" onClick={saveSettings}>
              <FaSave /> Save Profile & Society Info
            </button>
          </div>
        </div>

        {/* Password Security Card */}
        <div className="settings-card-box">
          <div className="card-box-header">
            <h3>
              <FaLock className="header-card-icon" /> Change Password
            </h3>
            <p>Update your password to keep your account secure.</p>
          </div>

          <div className="settings-form-grid">
            <div className="form-input-group full-span">
              <label>Current Password</label>
              <div className="field-wrapper">
                <FaLock className="input-field-icon" />
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Enter current password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>

            <div className="form-input-group">
              <label>New Password</label>
              <div className="field-wrapper">
                <FaKey className="input-field-icon" />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>

            <div className="form-input-group">
              <label>Confirm Password</label>
              <div className="field-wrapper">
                <FaKey className="input-field-icon" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>
          </div>

          <div className="card-action-bar">
            <button className="update-pwd-btn" onClick={updatePassword}>
              <FaKey /> Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;