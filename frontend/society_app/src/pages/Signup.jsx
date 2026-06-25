import "../styles/Signup.css";
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaBuilding,
    FaLock
} from "react-icons/fa";

function Signup() {
    return (
        <div className="signup-container">
            <div className="signup-card">
                {/* Professional SVG Icon - no emoji */}
                <div className="signup-icon-wrapper">
                    <svg 
                        className="signup-icon"
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path 
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" 
                            fill="white"
                        />
                    </svg>
                </div>

                <div className="signup-header">
                    <h2>Sign Up</h2>
                    <p>Create your account and get started</p>
                </div>

                <div className="form-grid">
                    <div className="input-group full-width">
                        <FaUser className="input-icon" />
                        <input type="text" placeholder="Full Name" required />
                    </div>

                    <div className="input-group full-width">
                        <FaEnvelope className="input-icon" />
                        <input type="email" placeholder="Email Address" required />
                    </div>

                    <div className="input-group">
                        <FaPhone className="input-icon" />
                        <input type="tel" placeholder="(+91) Phone Number" required/>
                    </div>

                    <div className="input-group">
                        <FaBuilding className="input-icon" />
                        <input type="text" placeholder="Apartment Number" required/>
                    </div>

                    <div className="input-group">
                        <FaLock className="input-icon" />
                        <input type="password" placeholder="Password" required/>
                    </div>

                    <div className="input-group">
                        <FaLock className="input-icon" />
                        <input type="password" placeholder="Confirm Password"  required/>
                    </div>
                </div>

                <div className="terms-row">
                    <input type="checkbox" id="terms" />
                    <label htmlFor="terms">
                        I agree to the <a href="/terms">Terms & Conditions</a>
                    </label>
                </div>

                <button className="signup-btn">Create Account</button>

                <p className="login-link">
                    Already have an account? <a href="/">Login</a>
                </p>
            </div>
        </div>
    );
}

export default Signup;