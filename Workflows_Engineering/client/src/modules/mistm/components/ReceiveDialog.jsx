import React, { useState } from 'react';
import '../App.css';

export default function ReceiveDialog({ onSubmit, onCancel }) {
  const [quantity, setQuantity] = useState(0);
  const [unitCost, setUnitCost] = useState(0);
  const [supplierId, setSupplierId] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <div className="mistm-card">
      <h3>Receive Stock</h3>
      <div className="mistm-form-row">
        <input 
          className="mistm-form-input"
          type="number" 
          placeholder="Quantity" 
          value={quantity} 
          onChange={e=>setQuantity(Number(e.target.value))}
        />
        <input 
          className="mistm-form-input"
          type="number" 
          placeholder="Unit Cost" 
          value={unitCost} 
          onChange={e=>setUnitCost(Number(e.target.value))}
        />
        <input 
          className="mistm-form-input"
          placeholder="Supplier ID (optional)" 
          value={supplierId} 
          onChange={e=>setSupplierId(e.target.value)} 
        />
      </div>
      <div className="mistm-form-row">
        <input 
          className="mistm-form-input"
          placeholder="Notes (optional)" 
          value={notes} 
          onChange={e=>setNotes(e.target.value)} 
        />
      </div>
      <div className="mistm-form-btn-group">
        <button 
          className="mistm-form-btn mistm-form-btn-submit"
          onClick={()=>onSubmit({ supplierId: supplierId || undefined, quantity, unitCost, notes })}
        >
          Receive
        </button>
        <button 
          className="mistm-form-btn mistm-form-btn-cancel"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}