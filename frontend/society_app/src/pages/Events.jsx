import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Events.css";

const Events = () => {
    const navigate = useNavigate();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const role = localStorage.getItem("role");

    const fetchEvents = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/events");
            setEvents(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this event?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/events/${id}`);
            setEvents(events.filter(event => event._id !== id));
            alert("Event deleted successfully!");
        } catch (error) {
            console.log(error);
            alert("Failed to delete event.");
        }
    };

    const handleEdit = (event) => {
        navigate(`/edit-event/${event._id}`);
    };

    return (
        <div className="events-page">
            {/* Header */}
            <div className="events-header">
                <div className="events-header-left">
                    <div className="header-content-card">
                        <span className="section-tag">EVENT MANAGEMENT</span>
                        <h1>Events</h1>
                        <p>
                            Schedule and view society events with ease. Keep residents informed about upcoming celebrations, meetings and community activities.
                        </p>
                        <div className="header-buttons">
                            <button
                                className="dashboard-btn"
                                onClick={() => navigate("/dashboard")}
                            >
                                Dashboard
                            </button>

                            {role === "admin" && (
                                <button
                                    className="add-event-btn"
                                    onClick={() => navigate("/add-event")}
                                >
                                    + Add Event
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Event Cards */}
            <div className="events-container">
                <div className="events-grid">
                    {events.map((event) => (
                        <div className="event-card" key={event._id}>
                            <div className="event-top">
                                <div className="event-date">
                                    📅 {new Date(event.date).toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric"
                                    })}
                                </div>
                                <span className={`event-status ${event.status ? event.status.toLowerCase() : "upcoming"}`}>
                                    {event.status || "Upcoming"}
                                </span>
                            </div>

                            <div className="event-body">
                                <div className="event-details">
                                    <h3>{event.title}</h3>
                                    <p>🕒 {event.startTime}</p>
                                    <p>📍 {event.venue}</p>
                                </div>
                                <div className="event-image">
                                    <img
                                        src={event.eventImage || "/default-event.png"}
                                        alt={event.title}
                                    />
                                </div>
                            </div>

                            <div className="event-footer">
                                <div className="event-actions">
                                    <button
                                        className="view-event-btn"
                                        onClick={() => setSelectedEvent(event)}
                                    >
                                        View
                                    </button>

                                    {role === "admin" && (
                                        <>
                                            <button
                                                className="edit-event-btn"
                                                onClick={() => handleEdit(event)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="delete-event-btn"
                                                onClick={() => handleDelete(event._id)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedEvent && (
                <div
                    className="event-modal-overlay"
                    onClick={() => setSelectedEvent(null)}
                >
                    <div
                        className="event-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedEvent.eventImage || "/default-event.png"}
                            alt={selectedEvent.title}
                        />
                        <div className="event-details-grid">
                            <div className="detail-item">
                                <span className="detail-label">Date</span>
                                <span>{new Date(selectedEvent.date).toLocaleDateString()}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Time</span>
                                <span>{selectedEvent.startTime} - {selectedEvent.endTime}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Venue</span>
                                <span>{selectedEvent.venue}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Organizer</span>
                                <span>{selectedEvent.organizer}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Chief Guest</span>
                                <span>{selectedEvent.guestName}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Category</span>
                                <span>{selectedEvent.category}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Status</span>
                                <span className="status-badge">
                                    {selectedEvent.status}
                                </span>
                            </div>
                        </div>

                        <div className="event-description">
                            <h3>Description</h3>
                            <p>{selectedEvent.description}</p>
                        </div>

                        <button onClick={() => setSelectedEvent(null)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;