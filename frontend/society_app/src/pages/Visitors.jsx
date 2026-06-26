import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Residents.css";
import { useNavigate } from "react-router-dom";

const Visitors = () => {
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    const fetchVisitors = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5000/api/visitors"
            );

            setVisitors(res.data);
            setLoading(false);

        } catch (err) {
            console.log("Error fetching visitors:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisitors();
    }, []);

    const filteredVisitors = visitors.filter((visitor) =>
        visitor.visitorName
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||

        visitor.flatNo
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );

    const totalVisits = visitors.filter(
        (visitor) =>
            visitor.visitorName
                ?.toLowerCase()
                .includes(search.toLowerCase())
    ).length;
    const handleMarkLeft = async (id) => {
        try {

            await axios.put(
                `http://localhost:5000/api/visitors/${id}/left`
            );

            fetchVisitors();

        } catch (error) {

            console.log(error);

            alert("Failed to update visitor");

        }
    };
    const lastVisit =
        filteredVisitors.length > 0
            ? filteredVisitors[filteredVisitors.length - 1]
            : null;

    return (
        <div className="page">

            <h2>Visitors</h2>
            <button
                className="dashboard-btn"
                onClick={() => navigate("/dashboard")}
            >
                Back to Dashboard
            </button>

            <div className="resident-actions">

                <button
                    className="add-btn"
                    onClick={() => navigate("/addvisitor")}
                >
                    + Add Visitor
                </button>

                <input
                    type="text"
                    className="search-input"
                    placeholder="Search Visitor or Flat No..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>

            {search && totalVisits > 0 && (
                <div className="visitor-summary">

                    <h3>Visitor Summary</h3>

                    <p>
                        <strong>Total Visits:</strong> {totalVisits}
                    </p>

                    {lastVisit && (
                        <>
                            <p>
                                <strong>Last Visit Date:</strong> {lastVisit.date}
                            </p>

                            <p>
                                <strong>Last Visit Time:</strong> {lastVisit.timeIn}
                            </p>
                        </>
                    )}

                </div>
            )}

            {loading ? (
                <p>Loading visitors...</p>
            ) : (
                <div className="table-container">

                    <table>

                        <thead>
                            <tr>
                                <th>Visitor Name</th>
                                <th>Phone</th>
                                <th>Flat No</th>
                                <th>Purpose</th>
                                <th>Date</th>
                                <th>Time In</th>
                                <th>Time Out</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredVisitors.map((visitor) => (
                                <tr key={visitor._id}>
                                    <td>{visitor.visitorName}</td>
                                    <td>{visitor.phone}</td>
                                    <td>{visitor.flatNo}</td>
                                    <td>{visitor.purpose}</td>
                                    <td>{visitor.date}</td>
                                    <td>{visitor.timeIn}</td>
                                    <td>{visitor.timeOut}</td>
                                    <td>{visitor.status}</td>
                                    <td>
                                        {visitor.status === "Inside" && (
                                            <button
                                                className="left-btn"
                                                onClick={() => handleMarkLeft(visitor._id)}
                                            >
                                                Mark Left
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                </div>
            )}

        </div>
    );


};

export default Visitors;
