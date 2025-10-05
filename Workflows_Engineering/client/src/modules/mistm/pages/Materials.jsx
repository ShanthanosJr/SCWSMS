import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api.js';
import MaterialForm from '../components/MaterialForm.jsx';
import ReceiveDialog from '../components/ReceiveDialog.jsx';
import ConsumeDialog from '../components/ConsumeDialog.jsx';
import '../App.css';

export default function Materials() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [receivingFor, setReceivingFor] = useState(null);
  const [consumingFor, setConsumingFor] = useState(null);
  const [onlyLow, setOnlyLow] = useState(false);

  const loadMaterials = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api(`/materials${onlyLow ? '?lowStock=1' : ''}`);
      setRows(data);
    } catch (err) {
      console.error('Failed to load materials:', err);
      alert('Failed to load materials: ' + (err.message || String(err)));
    } finally {
      setLoading(false);
    }
  }, [onlyLow]);

  // Load materials data
  useEffect(() => {
    loadMaterials();
  }, [loadMaterials]);

  const handleCreate = async (material) => {
    try {
      await api('/materials', { method: 'POST', body: JSON.stringify(material) });
      setCreating(false);
      loadMaterials();
      alert('Material created successfully');
    } catch (err) {
      console.error('Failed to create material:', err);
      alert('Failed to create material: ' + (err.message || String(err)));
    }
  };

  const handleUpdate = async (material) => {
    try {
      await api(`/materials/${material._id}`, { method: 'PUT', body: JSON.stringify(material) });
      setEditing(null);
      loadMaterials();
      alert('Material updated successfully');
    } catch (err) {
      console.error('Failed to update material:', err);
      alert('Failed to update material: ' + (err.message || String(err)));
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm('Delete this material?')) return;
    
    try {
      await api(`/materials/${id}`, { method: 'DELETE' });
      loadMaterials();
      alert('Material deleted successfully');
    } catch (err) {
      console.error('Failed to delete material:', err);
      alert('Failed to delete material: ' + (err.message || String(err)));
    }
  };

  const handleReceive = async (payload) => {
    if (!receivingFor) return;
    
    try {
      await api(`/materials/${receivingFor._id}/receive`, { method: 'POST', body: JSON.stringify(payload) });
      setReceivingFor(null);
      loadMaterials();
      alert(`Received ${payload.quantity} ${receivingFor.unit} of ${receivingFor.name}`);
    } catch (err) {
      console.error('Failed to receive material:', err);
      alert('Failed to receive material: ' + (err.message || String(err)));
    }
  };

  const handleConsume = async (payload) => {
    if (!consumingFor) return;
    
    try {
      await api(`/materials/${consumingFor._id}/consume`, { method: 'POST', body: JSON.stringify(payload) });
      setConsumingFor(null);
      loadMaterials();
      alert(`Consumed ${payload.quantity} ${consumingFor.unit} of ${consumingFor.name}`);
    } catch (err) {
      console.error('Failed to consume material:', err);
      alert('Failed to consume material: ' + (err.message || String(err)));
    }
  };

  return (
    <div className="mistm-container">
      <div className="mistm-header">
        <h1>Materials Management</h1>
        <p>Track stock, receive/consume, and manage materials</p>
      </div>
      
      <div className="mistm-controls">
        <div className="mistm-filters">
          <label className="mistm-checkbox-container">
            <input
              type="checkbox"
              checked={onlyLow}
              onChange={e => setOnlyLow(e.target.checked)}
            />
            <span>Only low-stock</span>
          </label>
        </div>
        
        <button 
          className="mistm-btn mistm-btn-primary"
          onClick={() => setCreating(true)}
        >
          <span>+</span> Add Material
        </button>
      </div>

      {creating && (
        <div className="mistm-card">
          <MaterialForm onSubmit={handleCreate} onCancel={() => setCreating(false)} />
        </div>
      )}
      
      {editing && (
        <div className="mistm-card">
          <MaterialForm initial={editing} onSubmit={handleUpdate} onCancel={() => setEditing(null)} />
        </div>
      )}
      
      {receivingFor && (
        <div className="mistm-card">
          <ReceiveDialog onSubmit={handleReceive} onCancel={() => setReceivingFor(null)} />
        </div>
      )}
      
      {consumingFor && (
        <div className="mistm-card">
          <ConsumeDialog onSubmit={handleConsume} onCancel={() => setConsumingFor(null)} />
        </div>
      )}

      <div className="mistm-table-container">
        {loading ? (
          <div className="mistm-loading">
            <div className="mistm-spinner"></div>
            <p>Loading materials...</p>
          </div>
        ) : (
          <table className="mistm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Unit</th>
                <th>Qty</th>
                <th>Min</th>
                <th>Status</th>
                <th>Avg Cost</th>
                <th>Last Cost</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((material) => (
                <tr key={material._id}>
                  <td>{material.name}</td>
                  <td>{material.category}</td>
                  <td>{material.unit}</td>
                  <td>{material.quantity}</td>
                  <td>{material.minStock}</td>
                  <td>
                    <span className={`mistm-status-badge ${material.lowStock ? 'mistm-status-low' : 'mistm-status-ok'}`}>
                      {material.lowStock ? 'Low' : 'OK'}
                    </span>
                  </td>
                  <td>{material.avgUnitCost != null ? Number(material.avgUnitCost).toFixed(2) : ''}</td>
                  <td>{material.lastUnitCost != null ? Number(material.lastUnitCost).toFixed(2) : ''}</td>
                  <td>
                    <div className="mistm-actions">
                      <button 
                        onClick={() => setReceivingFor(material)}
                        className="mistm-action-btn mistm-action-btn-receive"
                      >
                        Receive
                      </button>
                      <button 
                        onClick={() => setConsumingFor(material)}
                        className="mistm-action-btn mistm-action-btn-consume"
                      >
                        Consume
                      </button>
                      <button 
                        onClick={() => setEditing(material)}
                        className="mistm-action-btn mistm-action-btn-edit"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(material._id)}
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
                  <td colSpan="9" className="mistm-empty-state">
                    No materials found{onlyLow ? ' with low stock.' : '.'}
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