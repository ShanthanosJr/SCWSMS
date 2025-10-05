import React, { useState } from "react";
import "../../styles/globals.css";

export default function ShiftForm({ onRequest }) {
  const [form, setForm] = useState({
    workerId: "",
    requestedShift: "",
    reason: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!form.workerId || !form.requestedShift) {
      return alert("Worker ID and Requested Shift are required!");
    }
    onRequest(form);
    setForm({ workerId: "", requestedShift: "", reason: "" });
  };

  return (
    <form onSubmit={submit} className="wspm-form wspm-shift-form">
      <div className="wspm-shift-form-grid">
        <div className="wspm-form-group">
          <label className="wspm-form-label">
            Worker ID *
          </label>
          <input
            name="workerId"
            value={form.workerId}
            onChange={handleChange}
            placeholder="Enter worker ID"
            className="wspm-form-input"
            required
          />
        </div>
        <div className="wspm-form-group">
          <label className="wspm-form-label">
            Requested Shift *
          </label>
          <select
            name="requestedShift"
            value={form.requestedShift}
            onChange={handleChange}
            className="wspm-form-select"
            required
          >
            <option value="">Select shift</option>
            <option value="Morning (6 AM - 2 PM)">
              Morning (6 AM - 2 PM)
            </option>
            <option value="Afternoon (2 PM - 10 PM)">
              Afternoon (2 PM - 10 PM)
            </option>
            <option value="Night (10 PM - 6 AM)">Night (10 PM - 6 AM)</option>
          </select>
        </div>
      </div>
      <div className="wspm-form-group">
        <label className="wspm-form-label">
          Reason for Shift Change
        </label>
        <textarea
          name="reason"
          value={form.reason}
          onChange={handleChange}
          placeholder="Explain why you need this shift change..."
          rows={3}
          className="wspm-form-textarea"
        />
      </div>
      <button
        type="submit"
        className="wspm-btn wspm-btn-primary"
      >
        🔄 Request Shift Change
      </button>
    </form>
  );
}