import React, { useState } from "react";
import "../../styles/globals.css";

export default function ReportForm({ onGenerate }) {
  const [topic, setTopic] = useState("");
  const [row, setRow] = useState({ workerId: "", present: "", absent: "" });

  const submit = (e) => {
    e.preventDefault();
    if (!topic || !row.workerId)
      return alert("Report topic and Worker ID are required!");
    onGenerate(topic, row);
    setRow({ workerId: "", present: "", absent: "" });
  };

  return (
    <form onSubmit={submit} className="wspm-form wspm-report-form">
      <div className="wspm-form-group">
        <label className="wspm-form-label">
          Report Topic *
        </label>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter report topic (e.g., Monthly Attendance Summary)"
          className="wspm-form-input"
          required
        />
      </div>

      <div className="wspm-report-form-grid">
        <div className="wspm-form-group">
          <label className="wspm-form-label">Worker ID *</label>
          <input
            value={row.workerId}
            onChange={(e) => setRow({ ...row, workerId: e.target.value })}
            placeholder="Enter worker ID"
            className="wspm-form-input"
            required
          />
        </div>
        <div className="wspm-form-group">
          <label className="wspm-form-label">
            Days Present
          </label>
          <input
            type="number"
            value={row.present}
            onChange={(e) => setRow({ ...row, present: e.target.value })}
            placeholder="Number of days present"
            className="wspm-form-input"
          />
        </div>
        <div className="wspm-form-group">
          <label className="wspm-form-label">
            Days Absent
          </label>
          <input
            type="number"
            value={row.absent}
            onChange={(e) => setRow({ ...row, absent: e.target.value })}
            placeholder="Number of days absent"
            className="wspm-form-input"
          />
        </div>
      </div>

      <button
        type="submit"
        className="wspm-btn wspm-btn-success"
      >
        📊 Add Report Entry
      </button>
    </form>
  );
}