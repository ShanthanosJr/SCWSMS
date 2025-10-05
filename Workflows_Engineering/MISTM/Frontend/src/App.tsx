import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './styles/mistm.css';

export default function App() {
  const { pathname } = useLocation();
  return (
    <div className="mistm-app">
      <header className="mistm-header">
        <div className="mistm-header-inner">
          <div className="mistm-brand">
            <div className="mistm-brand-badge">M</div>
            <div className="mistm-brand-text">
              <h1>Materials & Suppliers Tracking</h1>
              <p>Workflows Engineering — MISTM</p>
            </div>
          </div>
          <nav className="mistm-nav">
            <Link to="/" className={`mistm-nav-link ${pathname==='/' ? 'active' : ''}`}>Materials</Link>
            <Link to="/suppliers" className={`mistm-nav-link ${pathname==='/suppliers' ? 'active' : ''}`}>Suppliers</Link>
            <Link to="/analysis" className={`mistm-nav-link ${pathname==='/analysis' ? 'active' : ''}`}>Cost Analysis</Link>
          </nav>
        </div>
      </header>
      <div className="mistm-container">
        <Outlet />
      </div>
    </div>
  );
}
