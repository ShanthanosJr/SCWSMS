import React, { useState } from "react";

const MaintenanceForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    serviceDetails: "",
    nextScheduledService: "",
    damageReported: "",
    updateStatus: true
  });
  
  // Get today's date in YYYY-MM-DD format for the min attribute
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    // Validation for nextScheduledService to prevent past dates
    if (name === "nextScheduledService" && value && value < today) {
      alert("Next Scheduled Service cannot be in the past.");
      return; // Don't update the state
    }
    
    setForm({
      ...form,
      [name]: newValue,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Final validation before submission
    if (form.nextScheduledService && form.nextScheduledService < today) {
      alert("Next Scheduled Service cannot be in the past.");
      return;
    }
    
    onSubmit(form);
    setForm({
      serviceDetails: "",
      nextScheduledService: "",
      damageReported: "",
      updateStatus: true
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="serviceDetails" className="form-label">Service Details</label>
        <textarea
          id="serviceDetails"
          name="serviceDetails"
          className="form-control"
          rows="3"
          value={form.serviceDetails}
          onChange={handleChange}
          placeholder="Describe the maintenance/service performed"
          required
        ></textarea>
      </div>

      <div className="mb-3">
        <label htmlFor="nextScheduledService" className="form-label">Next Scheduled Service</label>
        <input
          id="nextScheduledService"
          name="nextScheduledService"
          type="date"
          className="form-control"
          value={form.nextScheduledService}
          onChange={handleChange}
          min={today} // This restricts the date picker to not allow dates before today
        />
        <small className="form-text text-muted">
          Cannot be earlier than today ({new Date(today).toLocaleDateString()})
        </small>
      </div>

      <div className="mb-3">
        <label htmlFor="damageReported" className="form-label">Damage Report</label>
        <textarea
          id="damageReported"
          name="damageReported"
          className="form-control"
          rows="2"
          value={form.damageReported}
          onChange={handleChange}
          placeholder="Describe any damage found (if applicable)"
        ></textarea>
      </div>

      <div className="form-check mb-3">
        <input
          id="updateStatus"
          name="updateStatus"
          type="checkbox"
          className="form-check-input"
          checked={form.updateStatus}
          onChange={handleChange}
        />
        <label htmlFor="updateStatus" className="form-check-label">
          Update tool status to "under maintenance"
        </label>
      </div>

      <button type="submit" className="btn btn-warning">
        Log Maintenance
      </button>
    </form>
  );
};

export default MaintenanceForm;