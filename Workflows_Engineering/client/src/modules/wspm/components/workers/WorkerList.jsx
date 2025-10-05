import React from "react";
import "../../styles/globals.css";

export default function WorkerList({ workers }) {
  return (
    <div className="wspm-worker-list-container">
      <div className="wspm-worker-list-header">
        <h3 className="wspm-worker-list-title">Workers Directory</h3>
        <p className="wspm-worker-list-subtitle">Total Workers: {workers.length}</p>
      </div>

      <div className="wspm-worker-list-table-container">
        <table className="wspm-table wspm-worker-list-table">
          <thead className="wspm-worker-list-table-header">
            <tr>
              <th className="wspm-worker-list-table-cell">Worker ID</th>
              <th className="wspm-worker-list-table-cell">Name</th>
              <th className="wspm-worker-list-table-cell">Role</th>
              <th className="wspm-worker-list-table-cell">Phone</th>
            </tr>
          </thead>
          <tbody>
            {workers.length === 0 ? (
              <tr>
                <td colSpan="4" className="wspm-worker-list-empty">
                  <div className="wspm-worker-list-empty-content">
                    <svg className="wspm-worker-list-empty-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                    <p>No workers found. Add your first worker to get started.</p>
                  </div>
                </td>
              </tr>
            ) : (
              workers.map((w, idx) => (
                <tr key={idx} className={`wspm-worker-list-table-row ${idx % 2 === 0 ? 'wspm-worker-list-table-row-even' : 'wspm-worker-list-table-row-odd'}`}>
                  <td className="wspm-worker-list-table-cell">{w.workerId}</td>
                  <td className="wspm-worker-list-table-cell">{w.name}</td>
                  <td className="wspm-worker-list-table-cell">
                    <span className="wspm-worker-list-role-badge">
                      {w.role || "N/A"}
                    </span>
                  </td>
                  <td className="wspm-worker-list-table-cell">{w.phone || "N/A"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}