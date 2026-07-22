import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaCreditCard,
  FaCheckCircle,
  FaClock,
  FaExchangeAlt,
  FaSync,
  FaReceipt
} from "react-icons/fa";
import "../styles/Payments.css";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId") || "60d5ec49f1b2c8a1e8000000";
  const FIXED_MAINTENANCE_AMOUNT = 1500;

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    if (role === "admin") {
      fetchPayments();
    } else {
      checkPaymentStatus();
    }
  }, [role, userId]);

  const checkPaymentStatus = async () => {
    try {
      if (userId && userId !== "60d5ec49f1b2c8a1e8000000") {
        const res = await axios.get(`http://localhost:5000/api/payments/status/${userId}`);
        setHasPaid(res.data.hasPaid);
      }
    } catch (error) {
      console.log("Error checking payment status:", error);
    }
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/payments");
      setPayments(res.data);
    } catch (error) {
      console.log("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      const { data: order } = await axios.post("http://localhost:5000/api/payments/create-order", {
        amount: FIXED_MAINTENANCE_AMOUNT,
        userId: userId
      });

      const options = {
        key: "rzp_test_TBEiUI4TC5ky81",
        amount: order.amount,
        currency: order.currency,
        name: "Society Maintenance",
        description: "Monthly Maintenance Bill",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post("http://localhost:5000/api/payments/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.status === 200) {
              alert("Payment Successful!");
              if (role === "admin") {
                fetchPayments();
              } else {
                setHasPaid(true);
              }
            }
          } catch (error) {
            console.error("Verification error:", error);
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: localStorage.getItem("fullName") || "Resident",
          email: localStorage.getItem("email") || "resident@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        alert("Payment Failed: " + response.error.description);
      });
      rzp.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Error initiating payment. Please try again.");
    }
  };

  // Calculate stats
  const totalAmountCollected = payments.reduce((acc, p) => p.status === "successful" ? acc + p.amount : acc, 0);
  const totalSuccessfulCount = payments.filter(p => p.status === "successful").length;

  return (
    <div className="payments-page">
      <div className="payments-container">
        {/* Header Section */}
        <div className="payments-header">
          <div className="payments-header-left">
            <span className="section-tag">SOCIETY PAYMENTS</span>
            <h1>Maintenance Bills</h1>
            <p>
              Pay monthly society maintenance fees securely via Razorpay gateway and view real-time transaction history.
            </p>
          </div>

          <div className="payments-header-buttons">
            <button className="dashboard-btn" onClick={() => navigate("/dashboard")}>
              Dashboard
            </button>
            {role === "admin" && (
              <button className="refresh-btn" onClick={fetchPayments}>
                <FaSync style={{ marginRight: "8px" }} /> Refresh
              </button>
            )}
          </div>
        </div>

        {/* Statistics Row */}
        <div className="payments-stats-grid">
          <div className="payment-stat-card">
            <div className="stat-icon-badge">
              <FaCreditCard />
            </div>
            <div className="stat-info">
              <h2>₹{FIXED_MAINTENANCE_AMOUNT}</h2>
              <p>Monthly Maintenance Bill</p>
            </div>
          </div>

          <div className="payment-stat-card">
            <div className="stat-icon-badge" style={{ color: "#16a34a", background: "rgba(34, 197, 94, 0.1)" }}>
              <FaCheckCircle />
            </div>
            <div className="stat-info">
              <h2>{hasPaid || role === "admin" ? (role === "admin" ? totalSuccessfulCount : "Paid") : "Due"}</h2>
              <p>{role === "admin" ? "Successful Payments" : "My Payment Status"}</p>
            </div>
          </div>

          <div className="payment-stat-card">
            <div className="stat-icon-badge" style={{ color: "#d97706", background: "rgba(245, 158, 11, 0.1)" }}>
              <FaExchangeAlt />
            </div>
            <div className="stat-info">
              <h2>{role === "admin" ? `₹${totalAmountCollected}` : "Razorpay"}</h2>
              <p>{role === "admin" ? "Total Revenue Collected" : "Payment Gateway"}</p>
            </div>
          </div>

          <div className="payment-stat-card">
            <div className="stat-icon-badge" style={{ color: "#9333ea", background: "rgba(147, 51, 234, 0.1)" }}>
              <FaReceipt />
            </div>
            <div className="stat-info">
              <h2>{role === "admin" ? payments.length : "1st of Month"}</h2>
              <p>{role === "admin" ? "Total Transactions" : "Bill Cycle"}</p>
            </div>
          </div>
        </div>

        {/* Resident Billing Section */}
        {role !== "admin" && (
          <div className="resident-billing-section">
            <div className="billing-card">
              <div className="billing-card-header">
                <h3>Monthly Maintenance Fee</h3>
                <span className={`billing-badge ${hasPaid ? "paid" : "due"}`}>
                  {hasPaid ? <><FaCheckCircle /> Paid</> : <><FaClock /> Payment Due</>}
                </span>
              </div>

              <div className="billing-amount-box">
                <span className="amount-label">Amount Due This Month</span>
                <div className="amount-value">₹{FIXED_MAINTENANCE_AMOUNT}</div>
              </div>

              {hasPaid ? (
                <div className="paid-success-banner">
                  <FaCheckCircle /> Maintenance Payment Completed for this Month
                </div>
              ) : (
                <button className="pay-now-btn" onClick={handlePayment}>
                  <FaCreditCard /> Pay ₹{FIXED_MAINTENANCE_AMOUNT} Now with Razorpay
                </button>
              )}
            </div>
          </div>
        )}

        {/* Admin Transactions Data Table / History */}
        {(role === "admin" || payments.length > 0) && (
          <div className="table-card-container">
            <div className="table-header-row">
              <h3>Recent Payment Transactions</h3>
            </div>

            <div className="payment-table-wrapper">
              <table className="payments-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center", padding: "24px" }}>
                        Loading transaction history...
                      </td>
                    </tr>
                  ) : payments.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center", padding: "24px", color: "#64748b" }}>
                        No transactions recorded yet.
                      </td>
                    </tr>
                  ) : (
                    payments.map((p) => (
                      <tr key={p._id}>
                        <td>
                          <span className="order-id-cell">{p.razorpayOrderId}</span>
                        </td>
                        <td className="amount-cell">₹{p.amount}</td>
                        <td>
                          <span className={`status-pill ${p.status ? p.status.toLowerCase() : "pending"}`}>
                            {p.status === "successful" ? <FaCheckCircle /> : null}
                            {p.status}
                          </span>
                        </td>
                        <td>{new Date(p.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Payments;
