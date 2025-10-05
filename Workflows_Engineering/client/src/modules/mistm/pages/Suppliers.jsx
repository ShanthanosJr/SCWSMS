import React, { useState, useEffect } from 'react';
import { api } from '../api.js';
import SupplierForm from '../components/SupplierForm.jsx';
import '../App.css';

export default function Suppliers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  // Load suppliers data
  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const data = await api('/suppliers');
      setRows(data);
    } catch (err) {
      console.error('Failed to load suppliers:', err);
      alert('Failed to load suppliers: ' + (err.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (supplier) => {
    try {
      await api('/suppliers', { method: 'POST', body: JSON.stringify(supplier) });
      setCreating(false);
      loadSuppliers();
      alert('Supplier created successfully');
    } catch (err) {
      console.error('Failed to create supplier:', err);
      alert('Failed to create supplier: ' + (err.message || String(err)));
    }
  };

  const handleUpdate = async (supplier) => {
    try {
      await api(`/suppliers/${supplier._id}`, { method: 'PUT', body: JSON.stringify(supplier) });
      setEditing(null);
      loadSuppliers();
      alert('Supplier updated successfully');
    } catch (err) {
      console.error('Failed to update supplier:', err);
      alert('Failed to update supplier: ' + (err.message || String(err)));
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm('Delete this supplier?')) return;
    
    try {
      await api(`/suppliers/${id}`, { method: 'DELETE' });
      loadSuppliers();
      alert('Supplier deleted successfully');
    } catch (err) {
      console.error('Failed to delete supplier:', err);
      alert('Failed to delete supplier: ' + (err.message || String(err)));
    }
  };

  // Render star rating
  const renderRating = (rating) => {
    return (
      <div className="mistm-rating">
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            className={i < (rating || 0) ? 'mistm-star-filled' : 'mistm-star-empty'}
          >
            ★
          </span>
        ))}
        <span className="mistm-rating-text">({rating || 0})</span>
      </div>
    );
  };

  return (
    <div className="mistm-container">
      <div className="mistm-header">
        <h1>Suppliers Management</h1>
        <p>Manage supplier information and relationships</p>
      </div>
      
      <div className="mistm-controls">
        <div></div> {/* Empty div for spacing */}
        <button 
          className="mistm-btn mistm-btn-primary"
          onClick={() => setCreating(true)}
        >
          <span>+</span> Add Supplier
        </button>
      </div>

      {creating && (
        <div className="mistm-card">
          <SupplierForm onSubmit={handleCreate} onCancel={() => setCreating(false)} />
        </div>
      )}
      
      {editing && (
        <div className="mistm-card">
          <SupplierForm initial={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} />
        </div>
      )}

      <div className="mistm-table-container">
        {loading ? (
          <div className="mistm-loading">
            <div className="mistm-spinner"></div>
            <p>Loading suppliers...</p>
          </div>
        ) : (
          <table className="mistm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((supplier) => (
                <tr key={supplier._id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.phone}</td>
                  <td>{supplier.address}</td>
                  <td>{renderRating(supplier.rating)}</td>
                  <td>
                    <div className="mistm-actions">
                      <button 
                        onClick={() => setEditing(supplier)}
                        className="mistm-action-btn mistm-action-btn-edit"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(supplier._id)}
                        className="mistm-action-btn mistm-action-btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan="6" className="mistm-empty-state">
                    No suppliers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}