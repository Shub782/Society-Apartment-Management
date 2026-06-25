import { useNavigate } from "react-router-dom";
import "../styles/Terms.css";

function Terms() {
    const navigate = useNavigate();
    return (
        <div className="terms-container">
            <div className="terms-card">
                <h2>Terms & Conditions</h2>
                <p className="last-updated">Last Updated: June 2026</p>
                
                <div className="terms-content">
                    <section>
                        <h3>1. Acceptance of Terms</h3>
                        <p>By creating an account, you agree to these terms and conditions.</p>
                    </section>
                    
                    <section>
                        <h3>2. User Accounts</h3>
                        <p>You are responsible for maintaining the confidentiality of your account.</p>
                    </section>
                    
                    <section>
                        <h3>3. Privacy Policy</h3>
                        <p>Your data is protected according to our privacy policy.</p>
                    </section>
                    
                    <section>
                        <h3>4. User Conduct</h3>
                        <p>You agree to use the service responsibly and ethically.</p>
                    </section>
                    
                    <section>
                        <h3>5. Termination</h3>
                        <p>We reserve the right to terminate accounts for violations.</p>
                    </section>
                </div>
                
                <div className="terms-actions">
                    <button className="btn-back" onClick={() => navigate("/signup")}>
                        Back
                    </button>
                    <button className="btn-agree" onClick={() => navigate("/signup")}>
                        I Agree
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Terms;