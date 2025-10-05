import React from "react";

export default function IncidentList({ incidents }) {
  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'Low': return 'wspm-badge-success';
      case 'Medium': return 'wspm-badge-warning';
      case 'High': return 'wspm-badge-error';
      case 'Critical': return 'wspm-badge-critical';
      default: return 'wspm-badge';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'Low': return '🟢';
      case 'Medium': return '🟡';
      case 'High': return '🔴';
      case 'Critical': return '🚨';
      default: return '⚪';
    }
  };

  return (
    <div className="wspm-incident-list">
      {incidents.length === 0 ? (
        <div className="wspm-empty-state">
          <div className="wspm-empty-state-content">
            <span className="wspm-empty-state-icon">⚠️</span>
            <p>No incidents reported. Great safety record!</p>
          </div>
        </div>
      ) : (
        incidents.map((i, idx) => (
          <div key={idx} className="wspm-incident-item">
            <div className="wspm-incident-item-header">
              <div className="wspm-incident-item-icon">
                <span>🚨</span>
              </div>
              <div className="wspm-incident-item-info">
                <div className="wspm-incident-item-badges">
                  <span className={`wspm-badge ${getSeverityClass(i.severity)}`}>
                    {getSeverityIcon(i.severity)} {i.severity}
                  </span>
                  {i.workerId && (
                    <span className="wspm-badge wspm-badge-info">
                      Worker: {i.workerId}
                    </span>
                  )}
                </div>
                <p className="wspm-incident-item-meta">
                  {i.date ? new Date(i.date).toLocaleDateString() : new Date().toLocaleDateString()}
                  {i.location && ` • ${i.location}`}
                </p>
              </div>
            </div>
            <p className="wspm-incident-item-description">{i.desc || i.description || 'No description provided'}</p>
            <div className="wspm-incident-item-footer">
              <span className="wspm-incident-item-time">
                Reported on {new Date().toLocaleTimeString()}
              </span>
              <button className="wspm-btn wspm-btn-link">
                View Details →
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}