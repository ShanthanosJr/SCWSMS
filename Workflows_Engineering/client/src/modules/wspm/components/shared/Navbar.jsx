import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/globals.css";

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifications = [
    { id: 1, message: "New safety incident reported", time: "5 min ago", type: "alert" },
    { id: 2, message: "Payroll processing completed", time: "1 hour ago", type: "success" },
    { id: 3, message: "Training session scheduled", time: "2 hours ago", type: "info" },
  ];

  return (
    <header className="wspm-navbar">
      <div className="wspm-nav-inner">
        {/* Logo and Title */}
        <div className="wspm-logo">
          <div className="wspm-logo-badge">
            <span className="wspm-logo-badge-text">E</span>
          </div>
          <div className="wspm-logo-title">
            <h1>WORKFLOWS ENGINEERING</h1>
            <p>Worker Safety & Payroll Management</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="wspm-search">
          <div className="wspm-search-wrap">
            <input
              type="text"
              placeholder="Search workers, reports, incidents..."
              className="wspm-search-input"
            />
            <svg className="wspm-search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="wspm-actions">
          {/* Notifications */}
          <div className="wspm-action-item">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="wspm-icon-btn"
            >
              <svg className="wspm-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5V9.09c0-2.83-2.17-5.09-5-5.09S5 6.26 5 9.09V12l-5 5h5c0 2.76 2.24 5 5 5s5-2.24 5-5z" />
              </svg>
              <span className="wspm-notify-badge">
                {notifications.length}
              </span>
            </button>

            {showNotifications && (
              <div className="wspm-dropdown wspm-dropdown-wide">
                <div className="wspm-dropdown-header">
                  <h3>Notifications</h3>
                </div>
                <div className="wspm-dropdown-body">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="wspm-dropdown-item">
                      <p className="wspm-dropdown-item-title">{notif.message}</p>
                      <p className="wspm-dropdown-item-sub">{notif.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="wspm-action-item">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="wspm-profile-btn"
            >
              <div className="wspm-avatar">
                <span className="wspm-avatar-text">A</span>
              </div>
              <div className="wspm-profile-meta">
                <p className="wspm-profile-name">Admin User</p>
                <p className="wspm-profile-role">Administrator</p>
              </div>
              <svg className="wspm-caret" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showProfile && (
              <div className="wspm-dropdown">
                <div className="wspm-dropdown-list">
                  <a href="#" className="wspm-dropdown-link">Profile Settings</a>
                  <a href="#" className="wspm-dropdown-link">Account</a>
                  <div className="wspm-dropdown-separator" />
                  <a href="#" className="wspm-dropdown-link wspm-dropdown-danger">Sign Out</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}