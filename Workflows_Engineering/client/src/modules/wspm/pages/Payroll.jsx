import React, { useState, useEffect } from "react";
import { generatePayroll, getPayrolls } from "../services/payrollService";
import "../styles/globals.css";

export default function Payroll() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    workerId: "",
    period: "",
    baseRate: "",
    hoursWorked: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadPayrolls();
  }, []);

  const loadPayrolls = async () => {
    try {
      const data = await getPayrolls();
      console.log("Loaded payrolls:", data);
      setRecords(data || []);
    } catch (error) {
      console.error("Failed to load payrolls:", error);
      alert("❌ Failed to load payrolls: " + (error.response?.data?.error || error.message));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.workerId?.trim()) {
      newErrors.workerId = "Worker ID is required";
    }

    if (!form.period?.trim()) {
      newErrors.period = "Period is required";
    }

    if (!form.baseRate || parseFloat(form.baseRate) <= 0) {
      newErrors.baseRate = "Base rate must be greater than 0";
    }

    if (!form.hoursWorked || parseFloat(form.hoursWorked) <= 0) {
      newErrors.hoursWorked = "Hours worked must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleGenerate = async () => {
    if (!validateForm()) {
      alert("⚠️ Please fix the validation errors before submitting");
      return;
    }

    setLoading(true);
    try {
      const payrollData = {
        workerId: form.workerId.trim(),
        period: form.period.trim(),
        baseRate: parseFloat(form.baseRate),
        hoursWorked: parseFloat(form.hoursWorked)
      };

      console.log("Submitting payroll data:", payrollData);

      await generatePayroll(payrollData);
      alert("✅ Payroll Generated Successfully");

      // Reset form
      setForm({ workerId: "", period: "", baseRate: "", hoursWorked: "" });
      setErrors({});

      // Reload payrolls
      await loadPayrolls();

    } catch (error) {
      console.error("Payroll generation failed:", error);
      const errorMessage = error.response?.data?.error || error.message || "Unknown error occurred";
      alert("❌ Failed to generate payroll: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPay = () => {
    const rate = parseFloat(form.baseRate) || 0;
    const hours = parseFloat(form.hoursWorked) || 0;
    return rate * hours;
  };

  return (
    <div className="wspm-container">
      {/* Header */}
      <div className="wspm-header">
        <h1>WORKFLOWS ENGINEERING</h1>
        <p>Equipment & Tool Management</p>
      </div>

      <div className="wspm-dashboard-container">
        <div className="wspm-content-card">
          <h2 className="wspm-content-card-title">Payroll Management</h2>
          <p className="wspm-content-card-description">Generate and manage worker payroll records with automated calculations.</p>
        </div>

        {/* Payroll Form */}
        <div className="wspm-content-card">
          <div className="wspm-card-header">
            <div className="wspm-card-icon">
              <svg className="wspm-card-icon-svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </div>
            <h3 className="wspm-card-title">Generate Payroll</h3>
          </div>

          <div className="wspm-payroll-grid">
            <div className="wspm-form-group">
              <label className="wspm-form-label">Worker ID *</label>
              <input
                name="workerId"
                value={form.workerId}
                onChange={handleChange}
                placeholder="Enter worker ID (e.g., W001)"
                className={`wspm-form-input ${errors.workerId ? 'wspm-form-input-error' : ''}`}
              />
              {errors.workerId && <p className="wspm-form-error">{errors.workerId}</p>}
            </div>

            <div className="wspm-form-group">
              <label className="wspm-form-label">Period *</label>
              <input
                name="period"
                value={form.period}
                onChange={handleChange}
                placeholder="e.g., 2025-01"
                className={`wspm-form-input ${errors.period ? 'wspm-form-input-error' : ''}`}
              />
              {errors.period && <p className="wspm-form-error">{errors.period}</p>}
            </div>

            <div className="wspm-form-group">
              <label className="wspm-form-label">Base Rate (LKR/hour) *</label>
              <input
                name="baseRate"
                type="number"
                step="0.01"
                min="0"
                value={form.baseRate}
                onChange={handleChange}
                placeholder="Rate per hour"
                className={`wspm-form-input ${errors.baseRate ? 'wspm-form-input-error' : ''}`}
              />
              {errors.baseRate && <p className="wspm-form-error">{errors.baseRate}</p>}
            </div>

            <div className="wspm-form-group">
              <label className="wspm-form-label">Hours Worked *</label>
              <input
                name="hoursWorked"
                type="number"
                step="0.1"
                min="0"
                value={form.hoursWorked}
                onChange={handleChange}
                placeholder="Total hours"
                className={`wspm-form-input ${errors.hoursWorked ? 'wspm-form-input-error' : ''}`}
              />
              {errors.hoursWorked && <p className="wspm-form-error">{errors.hoursWorked}</p>}
            </div>
          </div>

          {form.baseRate && form.hoursWorked && (
            <div className="wspm-payroll-calculated">
              <p className="wspm-payroll-calculated-text">
                💰 Calculated Pay: LKR {calculateTotalPay().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="wspm-btn wspm-btn-primary"
          >
            {loading ? "🔄 Generating..." : "💳 Generate Payroll"}
          </button>
        </div>

        {/* Payroll Records */}
        <div className="wspm-content-card">
          <div className="wspm-card-header-with-count">
            <h2 className="wspm-card-title">Payroll Records</h2>
            <div className="wspm-card-count">
              Total Records: {records.length}
            </div>
          </div>

          <div className="wspm-table-container">
            <table className="wspm-table wspm-payroll-table">
              <thead>
                <tr>
                  <th>Worker ID</th>
                  <th>Period</th>
                  <th>Hours</th>
                  <th>Rate (LKR)</th>
                  <th>Total (LKR)</th>
                  <th>Date Generated</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="wspm-empty-state">
                      <div className="wspm-empty-state-content">
                        <span className="wspm-empty-state-icon">💳</span>
                        <p>No payroll records found.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  records.map((record) => (
                    <tr key={record._id}>
                      <td>{record.workerId}</td>
                      <td>{record.period}</td>
                      <td>{record.hoursWorked}</td>
                      <td>{record.baseRate?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td>{record.totalPay?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td>{new Date(record.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}