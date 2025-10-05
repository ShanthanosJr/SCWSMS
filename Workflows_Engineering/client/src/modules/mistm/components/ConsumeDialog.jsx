import React, { useState } from 'react';
import '../App.css';

export default function ConsumeDialog({ onSubmit, onCancel }) {
  const [quantity, setQuantity] = useState(0);
  const [notes, setNotes] = useState('');

  return (
    <div className="mistm-card">
      <h3>Consume Stock</h3>
      <div className="mistm-form-row">
        <input 
          className="mistm-form-input"
          type="number" 
          placeholder="Quantity" 
          value={quantity} 
          onChange={e=>setQuantity(Number(e.target.value))}
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
          onClick={()=>onSubmit({ quantity, notes })}
        >
          Consume
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