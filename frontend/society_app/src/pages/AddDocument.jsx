import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import "../styles/Documents.css";
import { FaUpload, FaArrowLeft } from "react-icons/fa";

function AddDocument() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/documents", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Document uploaded successfully!");
      navigate("/documents");
    } catch (error) {
      console.log(error);
      alert("Failed to upload document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container documents-container">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="main-content">
        <div className="top-navbar">
          <div className="top-navbar-title-wrapper">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </button>
            <div className="top-navbar-title">
              <h3>Upload Document</h3>
            </div>
          </div>
        </div>

        <div className="documents-header dashboard-header">
           <button className="back-btn" onClick={() => navigate("/documents")}>
              <FaArrowLeft /> Back to Documents
           </button>
           <div className="header-content" style={{marginTop: '15px'}}>
             <h2>Add New Document</h2>
             <p>Upload a new official file for the society residents.</p>
           </div>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="document-form">
            <div className="form-group">
              <label>Document Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g., Annual Meeting Minutes 2026"
              />
            </div>

            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief details about this document..."
                rows="3"
              ></textarea>
            </div>

            <div className="form-group">
              <label>Select File</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                  id="doc-file"
                  className="file-input"
                />
                <label htmlFor="doc-file" className="file-label">
                  <FaUpload /> {file ? file.name : "Choose a file..."}
                </label>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Uploading..." : "Upload Document"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddDocument;
