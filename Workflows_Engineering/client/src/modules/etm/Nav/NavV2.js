import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { NavLink } from 'react-router-dom';
import UserProfile from '../UserProfile/UserProfileV2'; // Added import

export default function NavV2() {
  const [open, setOpen] = useState(false);
  const [expandPD, setExpandPD] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(false);

  const closeMenu = () => setOpen(false);
  const toggleMenu = () => setOpen((v) => !v);

  // Function to detect background color and adjust navbar theme
  useEffect(() => {
    const detectBackgroundColor = () => {
      const sections = document.querySelectorAll(
        "section, .hero-section, .dark-section, .ptfd-hero-section, .ptfd-projects-section, .ptfd-dashboard-section, .ptfd-cta-section"
      );

      let darkSectionDetected = false;

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 0 && rect.bottom >= 60) { // navbar height ~60px
          const sectionStyle = window.getComputedStyle(section);
          const bgColor = sectionStyle.backgroundColor;
          const bgImage = sectionStyle.backgroundImage;

          // If background image or known dark-section classes
          if (bgImage !== "none" || section.classList.contains("dark-section")) {
            darkSectionDetected = true;
          }

          // If solid color
          if (bgColor && bgColor !== "rgba(0, 0, 0, 0)") {
            const rgb = bgColor.match(/\d+/g);
            if (rgb) {
              const brightness =
                (parseInt(rgb[0]) * 299 +
                  parseInt(rgb[1]) * 587 +
                  parseInt(rgb[2]) * 114) /
                1000;
              if (brightness < 128) darkSectionDetected = true;
            }
          }
        }
      });

      setIsDarkBackground(darkSectionDetected);
      console.log("Dark background detected:", darkSectionDetected);
    };

    detectBackgroundColor();
    window.addEventListener("scroll", detectBackgroundColor);
    window.addEventListener("resize", detectBackgroundColor);

    return () => {
      window.removeEventListener("scroll", detectBackgroundColor);
      window.removeEventListener("resize", detectBackgroundColor);
    };
  }, []);


  return (
    <>
      {/* Modern Adaptive Navbar */}
      <nav className={`navv2-navbar ${isDarkBackground ? 'navv2-theme-dark' : 'navv2-theme-light'}`}>
        <div className="navv2-navbar-container">
          {/* Left - Menu Button */}
          <div className="navv2-navbar-left">
            <button
              className="navv2-menu-button"
              onClick={toggleMenu}
              aria-label="Open navigation menu"
              aria-expanded={open}
            >
              <div className="navv2-menu-dots">
                <span className="navv2-dot"></span>
                <span className="navv2-dot"></span>
                <span className="navv2-dot"></span>
              </div>
              <span className="navv2-menu-text">MENU</span>
            </button>
          </div>

          {/* Center - Logo */}
          <div className="navv2-navbar-center">
            <NavLink to="/ptfd" className="navv2-logo-link">
              <div className="navv2-logo">
                <div className="navv2-logo-icon">
                  <img
                    src="/WorkflowsEngineering.png"
                    alt="Workflows Engineering Logo"
                    className="navv2-logo-image"
                    onError={(e) => {
                      // Fallback to text if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'block';
                    }}
                  />
                  <div className="navv2-logo-fallback" style={{ display: 'none' }}>
                    <div className="navv2-building-icon">
                      <div className="navv2-building-base"></div>
                      <div className="navv2-building-tower"></div>
                      <div className="navv2-building-details">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="navv2-logo-text">
                  <div className="navv2-logo-main">WORKFLOWS ENGINEERING</div>
                  <div className="navv2-logo-sub">BUILD YOUR DREAMS</div>
                </div>
              </div>
            </NavLink>
          </div>

          {/* Right - Notification */}
          <div className="navv2-navbar-right">
            <NavLink to="/notifications" className="navv2-notification-button">
              <div className="navv2-bell-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </div>
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Enhanced screen overlay */}
      <div
        className={`nav-overlay ${open ? 'nav-overlay-show' : ''}`}
        onClick={closeMenu}
        role="button"
        aria-label="Close navigation overlay"
        style={{ zIndex: 1040 }}
      />

      {/* Modern left slide-out drawer - Same as original */}
      <aside id="side-nav" className={`nav-side-drawer ${open ? 'nav-side-drawer-open' : ''}`} aria-hidden={!open} style={{ zIndex: 1250 }}>
        {/* Enhanced profile section at the TOP */}
        <div className="nav-profile-section">
          <div className="nav-profile-header">
            <div className="nav-welcome-badge">
              <span className="nav-welcome-icon">👋</span>
              <span>Welcome to</span>
            </div>
            <div className="nav-brand-title">
              <span className="nav-brand-icon">🏗️</span>
              Workflows Engineering
            </div>
          </div>
          <div className="nav-profile-content">
            <UserProfile inSidebar={true} />
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
                  to="/ptfd"
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
                  to="/profile"
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

              <li className="nav-menu-item">
                <NavLink
                  to="/WSPM"
                  className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                  onClick={closeMenu}
                >
                  <div className="nav-link-content">
                    <span className="nav-link-icon">🦺</span>
                    <div className="nav-link-text">
                      <span className="nav-primary-text">Workers & Safety</span>
                      <span className="nav-secondary-text">Safety protocols</span>
                    </div>
                  </div>
                  <span className="nav-link-arrow">→</span>
                </NavLink>
              </li>

              <li className="nav-menu-item">
                <NavLink
                  to="/ETM"
                  className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                  onClick={closeMenu}
                >
                  <div className="nav-link-content">
                    <span className="nav-link-icon">🧰</span>
                    <div className="nav-link-text">
                      <span className="nav-primary-text">Tools</span>
                      <span className="nav-secondary-text">Equipment management</span>
                    </div>
                  </div>
                  <span className="nav-link-arrow">→</span>
                </NavLink>
              </li>

              <li className="nav-menu-item">
                <NavLink
                  to="/MISTM"
                  className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                  onClick={closeMenu}
                >
                  <div className="nav-link-content">
                    <span className="nav-link-icon">🧱</span>
                    <div className="nav-link-text">
                      <span className="nav-primary-text">Materials</span>
                      <span className="nav-secondary-text">Resource inventory</span>
                    </div>
                  </div>
                  <span className="nav-link-arrow">→</span>
                </NavLink>
              </li>

              <li className="nav-menu-item">
                <NavLink
                  to="/CIM"
                  className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                  onClick={closeMenu}
                >
                  <div className="nav-link-content">
                    <span className="nav-link-icon">📋</span>
                    <div className="nav-link-text">
                      <span className="nav-primary-text">Inspections</span>
                      <span className="nav-secondary-text">Quality control</span>
                    </div>
                  </div>
                  <span className="nav-link-arrow">→</span>
                </NavLink>
              </li>
            </ul>
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
                    <span className="nav-primary-text">Projects</span>
                    <span className="nav-secondary-text">Introducing To Projects</span>
                  </div>
                </div>
                <span className={`nav-expand-icon ${expandPD ? 'nav-expand-rotated' : ''}`}>▼</span>
              </button>

              <div id="projects-submenu" className={`nav-accordion-content ${expandPD ? 'nav-accordion-content-expanded' : ''}`}>
                <ul className="nav-submenu-list">
                  <li>
                    <NavLink
                      to="/user-projects"
                      className={({ isActive }) => `nav-submenu-link ${isActive ? 'nav-submenu-link-active' : ''}`}
                      onClick={closeMenu}
                    >
                      <span className="nav-submenu-icon">📁</span>
                      <span className="nav-submenu-text">Projects</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/user-timeline"
                      className={({ isActive }) => `nav-submenu-link ${isActive ? 'nav-submenu-link-active' : ''}`}
                      onClick={closeMenu}
                    >
                      <span className="nav-submenu-icon">📈</span>
                      <span className="nav-submenu-text">Timeline Expo</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/user-finance"
                      className={({ isActive }) => `nav-submenu-link ${isActive ? 'nav-submenu-link-active' : ''}`}
                      onClick={closeMenu}
                    >
                      <span className="nav-submenu-icon">💰</span>
                      <span className="nav-submenu-text">Introducing To Dashboards</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/join-with-us"
                      className={({ isActive }) => `nav-submenu-link ${isActive ? 'nav-submenu-link-active' : ''}`}
                      onClick={closeMenu}
                    >
                      <span className="nav-submenu-icon">🤝</span>
                      <span className="nav-submenu-text">Join With Us</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/user-chatbot"
                      className={({ isActive }) => `nav-submenu-link ${isActive ? 'nav-submenu-link-active' : ''}`}
                      onClick={closeMenu}
                    >
                      <span className="nav-submenu-icon">🤖</span>
                      <span className="nav-submenu-text">Projecto AI Assistant</span>
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

      {/* Enhanced Styles */}
      <style jsx global>{`
        /* NavV2 Specific Styles */
        .navv2-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1100;
          padding: 20px 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
        }

        .navv2-theme-dark, .navv2-theme-dark * {
          color: #ffffff !important;
        }
        .navv2-theme-light, .navv2-theme-light * {
          color: #000000 !important;
        }

        .navv2-navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Left - Menu Button */
        .navv2-navbar-left {
          flex: 1;
          display: flex;
          justify-content: flex-start;
        }

        .navv2-menu-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 16px;
          border-radius: 16px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: inherit;
        }

        .navv2-menu-button:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-3px);
        }

        .navv2-navbar-light .navv2-menu-button:hover {
          background: rgba(0, 0, 0, 0.1);
        }

        .navv2-menu-dots {
          display: flex;
          gap: 6px;
        }

        .navv2-dot {
          width: 10px !important;
          height: 10px !important;
          border-radius: 50%;
          background: currentColor;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navv2-menu-button:hover .navv2-dot {
          transform: scale(1.3);
        }

        .navv2-menu-text {
          font-size: 1rem !important;
          font-weight: 900 !important;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        /* Center - Logo */
        .navv2-navbar-center {
          flex: 2;
          display: flex;
          justify-content: center;
        }

        .navv2-logo-link {
          text-decoration: none;
          color: inherit;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navv2-logo-link:hover {
          transform: translateY(-2px);
          color: inherit;
        }

        .navv2-logo {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .navv2-logo-icon {
          position: relative;
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .navv2-logo-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: transparent !important;
          mix-blend-mode: multiply; /* or darken, depending on bg */
        }

        .navv2-logo-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .navv2-building-icon {
          position: relative;
          width: 40px;
          height: 40px;
        }

        .navv2-building-base {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 24px;
          height: 20px;
          background: #f59e0b;
          border-radius: 3px 3px 0 0;
        }

        .navv2-building-tower {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 20px;
          background: #d97706;
          border-radius: 2px 2px 0 0;
        }

        .navv2-building-details {
          position: absolute;
          bottom: 3px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 3px;
        }

        .navv2-building-details span {
          width: 3px;
          height: 10px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 1px;
        }

        .navv2-logo-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .navv2-logo-main {
          font-size: 1.3rem !important;
          font-weight: 900 !important;
          letter-spacing: 0.08em !important;
          line-height: 1;
          margin-bottom: 4px;
        }

        .navv2-logo-sub {
          font-size: 0.9rem !important;
          font-weight: 700 !important;
          letter-spacing: 0.12em !important;
          opacity: 0.9;
          text-transform: uppercase;
        }

        /* Right - Notification */
        .navv2-navbar-right {
          flex: 1;
          display: flex;
          justify-content: flex-end;
        }

        .navv2-notification-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px !important;
          height: 56px !important;
          border-radius: 50%;
          background: transparent;
          color: inherit;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          border: 2px solid currentColor;
        }

        .navv2-notification-button:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-3px) scale(1.1);
          color: inherit;
        }

        .navv2-navbar-light .navv2-notification-button:hover {
          background: rgba(0, 0, 0, 0.1);
        }

        .navv2-bell-icon {
          width: 26px !important;
          height: 26px !important;
        }

        .navv2-bell-icon svg {
          width: 100%;
          height: 100%;
          stroke-width: 2.5 !important;
        }

        /* Notification Badge (optional) */
        .navv2-notification-button::after {
          content: '';
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          border: 2px solid currentColor;
          opacity: 0;
          transform: scale(0);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navv2-notification-button.has-notifications::after {
          opacity: 1;
          transform: scale(1);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .navv2-navbar-container {
            padding: 0 20px;
          }

          .navv2-logo-main {
            font-size: 0.8rem;
          }

          .navv2-logo-sub {
            font-size: 0.6rem;
          }

          .navv2-logo {
            gap: 12px;
          }

          .navv2-logo-icon {
            width: 40px;
            height: 40px;
          }

          .navv2-building-icon {
            width: 28px;
            height: 28px;
          }
        }

        @media (max-width: 480px) {
          .navv2-navbar-container {
            padding: 0 16px;
          }

          .navv2-logo-text {
            display: none;
          }

          .navv2-logo {
            gap: 0;
          }
        }

        /* Original Navigation Styles - Keep all existing styles */
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
