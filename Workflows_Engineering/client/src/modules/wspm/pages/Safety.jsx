import React, { useState, useEffect } from "react";
import { createInspection, getInspections } from "../services/safetyService";
import "../styles/globals.css";

export default function Safety() {
  const [inspections, setInspections] = useState([]);
  const [form, setForm] = useState({
    workerId: "",
    helmet: false,
    vest: false,
    gloves: false,
    boots: false,
    harness: false,
    issues: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadInspections();
  }, []);

  const loadInspections = async () => {
    try {
      const data = await getInspections();
      console.log("Loaded inspections:", data);
      setInspections(data || []);
    } catch (error) {
      console.error("Failed to load inspections:", error);
      alert("❌ Failed to load safety inspections: " + (error.response?.data?.error || error.message));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.workerId?.trim()) {
      newErrors.workerId = "Worker ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, checked, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setForm({ ...form, [name]: fieldValue });

    // Clear error for this field when user starts typing/checking
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("⚠️ Please fix the validation errors before submitting");
      return;
    }

    setLoading(true);
    try {
      const inspectionData = {
        workerId: form.workerId.trim(),
        helmet: form.helmet,
        vest: form.vest,
        gloves: form.gloves,
        boots: form.boots,
        harness: form.harness,
        issues: form.issues.trim()
      };

      console.log("Submitting safety inspection:", inspectionData);

      await createInspection(inspectionData);
      alert("✅ Safety inspection recorded successfully");

      // Reset form
      setForm({
        workerId: "",
        helmet: false,
        vest: false,
        gloves: false,
        boots: false,
        harness: false,
        issues: ""
      });
      setErrors({});

      // Reload inspections
      await loadInspections();

    } catch (error) {
      console.error("Safety inspection submission failed:", error);
      const errorMessage = error.response?.data?.error || error.message || "Unknown error occurred";
      alert("❌ Failed to record safety inspection: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const calculateFormScore = () => {
    const checkedItems = [form.helmet, form.vest, form.gloves, form.boots, form.harness].filter(Boolean).length;
    return Math.round((checkedItems / 5) * 100);
  };

  const getScoreClass = (score) => {
    if (score >= 80) return 'wspm-score-high';
    if (score >= 60) return 'wspm-score-medium';
    return 'wspm-score-low';
  };

  const getScoreBadgeClass = (score) => {
    if (score >= 80) return 'wspm-badge-success';
    if (score >= 60) return 'wspm-badge-warning';
    return 'wspm-badge-error';
  };

  const safetyItems = [
    { key: "helmet", label: "Safety Helmet", icon: "🪖" },
    { key: "vest", label: "Safety Vest", icon: "🦺" },
    { key: "gloves", label: "Safety Gloves", icon: "🧤" },
    { key: "boots", label: "Safety Boots", icon: "🥾" },
    { key: "harness", label: "Safety Harness", icon: "🔗" }
  ];

  return (
    <div className="wspm-container">
      {/* Header */}
      <div className="wspm-header">
        <h1>Safety Inspections</h1>
        <p>Conduct safety equipment inspections and track compliance scores</p>
      </div>

      <div className="wspm-content">
        {/* Safety Inspection Form */}
        <div className="wspm-content-card">
          <div className="wspm-card-header">
            <div className="wspm-card-icon">
              <span>🛡️</span>
            </div>
            <h2>Conduct Safety Inspection</h2>
          </div>

          <div className="wspm-form">
            <div className="wspm-form-group">
              <label className="wspm-form-label">Worker ID *</label>
              <input
                name="workerId"
                placeholder="Enter worker ID (e.g., W001)"
                value={form.workerId}
                onChange={handleChange}
                className={`wspm-form-input ${errors.workerId ? 'wspm-form-input-error' : ''}`}
              />
              {errors.workerId && <p className="wspm-form-error">{errors.workerId}</p>}
            </div>

            <div className="wspm-form-group">
              <label className="wspm-form-label">Safety Equipment Check</label>
              <div className="wspm-safety-grid">
                {safetyItems.map((item) => (
                  <label key={item.key} className={`wspm-safety-item ${form[item.key] ? 'wspm-safety-item-checked' : ''}`}>
                    <input
                      type="checkbox"
                      name={item.key}
                      checked={form[item.key]}
                      onChange={handleChange}
                      className="wspm-form-checkbox"
                    />
                    <span className="wspm-safety-item-icon">{item.icon}</span>
                    <span className="wspm-safety-item-label">{item.label}</span>
                    {form[item.key] && <span className="wspm-safety-item-check">✓</span>}
                  </label>
                ))}
              </div>
            </div>

            {/* Live Score Preview */}
            <div className="wspm-score-preview">
              <div className="wspm-score-preview-content">
                <div>
                  <p className="wspm-score-preview-title">Current Compliance Score</p>
                  <p className="wspm-score-preview-desc">Based on selected safety equipment</p>
                </div>
                <div className={`wspm-score-value ${getScoreClass(calculateFormScore())}`}>
                  {calculateFormScore()}%
                </div>
              </div>
            </div>

            <div className="wspm-form-group">
              <label className="wspm-form-label">Additional Notes</label>
              <textarea
                name="issues"
                placeholder="Any issues or observations about the safety equipment..."
                value={form.issues}
                onChange={handleChange}
                rows={3}
                className="wspm-form-textarea"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="wspm-btn wspm-btn-primary"
            >
              {loading ? "Recording..." : "🛡️ Record Safety Inspection"}
            </button>
          </div>
        </div>

        {/* Safety Inspection Results */}
        <div className="wspm-content-card">
          <div className="wspm-card-header-with-count">
            <h2>Inspection History</h2>
            <div className="wspm-card-count">
              Total Inspections: {inspections.length}
            </div>
          </div>

          <div className="wspm-inspection-list">
            {inspections.length === 0 ? (
              <div className="wspm-empty-state">
                <div className="wspm-empty-state-content">
                  <span className="wspm-empty-state-icon">🛡️</span>
                  <p>No safety inspections recorded yet.</p>
                </div>
              </div>
            ) : (
              inspections.map((inspection, index) => (
                <div key={inspection._id} className="wspm-inspection-item">
                  <div className="wspm-inspection-item-header">
                    <div className="wspm-inspection-item-icon">
                      <span>🛡️</span>
                    </div>
                    <div className="wspm-inspection-item-info">
                      <h4 className="wspm-inspection-item-title">
                        {inspection.workerName || 'Unknown Worker'} ({inspection.workerId})
                      </h4>
                      <p className="wspm-inspection-item-date">
                        Inspection Date: {new Date(inspection.createdAt || inspection.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="wspm-inspection-item-score">
                      <div className={`wspm-score-value ${getScoreClass(inspection.complianceScore)}`}>
                        {inspection.complianceScore}%
                      </div>
                      <span className={`wspm-badge ${getScoreBadgeClass(inspection.complianceScore)}`}>
                        {inspection.passedItems || 0}/{inspection.totalItems || 5} items
                      </span>
                    </div>
                  </div>

                  {/* Safety Equipment Status */}
                  {inspection.checklist && (
                    <div className="wspm-safety-status-grid">
                      {safetyItems.map((item) => (
                        <div key={item.key} className={`wspm-safety-status-item ${inspection.checklist[item.key] ? 'wspm-safety-status-item-passed' : 'wspm-safety-status-item-failed'}`}>
                          <span className="wspm-safety-status-icon">{item.icon}</span>
                          <span className="wspm-safety-status-label">{item.label}</span>
                          <span className="wspm-safety-status-check">
                            {inspection.checklist[item.key] ? '✓' : '✗'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Issues/Notes */}
                  {inspection.issues && (
                    <div className="wspm-inspection-notes">
                      <p className="wspm-inspection-notes-content">
                        <strong>Notes:</strong> {inspection.issues}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}