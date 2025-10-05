import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { NavLink } from 'react-router-dom';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [expandPD, setExpandPD] = useState(false); // collapsed by default
  const [expandWS, setExpandWS] = useState(false); // Workers & Safety accordion
  const [expandT, setExpandT] = useState(false); // Tools accordion
  const [expandM, setExpandM] = useState(false); // Materials accordion
  const [expandI, setExpandI] = useState(false); // Inspections accordion

  const closeMenu = () => setOpen(false);
  const toggleMenu = () => setOpen((v) => !v);

  return (
    <>
      {/* Modern hamburger button */}
      <button
        type="button"
        className={`nav-hamburger-btn ${open ? 'nav-hamburger-open' : ''}`}
        aria-label="Open navigation menu"
        aria-expanded={open}
        aria-controls="side-nav"
        onClick={toggleMenu}
        style={{ zIndex: 1202 }}
      >
        <div className="nav-hamburger-lines">
          <span className="nav-hamburger-line" />
          <span className="nav-hamburger-line" />
          <span className="nav-hamburger-line" />
        </div>
      </button>

      {/* Enhanced screen overlay */}
      <div
        className={`nav-overlay ${open ? 'nav-overlay-show' : ''}`}
        onClick={closeMenu}
        role="button"
        aria-label="Close navigation overlay"
        style={{ zIndex: 1040 }}
      />

      {/* Modern left slide-out drawer */}
      <aside id="side-nav" className={`nav-side-drawer ${open ? 'nav-side-drawer-open' : ''}`} aria-hidden={!open} style={{ zIndex: 1250 }}>
        {/* Enhanced profile section at the TOP */}
        <div className="nav-profile-section">
          <div className="nav-profile-header">
            <div className="nav-welcome-badge">
              <span className="nav-welcome-icon">📈💰📊</span>
              <span>Welcome To Management Of</span>
            </div>
            <div className="nav-brand-title">
              <span className="nav-brand-icon">🏗️</span>
              Workflows Engineering
            </div>
          </div>
        </div>

        {/* Modern divider */}
        <div className="nav-divider">
          <div className="nav-divider-line"></div>
          <div className="nav-divider-icon">⚙️</div>
          <div className="nav-divider-line"></div>
        </div>

        {/* Enhanced navigation menu */}
        <nav className="nav-menu" aria-label="Primary">
          <div className="nav-menu-section">
            <h3 className="nav-section-title">
              <span className="nav-title-icon">🏠</span>
              Main Menu
            </h3>
            
            <ul className="nav-menu-list">
              <li className="nav-menu-item">
                <NavLink
                  to="/HOME"
                  className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                  onClick={closeMenu}
                >
                  <div className="nav-link-content">
                    <span className="nav-link-icon">🏠</span>
                    <div className="nav-link-text">
                      <span className="nav-primary-text">Home</span>
                      <span className="nav-secondary-text">Main dashboard</span>
                    </div>
                  </div>
                  <span className="nav-link-arrow">→</span>
                </NavLink>
              </li>

              <li className="nav-menu-item">
                <NavLink
                  to="/ptfd/profile"
                  className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                  onClick={closeMenu}
                >
                  <div className="nav-link-content">
                    <span className="nav-link-icon">👤</span>
                    <div className="nav-link-text">
                      <span className="nav-primary-text">Profile</span>
                      <span className="nav-secondary-text">Personal settings</span>
                    </div>
                  </div>
                  <span className="nav-link-arrow">→</span>
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Workers & Safety accordion */}
          <div className="nav-menu-section">
            <div className="nav-accordion-item">
              <button
                className={`nav-accordion-header ${expandWS ? 'nav-accordion-expanded' : ''}`}
                aria-expanded={expandWS}
                aria-controls="workers-safety-submenu"
                onClick={() => setExpandWS((v) => !v)}
              >
                <div className="nav-accordion-title">
                  <span className="nav-title-icon">🦺</span>
                  <div className="nav-title-text">
                    <span className="nav-primary-text">Workers & Safety</span>
                    <span className="nav-secondary-text">Personnel Management</span>
                  </div>
                </div>
                <span className={`nav-expand-icon ${expandWS ? 'nav-expand-rotated' : ''}`}>▼</span>
              </button>
              
              <div id="workers-safety-submenu" className={`nav-accordion-content ${expandWS ? 'nav-accordion-content-expanded' : ''}`}>
                <ul className="nav-submenu-list">
                  <li>
                    <NavLink 
                      to="/WSPM" 
                      className={({ isActive }) => `nav-submenu-link ${isActive ? 'nav-submenu-link-active' : ''}`} 
                      onClick={closeMenu}
                    >
                      <span className="nav-submenu-icon">📋</span>
                      <span className="nav-submenu-text">Safety Protocols</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/worker-certifications" 
                      className={({ isActive }) => `nav-submenu-link ${isActive ? 'nav-submenu-link-active' : ''}`} 
                      onClick={closeMenu}
                    >
                      <span className="nav-submenu-icon">🏆</span>
                      <span className="nav-submenu-text">Certifications</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/incident-reports" 
                      className={({ isActive }) => `nav-submenu-link ${isActive ? 'nav-submenu-link-active' : ''}`} 
                      onClick={closeMenu}
                    >
                      <span className="nav-submenu-icon">⚠️</span>
                      <span className="nav-submenu-text">Incident Reports</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/training-modules" 
                      className={({ isActive }) => `nav-submenu-link ${isActive ? 'nav-submenu-link-active' : ''}`} 
                      onClick={closeMenu}
                    >
                      <span className="nav-submenu-icon">📚</span>
                      <span className="nav-submenu-text">Training Modules</span>
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tools accordion */}
          <div className="nav-menu-section">
            <div className="nav-accordion-item">
              <button
                className={`nav-accordion-header ${expandT ? 'nav-accordion-expanded' : ''}`}
                aria-expanded={expandT}
                aria-controls="tools-submenu"
                onClick={() => setExpandT((v) => !v)}
              >
                <div className="nav-accordion-title">
                  <span className="nav-title-icon">🧰</span>
                  <div className="nav-title-text">
                    <span className="nav-primary-text">Tools</span>
                    <span className="nav-secondary-text">Equipment Management</span>
                  </div>
                </div>
                <span className={`nav-expand-icon ${expandT ? 'nav-expand-rotated' : ''}`}>▼</span>
              </button>
              
              <div id="tools-submenu" className={`nav-accordion-content ${expandT ? 'nav-accordion-content-expanded' : ''}`}>
                <ul className="nav-submenu-list">
                  <li>
                    <NavLink 
                      to="etm/admin" 
                      className={({ isActive }) => `nav-submenu-link ${isActive ? 'nav-submenu-link-active' : ''}`} 
                      onClick={closeMenu}
                    >
                      <span className="nav-submenu-icon">🔧</span>
                      <span className="nav-submenu-text">Tool Inventory</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="etm/tool-maintenance" 
                      className={({ isActive }) => `nav-submenu-link ${isActive ? 'nav-submenu-link-active' : ''}`} 
                      onClick={closeMenu}
                    >
                      <span className="nav-submenu-icon">🛠️</span>
                      <span className="nav-submenu-text">Maintenance Schedule</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="etm/tool-assignments" 
                      className={({ isActive }) => `nav-submenu-link ${isActive ? 'nav-submenu-link-active' : ''}`} 
                      onClick={closeMenu}
                    >
                      <span className="nav-submenu-icon">📌</span>
                      <span className="nav-submenu-text">Assignments</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="etm/tool-calibration" 
                      className={({ isActive }) => `nav-submenu-link ${isActive ? 'nav-submenu-link-active' : ''}`} 
                      onClick={closeMenu}
                    >
                      <span className="nav-submenu-icon">📏</span>
                      <span className="nav-submenu-text">Calibration</span>
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Materials accordion */}
          <div className="nav-menu-section">
            <div className="nav-accordion-item">
              <button
                className={`nav-accordion-header ${expandM ? 'nav-accordion-expanded' : ''}`}
                aria-expanded={expandM}
                aria-controls="materials-submenu"
                onClick={() => setExpandM((v) => !v)}
              >
                <div className="nav-accordion-title">
                  <span className="nav-title-icon">🧱</span>
                  <div className="nav-title-text">
                    <span className="nav-primary-text">Materials</span>
                    <span className="nav-secondary-text">Resource Management</span>
                  </div>
                </div>
                <span className={`nav-expand-icon ${expandM ? 'nav-expand-rotated' : ''}`}>▼</span>
              </button>
              
              <div id="materials-submenu" className={`nav-accordion-content ${expandM ? 'nav-accordion-content-expanded' : ''}`}>
                <ul className="nav-submenu-list">
                  <li>
                    <NavLink 
                      to="/MISTM" 
                      className={({ isActive }) => `nav-submenu-link ${isActive ? 'nav-submenu-link-active' : ''}`} 
                      onClick={closeMenu}
                    >
                      <span className="nav-submenu-icon">📦</span>
                      <span className="nav-submenu-text">Stock Management</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/material-suppliers" 
                      className={({ isActive }) => `nav-submenu-link ${isActive ? 'nav-submenu-link-active' : ''}`} 
                      onClick={closeMenu}
                    >
                      <span className="nav-submenu-icon">🚚</span>
                      <span className="nav-submenu-text">Suppliers</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/material-orders" 
                      className={({ isActive }) => `nav-submenu-link ${isActive ? 'nav-submenu-link-active' : ''}`} 
                      onClick={closeMenu}
                    >
                      <span className="nav-submenu-icon">🛒</span>
                      <span className="nav-submenu-text">Orders</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/material-usage" 
                      className={({ isActive }) => `nav-submenu-link ${isActive ? 'nav-submenu-link-active' : ''}`} 
                      onClick={closeMenu}
                    >
                      <span className="nav-submenu-icon">📊</span>
                      <span className="nav-submenu-text">Usage Reports</span>
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Inspections accordion */}
          <div className="nav-menu-section">
            <div className="nav-accordion-item">
              <button
                className={`nav-accordion-header ${expandI ? 'nav-accordion-expanded' : ''}`}
                aria-expanded={expandI}
                aria-controls="inspections-submenu"
                onClick={() => setExpandI((v) => !v)}
              >
                <div className="nav-accordion-title">
                  <span className="nav-title-icon">📋</span>
                  <div className="nav-title-text">
                    <span className="nav-primary-text">Inspections</span>
                    <span className="nav-secondary-text">Quality Control</span>
                  </div>
                </div>
                <span className={`nav-expand-icon ${expandI ? 'nav-expand-rotated' : ''}`}>▼</span>
              </button>
              
              <div id="inspections-submenu" className={`nav-accordion-content ${expandI ? 'nav-accordion-content-expanded' : ''}`}>
                <ul className="nav-submenu-list">
                  <li>
                    <NavLink 
                      to="/CIM" 
                      className={({ isActive }) => `nav-submenu-link ${isActive ? 'nav-submenu-link-active' : ''}`} 
                      onClick={closeMenu}
                    >
                      <span className="nav-submenu-icon">🔍</span>
                      <span className="nav-submenu-text">Compliance Checks</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/safety-inspections" 
                      className={({ isActive }) => `nav-submenu-link ${isActive ? 'nav-submenu-link-active' : ''}`} 
                      onClick={closeMenu}
                    >
                      <span className="nav-submenu-icon">✅</span>
                      <span className="nav-submenu-text">Safety Inspections</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/quality-audits" 
                      className={({ isActive }) => `nav-submenu-link ${isActive ? 'nav-submenu-link-active' : ''}`} 
                      onClick={closeMenu}
                    >
                      <span className="nav-submenu-icon">📐</span>
                      <span className="nav-submenu-text">Quality Audits</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/inspection-reports" 
                      className={({ isActive }) => `nav-submenu-link ${isActive ? 'nav-submenu-link-active' : ''}`} 
                      onClick={closeMenu}
                    >
                      <span className="nav-submenu-icon">📝</span>
                      <span className="nav-submenu-text">Reports</span>
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Enhanced Projects & Dashboard accordion */}
          <div className="nav-menu-section">
            <div className="nav-accordion-item">
              <button
                className={`nav-accordion-header ${expandPD ? 'nav-accordion-expanded' : ''}`}
                aria-expanded={expandPD}
                aria-controls="projects-submenu"
                onClick={() => setExpandPD((v) => !v)}
              >
                <div className="nav-accordion-title">
                  <span className="nav-title-icon">📊</span>
                  <div className="nav-title-text">
                    <span className="nav-primary-text">Projects & Dashboards</span>
                    <span className="nav-secondary-text">Project Management</span>
                  </div>
                </div>
                <span className={`nav-expand-icon ${expandPD ? 'nav-expand-rotated' : ''}`}>▼</span>
              </button>
              
              <div id="projects-submenu" className={`nav-accordion-content ${expandPD ? 'nav-accordion-content-expanded' : ''}`}>
                <ul className="nav-submenu-list">
                  <li>
                    <NavLink 
                      to="ptfd/project-requests" 
                      className={({ isActive }) => `nav-submenu-link ${isActive ? 'nav-submenu-link-active' : ''}`} 
                      onClick={closeMenu}
                    >
                      <span className="nav-submenu-icon">📁</span>
                      <span className="nav-submenu-text">Project Requests</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="ptfd/projects" 
                      className={({ isActive }) => `nav-submenu-link ${isActive ? 'nav-submenu-link-active' : ''}`} 
                      onClick={closeMenu}
                    >
                      <span className="nav-submenu-icon">📈</span>
                      <span className="nav-submenu-text">Project Tracking</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="ptfd/project-timelines" 
                      className={({ isActive }) => `nav-submenu-link ${isActive ? 'nav-submenu-link-active' : ''}`} 
                      onClick={closeMenu}
                    >
                      <span className="nav-submenu-icon">⏱️</span>
                      <span className="nav-submenu-text">Timeline Manager</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="ptfd/financial-dashboard" 
                      className={({ isActive }) => `nav-submenu-link ${isActive ? 'nav-submenu-link-active' : ''}`} 
                      onClick={closeMenu}
                    >
                      <span className="nav-submenu-icon">💰</span>
                      <span className="nav-submenu-text">Financial Overview</span>
                    </NavLink>
                  </li>
                                 <li>
                    <NavLink 
                      to="ptfd/profile-dashboard" 
                      className={({ isActive }) => `nav-submenu-link ${isActive ? 'nav-submenu-link-active' : ''}`} 
                      onClick={closeMenu}
                    >
                      <span className="nav-submenu-icon">👤</span>
                      <span className="nav-submenu-text">Administrator Analytics</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="ptfd/chatbot" 
                      className={({ isActive }) => `nav-submenu-link ${isActive ? 'nav-submenu-link-active' : ''}`} 
                      onClick={closeMenu}
                    >
                      <span className="nav-submenu-icon">🤖</span>
                      <span className="nav-submenu-text">Project AI Assistant</span>
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* Footer section */}
        <div className="nav-footer">
          <button className="nav-close-btn" onClick={closeMenu} aria-label="Close menu">
            <span className="nav-close-icon">✕</span>
            <span className="nav-close-text">Close Menu</span>
          </button>
        </div>
      </aside>

      {/* Enhanced Styles - All Prefixed to Avoid Global Conflicts */}
      <style jsx global>{`
        /* Navigation-specific styles - to avoid conflicts */
        
        /* Modern Hamburger Button */
        .nav-hamburger-btn {
          position: fixed;
          top: 60px;
          left: 20px;
          z-index: 1100;
          width: 52px;
          height: 52px;
          border-radius: 16px;
          border: none;
          background: #yellow-500;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
        }

        .nav-hamburger-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
          background: #f8fafc;
        }

        .nav-hamburger-lines {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-hamburger-btn .nav-hamburger-line {
          width: 20px;
          height: 2px;
          background: #1e293b;
          border-radius: 1px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-hamburger-btn.nav-hamburger-open .nav-hamburger-line:nth-child(1) {
          transform: translateY(6px) rotate(45deg);
        }
        .nav-hamburger-btn.nav-hamburger-open .nav-hamburger-line:nth-child(2) {
          opacity: 0;
        }
        .nav-hamburger-btn.nav-hamburger-open .nav-hamburger-line:nth-child(3) {
          transform: translateY(-6px) rotate(-45deg);
        }

        /* Enhanced Overlay */
        .nav-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1040;
        }
        .nav-overlay.nav-overlay-show {
          opacity: 1;
          visibility: visible;
        }

        /* Modern Side Navigation */
        .nav-side-drawer {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 360px;
          background: #ffffff;
          color: #1e293b;
          transform: translateX(-100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1250;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .nav-side-drawer.nav-side-drawer-open {
          transform: translateX(0);
        }

        /* Enhanced Profile Section */
        .nav-profile-section {
          padding: 24px 20px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-bottom: 1px solid #e2e8f0;
        }

        .nav-profile-header {
          margin-bottom: 16px;
        }

        .nav-welcome-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 8px;
        }

        .nav-welcome-icon {
          font-size: 1rem;
        }

        .nav-brand-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.25rem;
          font-weight: 700;
          color: #f59e0b;
        }

        .nav-brand-icon {
          font-size: 1.5rem;
        }

        .nav-profile-content {
          margin-top: 16px;
        }

        /* Modern Divider */
        .nav-divider {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          background: #f1f5f9;
        }

        .nav-divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, #e2e8f0, transparent);
        }

        .nav-divider-icon {
          margin: 0 16px;
          font-size: 1.2rem;
          color: #f59e0b;
        }

        /* Enhanced Navigation Menu */
        .nav-menu {
          flex: 1;
          overflow-y: auto;
          padding: 20px 0;
        }

        .nav-menu-section {
          margin-bottom: 32px;
        }

        .nav-section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 16px 20px;
          font-size: 0.875rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .nav-title-icon {
          font-size: 1rem;
        }

        .nav-menu-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-menu-item {
          margin: 4px 16px;
        }

        /* Modern Navigation Links */
        .nav-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          color: #1e293b;
          text-decoration: none;
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          opacity: 0;
          transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: -1;
        }

        .nav-link:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          color: #1e293b;
        }

        .nav-link:hover::before {
          opacity: 0.1;
        }

        .nav-link.nav-link-active {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        }

        .nav-link.nav-link-active::before {
          opacity: 1;
        }

        .nav-link-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nav-link-icon {
          font-size: 1.25rem;
          width: 24px;
          text-align: center;
        }

        .nav-link-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .nav-primary-text {
          font-weight: 600;
          font-size: 0.95rem;
        }

        .nav-secondary-text {
          font-size: 0.8rem;
          opacity: 0.7;
        }

        .nav-link-arrow {
          font-size: 1rem;
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-link:hover .nav-link-arrow {
          opacity: 1;
          transform: translateX(4px);
        }

        /* Enhanced Accordion */
        .nav-accordion-item {
          margin: 4px 16px;
        }

        .nav-accordion-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: none;
          border: none;
          color: #1e293b;
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-accordion-header:hover {
          background: #f1f5f9;
          transform: translateX(2px);
        }

        .nav-accordion-header.nav-accordion-expanded {
          background: #f1f5f9;
          color: #f59e0b;
        }

        .nav-accordion-title {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nav-title-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
        }

        .nav-expand-icon {
          font-size: 0.875rem;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-expand-icon.nav-expand-rotated {
          transform: rotate(180deg);
        }

        .nav-accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-accordion-content.nav-accordion-content-expanded {
          max-height: 400px;
        }

        .nav-submenu-list {
          list-style: none;
          margin: 8px 0 0 0;
          padding: 0;
          padding-left: 40px;
          border-left: 2px solid #e2e8f0;
        }

        .nav-submenu-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          margin: 4px 0;
          color: #64748b;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.9rem;
        }

        .nav-submenu-link:hover {
          background: #f1f5f9;
          color: #1e293b;
          transform: translateX(4px);
        }

        .nav-submenu-link.nav-submenu-link-active {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          font-weight: 600;
        }

        .nav-submenu-icon {
          font-size: 1rem;
          width: 16px;
          text-align: center;
        }

        .nav-submenu-text {
          font-weight: 500;
        }

        /* Enhanced Footer */
        .nav-footer {
          padding: 20px;
          border-top: 1px solid #e2e8f0;
          background: #f1f5f9;
        }

        .nav-close-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 500;
        }

        .nav-close-btn:hover {
          background: #f59e0b;
          color: white;
          border-color: #f59e0b;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }

        .nav-close-icon {
          font-size: 1rem;
        }

        .nav-close-text {
          font-size: 0.9rem;
        }

        /* Enhanced Profile Styles for Sidebar */
        .nav-profile-section .user-profile-container {
          width: 100%;
        }

        .nav-profile-section .user-profile-button {
          width: 100%;
          justify-content: center;
          padding: 16px;
          font-size: 1rem;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-profile-section .user-profile-button:hover {
          background: #f1f5f9;
          border-color: #f59e0b;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          transform: translateY(-1px);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .nav-side-drawer {
            width: 320px;
          }
        }

        @media (max-width: 420px) {
          .nav-side-drawer {
            width: 90vw;
          }
          
          .nav-hamburger-btn {
            top: 16px;
            left: 16px;
            width: 48px;
            height: 48px;
          }
        }

        /* Scrollbar Styling for Navigation Only */
        .nav-menu::-webkit-scrollbar {
          width: 6px;
        }

        .nav-menu::-webkit-scrollbar-track {
          background: transparent;
        }

        .nav-menu::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 3px;
        }

        .nav-menu::-webkit-scrollbar-thumb:hover {
          background: #f59e0b;
        }
      `}</style>
    </>
  );
}