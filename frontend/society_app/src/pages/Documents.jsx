import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/Documents.css";
import { FaFileAlt, FaTrash, FaDownload, FaPlus } from "react-icons/fa";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/documents");
      setDocuments(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await axios.delete(`http://localhost:5000/api/documents/${id}`);
        fetchDocuments();
      } catch (error) {
        console.log(error);
        alert("Failed to delete document");
      }
    }
  };

  return (
    <div className="documents-container dashboard-container">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="main-content">
        <div className="top-navbar">
          <div className="top-navbar-title-wrapper">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </button>
            <div className="top-navbar-title">
              <h3>Society Documents</h3>
            </div>
          </div>
        </div>

        <div className="documents-header dashboard-header">
          <div className="header-content">
            <span className="header-tag">DOCUMENTS</span>
            <h2>Important Files</h2>
            <p>View and download official society documents and guidelines.</p>
          </div>
          {role === "admin" && (
            <Link to="/add-document" className="add-document-btn">
              <FaPlus /> Add Document
            </Link>
          )}
        </div>

        <div className="documents-list">
          {documents.length === 0 ? (
            <div className="no-documents">
              <p>No documents available yet.</p>
            </div>
          ) : (
            documents.map((doc) => (
              <div key={doc._id} className="document-card">
                <div className="doc-icon">
                  <FaFileAlt />
                </div>
                <div className="doc-details">
                  <h4>{doc.title}</h4>
                  <p>{doc.description}</p>
                  <span className="doc-date">
                    Uploaded on: {new Date(doc.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="doc-actions">
                  <a
                    href={`http://localhost:5000/uploads/${doc.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-btn"
                    download
                  >
                    <FaDownload /> View/Download
                  </a>
                  {role === "admin" && (
                    <button className="delete-btn" onClick={() => handleDelete(doc._id)}>
                      <FaTrash /> Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Documents;
