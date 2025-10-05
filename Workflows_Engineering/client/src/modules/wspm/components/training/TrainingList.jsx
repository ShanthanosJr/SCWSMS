import React from "react";

export default function TrainingList({ trainings }) {
  return (
    <div className="wspm-training-list">
      {trainings.length === 0 ? (
        <div className="wspm-empty-state">
          <div className="wspm-empty-state-content">
            <span className="wspm-empty-state-icon">🎓</span>
            <p>No training records found.</p>
          </div>
        </div>
      ) : (
        trainings.map((t, idx) => (
          <div
            key={idx}
            className="wspm-training-item"
          >
            <div className="wspm-training-item-header">
              <div className="wspm-training-item-icon">
                <span>🎓</span>
              </div>
              <div className="wspm-training-item-info">
                <h4 className="wspm-training-item-title">
                  {t.trainingName}
                </h4>
                <p className="wspm-training-item-worker">
                  Worker ID: {t.workerId}
                </p>
                {t.badge && (
                  <span className="wspm-badge wspm-badge-success">
                    {t.badge}
                  </span>
                )}
              </div>
            </div>
            <div className="wspm-training-item-date">
              <p className="wspm-training-item-date-label">Completed</p>
              <p className="wspm-training-item-date-value">
                {t.completionDate ? new Date(t.completionDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}