import React, { useState } from "react";
import "../../styles/globals.css";

export default function WorkerForm({ onSave }) {
  const [form, setForm] = useState({
    workerId: "",
    name: "",
    role: "",
    phone: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.workerId || !form.name) return alert("Worker ID & Name required");
    onSave(form);
    setForm({ workerId: "", name: "", role: "", phone: "" });
  };

  return (
    <div className="wspm-worker-form-container">
      <div className="wspm-worker-form-header">
        <div className="wspm-worker-form-icon">
          <svg
            className="wspm-worker-form-icon-svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
        </div>
        <h3 className="wspm-worker-form-title">
          Add New Worker
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="wspm-form wspm-worker-form">
        <div className="wspm-worker-form-grid">
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
              Full Name *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="wspm-form-input"
              required
            />
          </div>
          <div className="wspm-form-group">
            <label className="wspm-form-label">Role</label>
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="Job role/position"
              className="wspm-form-input"
            />
          </div>
          <div className="wspm-form-group">
            <label className="wspm-form-label">
              Phone Number
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone number"
              className="wspm-form-input"
            />
          </div>
        </div>
        <button
          type="submit"
          className="wspm-btn wspm-btn-primary"
        >
          Save Worker
        </button>
      </form>
    </div>
  );
}