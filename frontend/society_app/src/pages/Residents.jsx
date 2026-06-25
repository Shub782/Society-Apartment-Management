import React, { useEffect, useState } from "react";
import axios from "axios";

const Residents = () => {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH from backend
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

  return (
    <div className="page">
      <h2>Residents</h2>

      {loading ? (
        <p>Loading residents...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Flat No</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {residents.map((r) => (
              <tr key={r._id}>
                <td>{r.name}</td>
                <td>{r.flatNo}</td>
                <td>{r.phone}</td>
                <td>{r.email}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Residents;