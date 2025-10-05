import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../App.css';

export default function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { path: '/mistm', name: 'Materials', icon: '📦' },
    { path: '/mistm/suppliers', name: 'Suppliers', icon: '🚚' },
    { path: '/mistm/analysis', name: 'Cost Analysis', icon: '📈' },
  ];

  return (
    <aside className={`mistm-sidebar ${isCollapsed ? 'mistm-sidebar-collapsed' : 'mistm-sidebar-expanded'}`}>
      <div className="mistm-sidebar-content">
        {/* Header */}
        <div className="mistm-sidebar-header">
          {!isCollapsed && (
            <div className="mistm-sidebar-title">
              <h2>MISTM Dashboard</h2>
              <p>Materials & Suppliers</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="mistm-sidebar-toggle"
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mistm-sidebar-nav">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`mistm-sidebar-link ${
                  isActive ? 'mistm-sidebar-link-active' : ''
                }`}
              >
                <span className="mistm-sidebar-icon">{item.icon}</span>
                {!isCollapsed && (
                  <span className="mistm-sidebar-text">{item.name}</span>
                )}
                {!isCollapsed && isActive && (
                  <div className="mistm-sidebar-indicator"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}