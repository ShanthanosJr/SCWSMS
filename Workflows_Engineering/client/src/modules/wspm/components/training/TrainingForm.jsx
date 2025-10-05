import React, { useState } from "react";
import "../../styles/globals.css";

export default function TrainingForm({ onSave }) {
  const [form, setForm] = useState({
    workerId: "",
    trainingName: "",
    badge: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.trainingName) return alert("Training required");
    onSave(form);
    setForm({ workerId: "", trainingName: "", badge: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="wspm-form wspm-training-form">
      <div className="wspm-training-grid">
        <div className="wspm-form-group">
          <label className="wspm-form-label">Worker ID</label>
          <input
            name="workerId"
            value={form.workerId}
            onChange={handleChange}
            placeholder="Enter worker ID"
            className="wspm-form-input"
          />
        </div>
        <div className="wspm-form-group">
          <label className="wspm-form-label">
            Training Name *
          </label>
          <input
            name="trainingName"
            value={form.trainingName}
            onChange={handleChange}
            placeholder="Enter training name"
            className="wspm-form-input"
            required
          />
        </div>
        <div className="wspm-form-group">
          <label className="wspm-form-label">
            Badge/Certificate
          </label>
          <input
            name="badge"
            value={form.badge}
            onChange={handleChange}
            placeholder="Badge or certificate"
            className="wspm-form-input"
          />
        </div>
      </div>
      <button
        type="submit"
        className="wspm-btn wspm-btn-primary"
      >
        🎓 Record Training
      </button>
    </form>
  );
}