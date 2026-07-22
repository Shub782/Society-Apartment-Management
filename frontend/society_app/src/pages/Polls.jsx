import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaVoteYea,
  FaPlus,
  FaCheckCircle,
  FaTimes,
  FaLock,
  FaTrash,
  FaBuilding,
  FaPoll,
  FaChartBar,
  FaRegClock
} from "react-icons/fa";
import "../styles/Polls.css";

export default function Polls() {
  const [polls, setPolls] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all', 'active', 'closed'
  const [loading, setLoading] = useState(true);

  // Modal State for Create Poll
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [options, setOptions] = useState(["Yes", "No"]);
  const [submitting, setSubmitting] = useState(false);

  // User details
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await axios.get("http://localhost:5000/api/polls", config);
      setPolls(res.data || []);
    } catch (error) {
      console.error("Error fetching polls:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOptionField = () => {
    if (options.length >= 6) {
      alert("Maximum 6 options allowed per poll.");
      return;
    }
    setOptions([...options, ""]);
  };

  const handleRemoveOptionField = (index) => {
    if (options.length <= 2) {
      alert("At least 2 options are required.");
      return;
    }
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert("Please enter a poll title.");
      return;
    }
    const validOptions = options.map(o => o.trim()).filter(Boolean);
    if (validOptions.length < 2) {
      alert("Please provide at least 2 valid options.");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      await axios.post(
        "http://localhost:5000/api/polls",
        {
          title: newTitle,
          description: newDescription,
          options: validOptions
        },
        config
      );

      alert("New poll created successfully!");
      setShowCreateModal(false);
      setNewTitle("");
      setNewDescription("");
      setOptions(["Yes", "No"]);
      fetchPolls();
    } catch (error) {
      console.error("Error creating poll:", error);
      alert(error.response?.data?.error || "Failed to create poll");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (pollId, optionId) => {
    if (!userId) {
      alert("Please log in to cast your vote.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      await axios.post(
        `http://localhost:5000/api/polls/${pollId}/vote`,
        { optionId, userId },
        config
      );

      alert("Your vote has been cast!");
      fetchPolls();
    } catch (error) {
      console.error("Error casting vote:", error);
      alert(error.response?.data?.error || "Failed to submit vote");
    }
  };

  const handleClosePoll = async (pollId) => {
    if (!window.confirm("Close voting for this poll?")) return;
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.put(`http://localhost:5000/api/polls/${pollId}/close`, {}, config);
      alert("Poll closed!");
      fetchPolls();
    } catch (error) {
      console.error("Error closing poll:", error);
      alert("Failed to close poll");
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (!window.confirm("Delete this poll permanently?")) return;
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await axios.delete(`http://localhost:5000/api/polls/${pollId}`, config);
      alert("Poll deleted!");
      fetchPolls();
    } catch (error) {
      console.error("Error deleting poll:", error);
      alert("Failed to delete poll");
    }
  };

  const filteredPolls = polls.filter((p) => {
    if (filter === "active") return p.status === "Active";
    if (filter === "closed") return p.status === "Closed";
    return true;
  });

  return (
    <div className="polls-page-container">
      {/* Background Ambient Orbs */}
      <div className="fading-color-blob blob-1"></div>
      <div className="fading-color-blob blob-2"></div>

      {/* Header Banner */}
      <div className="polls-header-card">
        <div className="polls-header-left">
          <div className="polls-badge">
            <FaVoteYea className="header-badge-icon" />
            <span>RESIDENT DECISION SYSTEM</span>
          </div>
          <h2>Society Polls & Voting</h2>
          <p>
            Vote on key society initiatives, budget decisions, and community improvements.
          </p>
        </div>

        {role === "admin" && (
          <button
            className="create-poll-primary-btn"
            onClick={() => setShowCreateModal(true)}
          >
            <FaPlus /> Create New Poll
          </button>
        )}
      </div>

      {/* Filter Tabs & Bar */}
      <div className="polls-control-bar">
        <div className="polls-filter-tabs">
          <button
            className={`tab-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Polls ({polls.length})
          </button>
          <button
            className={`tab-btn ${filter === "active" ? "active" : ""}`}
            onClick={() => setFilter("active")}
          >
            Active ({polls.filter((p) => p.status === "Active").length})
          </button>
          <button
            className={`tab-btn ${filter === "closed" ? "active" : ""}`}
            onClick={() => setFilter("closed")}
          >
            Closed ({polls.filter((p) => p.status === "Closed").length})
          </button>
        </div>
      </div>

      {/* Polls Grid */}
      {loading ? (
        <div className="polls-loading-box">
          <p>Loading society polls...</p>
        </div>
      ) : filteredPolls.length === 0 ? (
        <div className="polls-empty-card">
          <FaPoll className="empty-icon" />
          <h3>No Polls Available</h3>
          <p>There are no active or closed polls right now.</p>
        </div>
      ) : (
        <div className="polls-grid-container">
          {filteredPolls.map((poll) => {
            const totalVotes = poll.options.reduce((acc, curr) => acc + curr.votes, 0);
            const userHasVoted = poll.votedUserIds.some(
              (uid) => uid.toString() === userId?.toString()
            );

            return (
              <div key={poll._id} className="poll-card-item">
                <div className="poll-card-header">
                  <div className="poll-title-wrapper">
                    <span
                      className={`poll-status-chip ${
                        poll.status === "Active" ? "active" : "closed"
                      }`}
                    >
                      {poll.status === "Active" ? (
                        <>
                          <FaVoteYea /> Active Voting
                        </>
                      ) : (
                        <>
                          <FaLock /> Voting Closed
                        </>
                      )}
                    </span>
                    <h3>{poll.title}</h3>
                  </div>

                  {role === "admin" && (
                    <div className="admin-poll-actions">
                      {poll.status === "Active" && (
                        <button
                          className="close-poll-icon-btn"
                          title="Close Poll"
                          onClick={() => handleClosePoll(poll._id)}
                        >
                          <FaLock />
                        </button>
                      )}
                      <button
                        className="delete-poll-icon-btn"
                        title="Delete Poll"
                        onClick={() => handleDeletePoll(poll._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>

                {poll.description && (
                  <p className="poll-description-text">{poll.description}</p>
                )}

                <div className="poll-options-list">
                  {poll.options.map((opt) => {
                    const percentage =
                      totalVotes > 0
                        ? Math.round((opt.votes / totalVotes) * 100)
                        : 0;

                    return (
                      <div key={opt._id} className="poll-option-row">
                        <div className="option-text-info">
                          <span className="option-label">{opt.text}</span>
                          <span className="option-percentage">
                            {percentage}% ({opt.votes} votes)
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="progress-track">
                          <div
                            className="progress-fill"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>

                        {/* Vote Button */}
                        {poll.status === "Active" && !userHasVoted && (
                          <button
                            className="cast-vote-btn"
                            onClick={() => handleVote(poll._id, opt._id)}
                          >
                            <FaCheckCircle /> Vote
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="poll-footer-info">
                  <div className="poll-meta">
                    <FaChartBar className="meta-icon" />
                    <span>{totalVotes} Total Votes</span>
                  </div>
                  {userHasVoted && (
                    <div className="voted-user-badge">
                      <FaCheckCircle /> You Voted
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Creating New Poll */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-box create-poll-modal">
            <div className="modal-header-row">
              <h2>Create New Poll</h2>
              <button
                className="close-modal-x"
                onClick={() => setShowCreateModal(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreatePoll}>
              <div className="form-group">
                <label>Poll Title / Question *</label>
                <input
                  type="text"
                  placeholder="E.g., Should we install solar panels on Terrace?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  placeholder="Provide background context or details about the vote..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Voting Options *</label>
                {options.map((optText, idx) => (
                  <div key={idx} className="option-input-row">
                    <input
                      type="text"
                      placeholder={`Option ${idx + 1}`}
                      value={optText}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      required
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        className="remove-opt-btn"
                        onClick={() => handleRemoveOptionField(idx)}
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}

                {options.length < 6 && (
                  <button
                    type="button"
                    className="add-opt-field-btn"
                    onClick={handleAddOptionField}
                  >
                    <FaPlus /> Add Another Option
                  </button>
                )}
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-poll-btn"
                  disabled={submitting}
                >
                  {submitting ? "Publishing..." : "Publish Poll"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
