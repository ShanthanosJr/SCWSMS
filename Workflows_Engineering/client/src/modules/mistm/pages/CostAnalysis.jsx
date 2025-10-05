import React, { useState, useEffect } from 'react';
import { api } from '../api.js';
import '../App.css';

export default function CostAnalysis() {
  const [materials, setMaterials] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');

  // Load data
  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [materialsData, suppliersData] = await Promise.all([
        api('/materials'),
        api('/suppliers')
      ]);
      setMaterials(materialsData);
      setSuppliers(suppliersData);
    } catch (err) {
      console.error('Failed to load data:', err);
      alert('Failed to load data: ' + (err.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  // Calculate total inventory value
  const totalInventoryValue = materials.reduce((sum, material) => {
    return sum + (material.quantity * (material.avgUnitCost || 0));
  }, 0);

  // Get top expensive materials
  const topExpensiveMaterials = [...materials]
    .sort((a, b) => (b.quantity * (b.avgUnitCost || 0)) - (a.quantity * (a.avgUnitCost || 0)))
    .slice(0, 5);

  // Get low stock materials
  const lowStockMaterials = materials.filter(material => material.lowStock);

  // Get supplier ratings
  const supplierRatings = [...suppliers]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);

  return (
    <div className="mistm-container">
      <div className="mistm-header">
        <h1>Cost Analysis</h1>
        <p>Analyze material costs and supplier performance</p>
      </div>
      
      <div className="mistm-controls">
        <div></div> {/* Empty div for spacing */}
        <div className="mistm-filters">
          <label>Time Range:</label>
          <select 
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
            className="mistm-form-select"
          >
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="mistm-loading">
          <div className="mistm-spinner"></div>
          <p>Loading analysis data...</p>
        </div>
      ) : (
        <div className="mistm-dashboard">
          {/* Summary Cards */}
          <div className="mistm-dashboard-cards">
            <div className="mistm-card mistm-summary-card">
              <h3>Total Inventory Value</h3>
              <p className="mistm-summary-value">${totalInventoryValue.toFixed(2)}</p>
              <p className="mistm-summary-desc">Across all materials</p>
            </div>
            
            <div className="mistm-card mistm-summary-card">
              <h3>Low Stock Items</h3>
              <p className="mistm-summary-value">{lowStockMaterials.length}</p>
              <p className="mistm-summary-desc">Items below minimum stock</p>
            </div>
            
            <div className="mistm-card mistm-summary-card">
              <h3>Total Suppliers</h3>
              <p className="mistm-summary-value">{suppliers.length}</p>
              <p className="mistm-summary-desc">Active suppliers</p>
            </div>
          </div>

          {/* Top Expensive Materials */}
          <div className="mistm-card">
            <div className="mistm-card-header">
              <h3>Top Expensive Materials</h3>
              <p>By total value (quantity × average cost)</p>
            </div>
            <div className="mistm-table-container">
              {topExpensiveMaterials.length > 0 ? (
                <table className="mistm-table">
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Quantity</th>
                      <th>Avg Cost</th>
                      <th>Total Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topExpensiveMaterials.map((material) => (
                      <tr key={material._id}>
                        <td>{material.name}</td>
                        <td>{material.quantity} {material.unit}</td>
                        <td>${(material.avgUnitCost || 0).toFixed(2)}</td>
                        <td>
                          ${(material.quantity * (material.avgUnitCost || 0)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="mistm-empty-state">No materials found.</p>
              )}
            </div>
          </div>

          {/* Top Rated Suppliers */}
          <div className="mistm-card">
            <div className="mistm-card-header">
              <h3>Top Rated Suppliers</h3>
              <p>By rating score</p>
            </div>
            <div className="mistm-table-container">
              {supplierRatings.length > 0 ? (
                <table className="mistm-table">
                  <thead>
                    <tr>
                      <th>Supplier</th>
                      <th>Contact</th>
                      <th>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplierRatings.map((supplier) => (
                      <tr key={supplier._id}>
                        <td>{supplier.name}</td>
                        <td>
                          {supplier.email}<br/>
                          {supplier.phone}
                        </td>
                        <td>
                          <div className="mistm-rating">
                            {[...Array(5)].map((_, i) => (
                              <span 
                                key={i} 
                                className={i < (supplier.rating || 0) ? 'mistm-star-filled' : 'mistm-star-empty'}
                              >
                                ★
                              </span>
                            ))}
                            <span className="mistm-rating-text">{supplier.rating || 0}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="mistm-empty-state">No suppliers found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}