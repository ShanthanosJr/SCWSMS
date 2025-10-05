import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Materials from './pages/Materials.tsx';
import Suppliers from './pages/Suppliers.tsx';
import CostAnalysis from './pages/CostAnalysis.tsx';

export default function MistmModule() {
  const { pathname } = useLocation();
  
  // Extract the current path relative to /mistm
  const relativePath = pathname.replace('/mistm', '') || '/';
  
  return (
    <div>
      <header>
        <div className="row" style={{justifyContent:'space-between', alignItems:'center', padding: '1rem 2rem', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6'}}>
          <div><strong>Workflows Engineering — Materials & Suppliers Tracking</strong></div>
          <nav style={{display: 'flex', gap: '1rem'}}>
            <Link 
              to="/mistm" 
              style={{textDecoration: relativePath === '/' ? 'underline' : 'none', color: '#007bff'}}
            >
              Materials
            </Link>
            <Link 
              to="/mistm/suppliers" 
              style={{textDecoration: relativePath === '/suppliers' ? 'underline' : 'none', color: '#007bff'}}
            >
              Suppliers
            </Link>
            <Link 
              to="/mistm/analysis" 
              style={{textDecoration: relativePath === '/analysis' ? 'underline' : 'none', color: '#007bff'}}
            >
              Cost Analysis
            </Link>
          </nav>
        </div>
      </header>
      <div className="container" style={{padding: '1rem'}}>
        <Routes>
          <Route index element={<Materials />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="analysis" element={<CostAnalysis />} />
        </Routes>
      </div>
    </div>
  );
}