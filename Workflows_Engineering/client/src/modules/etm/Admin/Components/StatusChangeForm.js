import React, { useState } from "react";

const StatusChangeForm = ({ currentStatus, onSubmit }) => {
  const [form, setForm] = useState({
    status: currentStatus,
    reason: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({...form, reason: ""});
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="status" className="form-label">New Status</label>
        <select
          id="status"
          name="status"
          className="form-select"
          value={form.status}
          onChange={handleChange}
          required
        >
          <option value="available">Available</option>
          <option value="in use">In Use</option>
          <option value="under maintenance">Under Maintenance</option>
          <option value="retired">Retired</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="reason" className="form-label">Reason for Change</label>
        <textarea
          id="reason"
          name="reason"
          className="form-control"
          rows="3"
          value={form.reason}
          onChange={handleChange}
          placeholder="Enter reason for status change"
          required
        ></textarea>
      </div>

      <button type="submit" className="btn btn-primary">
        Update Status
      </button>
    </form>
  );
};

export default StatusChangeForm;