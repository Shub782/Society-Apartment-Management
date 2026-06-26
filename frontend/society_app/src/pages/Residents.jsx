import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Residents.css";
import { useNavigate } from "react-router-dom";

const Residents = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const fetchResidents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/residents");
      setResidents(res.data);
      setLoading(false);
    } catch (err) {
      console.log("Error fetching residents:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resident?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `http://localhost:5000/api/residents/${id}`
      );

      fetchResidents();

    } catch (error) {

      console.log(error);

      alert("Failed to delete resident");
    }
  };
  const filteredResidents = residents.filter((resident) =>
    resident.name.toLowerCase().includes(search.toLowerCase()) ||
    resident.flatNo.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="page">
      <h2>Residents</h2>
      <button
        className="dashboard-btn"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>
      <div className="resident-actions">

        <button
          className="add-btn"
          onClick={() => navigate("/add-resident")}
        >
          + Add Resident
        </button>

        <input
          type="text"
          className="search-input"
          placeholder="Search by Name or Flat No..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {loading ? (
        <p>Loading residents...</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Flat No</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredResidents.map((r) => (
                <tr key={r._id}>
                  <td>{r.name}</td>
                  <td>{r.flatNo}</td>
                  <td>{r.phone}</td>
                  <td>{r.email}</td>
                  <td>{r.status}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/edit-resident/${r._id}`)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(r._id)}
                    >
                      Delete
                    </button>
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

export default Residents;