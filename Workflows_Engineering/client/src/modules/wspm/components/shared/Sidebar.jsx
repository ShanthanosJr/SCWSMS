import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/globals.css";

export default function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { path: "/wspm", name: "Dashboard", icon: "📊" },
    { path: "/wspm/workers", name: "Workers", icon: "👷" },
    { path: "/wspm/attendance", name: "Attendance", icon: "⏰" },
    { path: "/wspm/payroll", name: "Payroll", icon: "💰" },
    { path: "/wspm/safety", name: "Safety", icon: "🦺" },
    { path: "/wspm/incidents", name: "Incidents", icon: "🚨" },
    { path: "/wspm/training", name: "Training", icon: "🎓" },
    { path: "/wspm/shifts", name: "Shifts", icon: "🔄" },
    { path: "/wspm/reports", name: "Reports", icon: "📋" },
  ];

  return (
    <aside className={`wspm-sidebar ${isCollapsed ? 'wspm-sidebar-collapsed' : ''}`}>
      <div className="wspm-sidebar-content">
        {/* Header */}
        <div className="wspm-sidebar-header">
          {!isCollapsed && (
            <div className="wspm-sidebar-title">
              <h2 className="wspm-sidebar-title-text">WSPM Dashboard</h2>
              <p className="wspm-sidebar-subtitle">Workflows Engineering</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="wspm-sidebar-toggle"
          >
            {isCollapsed ? "→" : "←"}
          </button>
        </div>

        {/* Navigation */}
        <nav className="wspm-sidebar-nav">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`wspm-sidebar-link ${isActive ? 'wspm-sidebar-link-active' : ''}`}
              >
                <span className="wspm-sidebar-icon">{item.icon}</span>
                {!isCollapsed && (
                  <span className="wspm-sidebar-link-text">{item.name}</span>
                )}
                {!isCollapsed && isActive && (
                  <div className="wspm-sidebar-active-indicator"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}