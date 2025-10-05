import React, { useState } from "react";
import "../../styles/globals.css";

export default function PayrollForm({ onGenerate }) {
  const [form, setForm] = useState({
    workerId: "",
    period: "",
    baseRate: "",
    hoursWorked: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.workerId || !form.period || !form.baseRate || !form.hoursWorked) {
      return alert("All fields are required!");
    }
    const totalPay = parseFloat(form.baseRate) * parseFloat(form.hoursWorked);
    onGenerate({ ...form, totalPay });
    setForm({ workerId: "", period: "", baseRate: "", hoursWorked: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="wspm-form wspm-payroll-form">
      <div className="wspm-payroll-grid">
        <div className="wspm-form-group">
          <label className="wspm-form-label">Worker ID *</label>
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
          <label className="wspm-form-label">Period *</label>
          <input
            name="period"
            value={form.period}
            onChange={handleChange}
            placeholder="e.g., 2025-01"
            className="wspm-form-input"
            required
          />
        </div>
        <div className="wspm-form-group">
          <label className="wspm-form-label">Base Rate (LKR /hour) *</label>
          <input
            name="baseRate"
            type="number"
            value={form.baseRate}
            onChange={handleChange}
            placeholder="Rate per hour"
            className="wspm-form-input"
            required
          />
        </div>
        <div className="wspm-form-group">
          <label className="wspm-form-label">Hours Worked *</label>
          <input
            name="hoursWorked"
            type="number"
            value={form.hoursWorked}
            onChange={handleChange}
            placeholder="Total hours"
            className="wspm-form-input"
            required
          />
        </div>
      </div>

      {form.baseRate && form.hoursWorked && (
        <div className="wspm-payroll-calculated">
          <p className="wspm-payroll-calculated-text">
            💰 Calculated Pay: LKR {(parseFloat(form.baseRate) * parseFloat(form.hoursWorked)).toLocaleString()}
          </p>
        </div>
      )}

      <button
        type="submit"
        className="wspm-btn wspm-btn-success"
      >
        💳 Generate Payroll
      </button>
    </form>
  );
}