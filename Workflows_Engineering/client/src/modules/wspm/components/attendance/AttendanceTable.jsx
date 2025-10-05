import React from "react";

export default function AttendanceTable({ logs }) {
  return (
    <div className="wspm-table-container">
      <table className="wspm-table">
        <thead>
          <tr>
            <th>Worker ID</th>
            <th>Type</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan="4" className="wspm-empty-state">
                <div className="wspm-empty-state-content">
                  <span className="wspm-empty-state-icon">⏱️</span>
                  <p>No attendance records for today.</p>
                </div>
              </td>
            </tr>
          ) : (
            logs.map((log, idx) => (
              <tr key={idx} className="wspm-table-row">
                <td className="wspm-table-cell">{log.workerId}</td>
                <td className="wspm-table-cell">
                  <span className={`wspm-badge ${log.type === 'Check In' ? 'wspm-badge-success' : 'wspm-badge-error'}`}>
                    {log.type === 'Check In' ? '✅ Check In' : '❌ Check Out'}
                  </span>
                </td>
                <td className="wspm-table-cell">{new Date(log.time).toLocaleString()}</td>
                <td className="wspm-table-cell">
                  <span className="wspm-badge wspm-badge-info">
                    Active
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}