import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../App.css';

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname.replace('/mistm', '') || '/';

  const navItems = [
    { name: 'Materials', path: '/' },
    { name: 'Suppliers', path: '/suppliers' },
    { name: 'Cost Analysis', path: '/analysis' }
  ];

  return (
    <header className="mistm-navbar">
      <div className="mistm-navbar-container">
        {/* Logo and Title */}
        <div className="mistm-navbar-brand">
          <div className="mistm-navbar-logo">
            <span className="mistm-navbar-logo-text">M</span>
          </div>
          <div className="mistm-navbar-brand-info">
            <h1>WORKFLOWS ENGINEERING</h1>
            <p>Materials & Suppliers Tracking</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="mistm-navbar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={`/mistm${item.path}`}
              className={`mistm-navbar-link ${
                currentPath === item.path
                  ? 'mistm-navbar-link-active'
                  : ''
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* User Actions */}
        <div className="mistm-navbar-actions">
          <div>
            <button className="mistm-navbar-notification">
              <svg className="mistm-navbar-notification svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5V9.09c0-2.83-2.17-5.09-5-5.09S5 6.26 5 9.09V12l-5 5h5c0 2.76 2.24 5 5 5s5-2.24 5-5z" />
              </svg>
            </button>
          </div>

          <div className="mistm-navbar-user">
            <div className="mistm-navbar-avatar">
              <span className="mistm-navbar-avatar-text">U</span>
            </div>
            <div className="mistm-navbar-user-info">
              <p>User</p>
              <p>Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}