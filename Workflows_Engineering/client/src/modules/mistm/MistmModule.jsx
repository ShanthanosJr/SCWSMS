import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
// import Materials from './pages/Materials.jsx'; // Not needed as we're using MistmDashboard
import Suppliers from './pages/Suppliers.jsx';
import CostAnalysis from './pages/CostAnalysis.jsx';
import './App.css';

// Main Dashboard Component
function MistmDashboard() {
  const { pathname } = useLocation();
  const relativePath = pathname.replace('/mistm', '') || '/';
  
  return (
    <div className="mistm-container">
      <div className="mistm-header">
        <h1>Materials & Suppliers Tracking</h1>
        <p>Manage construction materials, suppliers, and cost analysis</p>
      </div>
      
      <div className="mistm-dashboard">
        <div className="mistm-dashboard-cards">
          <Link to="/mistm" className={`mistm-dashboard-card ${relativePath === '/' ? 'mistm-dashboard-card-active' : ''}`}>
            <div className="mistm-dashboard-card-icon">📦</div>
            <h3>Materials</h3>
            <p>Track inventory, receive/consume materials</p>
          </Link>
          
          <Link to="/mistm/suppliers" className={`mistm-dashboard-card ${relativePath === '/suppliers' ? 'mistm-dashboard-card-active' : ''}`}>
            <div className="mistm-dashboard-card-icon">🚚</div>
            <h3>Suppliers</h3>
            <p>Manage supplier information and relationships</p>
          </Link>
          
          <Link to="/mistm/analysis" className={`mistm-dashboard-card ${relativePath === '/analysis' ? 'mistm-dashboard-card-active' : ''}`}>
            <div className="mistm-dashboard-card-icon">📈</div>
            <h3>Cost Analysis</h3>
            <p>Analyze material costs and supplier performance</p>
          </Link>
        </div>
        
        <div className="mistm-info-card">
          <h3>About MISTM</h3>
          <p>The Materials & Suppliers Tracking Management module helps you efficiently manage construction materials, track inventory levels, manage supplier relationships, and analyze costs.</p>
          <ul>
            <li>Real-time inventory tracking</li>
            <li>Supplier performance monitoring</li>
            <li>Cost analysis and reporting</li>
            <li>Low stock alerts</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function MistmModule() {
  return (
    <div className="mistm-layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="mistm-layout-content">
        {/* Navbar */}
        <Navbar />
        
        {/* Page Content */}
        <main className="mistm-layout-main">
          <Routes>
            <Route index element={<MistmDashboard />} />
            <Route path="/" element={<MistmDashboard />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="analysis" element={<CostAnalysis />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}