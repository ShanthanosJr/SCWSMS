import React, { useState, useEffect } from 'react';
import '../App.css';

export default function MaterialForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || { name:'', unit:'kg', quantity:0, minStock:0, category:'General' });

  useEffect(() => { if (initial) setForm(initial); }, [initial]);

  return (
    <div className="mistm-card">
      <h3>{initial? 'Edit Material' : 'Add Material'}</h3>
      <div className="mistm-form-row">
        <input 
          className="mistm-form-input"
          placeholder="Name" 
          value={form.name} 
          onChange={e=>setForm({...form, name:e.target.value})}
        />
        <input 
          className="mistm-form-input"
          placeholder="Category" 
          value={form.category||''} 
          onChange={e=>setForm({...form, category:e.target.value})}
        />
        <select 
          className="mistm-form-select"
          value={form.unit||'kg'} 
          onChange={e=>setForm({...form, unit:e.target.value})}
        >
          <option>kg</option>
          <option>bag</option>
          <option>m3</option>
          <option>pcs</option>
        </select>
        <input 
          className="mistm-form-input"
          type="number" 
          placeholder="Quantity" 
          value={form.quantity||0} 
          onChange={e=>setForm({...form, quantity:Number(e.target.value)})}
        />
        <input 
          className="mistm-form-input"
          type="number" 
          placeholder="Min Stock" 
          value={form.minStock||0} 
          onChange={e=>setForm({...form, minStock:Number(e.target.value)})}
        />
      </div>
      <div className="mistm-form-btn-group">
        <button 
          className="mistm-form-btn mistm-form-btn-submit"
          onClick={()=>onSubmit(form)}
        >
          {initial ? 'Update' : 'Create'}
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