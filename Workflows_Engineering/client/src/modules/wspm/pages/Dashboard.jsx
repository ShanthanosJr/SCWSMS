import React, { useState, useEffect } from "react";
import "../styles/globals.css";
import { getWorkers } from "../services/workerService";

export default function Dashboard() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch workers data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const workersData = await getWorkers();
        setWorkers(workersData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate statistics based on actual data
  const totalWorkers = workers.length;
  const attendanceRate = workers.length > 0 ? Math.round((workers.filter(w => w.status === 'active').length / workers.length) * 100) : 0;
  
  const stats = [
    {
      title: "Total Workers",
      value: totalWorkers,
      color: "wspm-stat-blue",
      icon: "👷",
      trend: "+2",
      trendColor: "wspm-trend-up",
    },
    {
      title: "Attendance Rate",
      value: `${attendanceRate}%`,
      color: "wspm-stat-green",
      icon: "⏱",
      trend: "+3%",
      trendColor: "wspm-trend-up",
    },
    {
      title: "Pending Payrolls",
      value: 3,
      color: "wspm-stat-yellow",
      icon: "💰",
      trend: "-1",
      trendColor: "wspm-trend-up",
    },
    {
      title: "Safety Compliance",
      value: "87%",
      color: "wspm-stat-purple",
      icon: "🦺",
      trend: "+5%",
      trendColor: "wspm-trend-up",
    },
    {
      title: "Safety Incidents",
      value: 1,
      color: "wspm-stat-red",
      icon: "🚨",
      trend: "-2",
      trendColor: "wspm-trend-up",
    },
    {
      title: "Training Completed",
      value: 15,
      color: "wspm-stat-indigo",
      icon: "🎓",
      trend: "+8",
      trendColor: "wspm-trend-up",
    },
  ];

  return (
    <div className="wspm-container">
      {/* Header */}
      <div className="wspm-header">
        <h1>WORKFLOWS ENGINEERING</h1>
        <p>Worker Safety & Payroll Management Dashboard</p>
      </div>

      {error && (
        <div className="wspm-alert wspm-alert-error">
          <p>{error}</p>
        </div>
      )}

      <div className="wspm-dashboard-container">
        {/* Welcome Section */}
        <div className="wspm-content-card">
          <div className="wspm-content-card-header">
            <h2>Welcome to Your Dashboard</h2>
            <p>Monitor your workforce, track performance metrics, and manage operations efficiently.</p>
          </div>
          <div className="wspm-card-footer">
            <p className="wspm-card-footer-text">
              Last updated:{" "}
              {new Date().toLocaleDateString() +
                " at " +
                new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="wspm-dashboard-grid">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="wspm-dashboard-card"
            >
              <div className={`wspm-card-icon ${s.color}`}>{s.icon}</div>
              <div className="wspm-card-title">{s.title}</div>
              <div className="wspm-card-value">{s.value}</div>
              <div className={`wspm-card-trend ${s.trend.startsWith('+') ? 'wspm-trend-up' : 'wspm-trend-down'}`}>
                <span>▲</span>
                <span>{s.trend}</span>
              </div>
              <div className="wspm-card-description">vs last month</div>
            </div>
          ))}
        </div>

        {/* Workers Summary */}
        <div className="wspm-content-card">
          <div className="wspm-content-card-header">
            <h2>Workers Overview</h2>
            <p>Current workforce summary</p>
          </div>
          
          {loading ? (
            <div className="wspm-loading">
              <div className="wspm-spinner"></div>
              <p>Loading workers data...</p>
            </div>
          ) : (
            <div className="wspm-table-container">
              <table className="wspm-table">
                <thead>
                  <tr>
                    <th>Worker ID</th>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Status</th>
                    <th>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.length > 0 ? (
                    workers.slice(0, 5).map((worker) => (
                      <tr key={worker._id}>
                        <td>{worker.workerId}</td>
                        <td>{worker.name}</td>
                        <td>{worker.position}</td>
                        <td>
                          <span className={`wspm-badge ${worker.status === 'active' ? 'wspm-badge-success' : 'wspm-badge-secondary'}`}>
                            {worker.status}
                          </span>
                        </td>
                        <td>{worker.department}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="wspm-empty-state">
                        No workers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}