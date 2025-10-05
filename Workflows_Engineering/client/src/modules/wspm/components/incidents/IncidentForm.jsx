import React, { useState } from "react";
import "../../styles/globals.css";

export default function IncidentForm({ onReport }) {
  const [form, setForm] = useState({
    workerId: "",
    description: "",
    severity: "Low",
    location: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.description) return alert("Description required");
    onReport(form);
    setForm({ workerId: "", description: "", severity: "Low", location: "" });
  };

  return (
    <form onSubmit={submit} className="wspm-form wspm-incident-form">
      <div className="wspm-form-grid">
        <div className="wspm-form-group">
          <label className="wspm-form-label">Worker ID</label>
          <input
            name="workerId"
            value={form.workerId}
            onChange={handleChange}
            placeholder="Enter worker ID (if applicable)"
            className="wspm-form-input"
          />
        </div>
        <div className="wspm-form-group">
          <label className="wspm-form-label">Incident Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Where did this occur?"
            className="wspm-form-input"
          />
        </div>
      </div>

      <div className="wspm-form-group">
        <label className="wspm-form-label">Severity Level *</label>
        <select
          name="severity"
          value={form.severity}
          onChange={handleChange}
          className="wspm-form-select"
        >
          <option value="Low">🟢 Low - Minor incident, no injury</option>
          <option value="Medium">🟡 Medium - Minor injury or equipment damage</option>
          <option value="High">🔴 High - Serious injury or major damage</option>
          <option value="Critical">🚨 Critical - Life-threatening or catastrophic</option>
        </select>
      </div>

      <div className="wspm-form-group">
        <label className="wspm-form-label">Incident Description *</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the incident in detail..."
          rows={4}
          className="wspm-form-textarea"
          required
        />
      </div>

      <button
        type="submit"
        className="wspm-btn wspm-btn-error"
      >
        🚨 Report Incident
      </button>
    </form>
  );
}