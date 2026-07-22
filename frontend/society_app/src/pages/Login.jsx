import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaBuilding,
  FaArrowRight,
  FaShieldAlt,
  FaSpinner,
  FaExclamationCircle
} from "react-icons/fa";
import "../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill in both email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);
        localStorage.setItem("fullName", res.data.user.fullName);
        localStorage.setItem("flatNo", res.data.user.flatNo);
        localStorage.setItem("userId", res.data.user._id);
        localStorage.setItem("email", res.data.user.email);

        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(
        error.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      {/* Dynamic Vibrant Fading Color Orbs */}
      <div className="fading-color-blob blob-1"></div>
      <div className="fading-color-blob blob-2"></div>
      <div className="fading-color-blob blob-3"></div>
      <div className="fading-color-blob blob-4"></div>

      <div className="login-card-box">
        {/* Header Section */}
        <div className="login-card-header">
          <div className="login-brand-logo">
            <FaBuilding className="brand-logo-icon" />
          </div>
          <h2>Society Portal</h2>
          <p className="login-card-subtitle">
            Welcome back! Log in to manage payments, notices & maintenance.
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="login-error-banner">
            <FaExclamationCircle className="alert-banner-icon" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Section */}
        <form onSubmit={handleLogin} className="login-card-form">
          <div className="login-field-group">
            <label htmlFor="login-email">Email Address</label>
            <div className={`login-input-wrapper ${emailFocused ? "focused" : ""}`}>
              <FaEnvelope className="field-icon" />
              <input
                id="login-email"
                type="email"
                className="login-input-field"
                placeholder="name@society.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="login-field-group">
            <label htmlFor="login-password">Password</label>
            <div className={`login-input-wrapper ${passFocused ? "focused" : ""}`}>
              <FaLock className="field-icon" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                className="login-input-field"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPassFocused(true)}
                onBlur={() => setPassFocused(false)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <FaSpinner className="spinner-icon" /> Signing in...
              </>
            ) : (
              <>
                Sign In to Portal <FaArrowRight className="btn-arrow" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="login-card-footer">
          <p className="signup-prompt">
            Don't have an account?{" "}
            <Link to="/signup" className="signup-link-btn">
              Sign Up
            </Link>
          </p>

          <div className="login-security-badge">
            <FaShieldAlt className="shield-badge-icon" />
            <span>Secure Society Portal & Resident Gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
}