import React, { useState } from "react";
import { generateReport } from "../services/reportService";
import ReportForm from "../components/reports/ReportForm";
import "../styles/globals.css";

export default function Reports() {
  const [topic, setTopic] = useState("");
  const [rows, setRows] = useState([]);

  const handleAddRow = (newTopic, row) => {
    if (!topic) setTopic(newTopic);
    setRows([...rows, row]);
  };

  const handleGenerate = async () => {
    if (!topic || rows.length === 0) return alert("Topic & at least one row required!");
    try {
      await generateReport({ topic, tableData: rows });
      alert("✅ Report generated successfully");
      // Reset form
      setTopic("");
      setRows([]);
    } catch {
      alert("❌ Failed to generate report");
    }
  };

  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
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
          <h2 className="wspm-content-card-title">Report Generator</h2>
          <p className="wspm-content-card-description">Create custom reports for attendance, performance, and analytics.</p>
        </div>

        {/* Report Form */}
        <div className="wspm-content-card">
          <div className="wspm-card-header">
            <div className="wspm-card-icon">
              <svg className="wspm-card-icon-svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 002 2h6a2 2 0 002-2V3a2 2 0 012 2v6.5a1.5 1.5 0 01-3 0V7a1 1 0 10-2 0v4.5A1.5 1.5 0 0111.5 13H10v3a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 8V7a1 1 0 012 0v4a2 2 0 01-2 2z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="wspm-card-title">Add Report Data</h3>
          </div>
          <ReportForm onGenerate={handleAddRow} />
        </div>

        {/* Report Preview */}
        {(topic || rows.length > 0) && (
          <div className="wspm-content-card">
            <h3 className="wspm-card-title">Report Preview</h3>
            {topic && (
              <div className="wspm-report-topic">
                <h4 className="wspm-report-topic-title">📊 {topic}</h4>
              </div>
            )}

            <div className="wspm-table-container">
              <table className="wspm-table">
                <thead>
                  <tr className="wspm-table-header">
                    <th className="wspm-table-cell">Worker ID</th>
                    <th className="wspm-table-cell">Days Present</th>
                    <th className="wspm-table-cell">Days Absent</th>
                    <th className="wspm-table-cell">Attendance %</th>
                    <th className="wspm-table-cell">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => {
                    const total = parseInt(r.present) + parseInt(r.absent) || 1;
                    const percentage = ((parseInt(r.present) / total) * 100).toFixed(1);
                    return (
                      <tr key={idx} className={`wspm-table-row ${idx % 2 === 0 ? 'wspm-table-row-even' : 'wspm-table-row-odd'}`}>
                        <td className="wspm-table-cell">{r.workerId}</td>
                        <td className="wspm-table-cell wspm-table-cell-present">{r.present}</td>
                        <td className="wspm-table-cell wspm-table-cell-absent">{r.absent}</td>
                        <td className="wspm-table-cell">
                          <span className={`wspm-badge ${percentage >= 90 ? 'wspm-badge-success' : percentage >= 80 ? 'wspm-badge-warning' : 'wspm-badge-error'}`}>
                            {percentage}%
                          </span>
                        </td>
                        <td className="wspm-table-cell">
                          <button
                            onClick={() => removeRow(idx)}
                            className="wspm-btn wspm-btn-error"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan="5" className="wspm-empty-state">
                        No data added yet. Use the form above to add report entries.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Generate Report Button */}
        {rows.length > 0 && (
          <div className="wspm-content-card">
            <button
              onClick={handleGenerate}
              className="wspm-btn wspm-btn-success"
            >
              📄 Generate PDF Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}