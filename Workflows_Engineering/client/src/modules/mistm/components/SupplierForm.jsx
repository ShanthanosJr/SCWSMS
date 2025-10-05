import React, { useState, useEffect } from 'react';
import '../App.css';

export default function SupplierForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || { name:'', rating:0 });

  useEffect(() => { if (initial) setForm(initial); }, [initial]);

  return (
    <div className="mistm-card">
      <h3>{initial? 'Edit Supplier' : 'Add Supplier'}</h3>
      <div className="mistm-form-row">
        <input 
          className="mistm-form-input"
          placeholder="Name" 
          value={form.name} 
          onChange={e=>setForm({...form, name:e.target.value})}
        />
        <input 
          className="mistm-form-input"
          placeholder="Email" 
          value={form.email||''} 
          onChange={e=>setForm({...form, email:e.target.value})}
        />
        <input 
          className="mistm-form-input"
          placeholder="Phone" 
          value={form.phone||''} 
          onChange={e=>setForm({...form, phone:e.target.value})}
        />
        <input 
          className="mistm-form-input"
          placeholder="Address" 
          value={form.address||''} 
          onChange={e=>setForm({...form, address:e.target.value})}
        />
        <input 
          className="mistm-form-input"
          type="number" 
          placeholder="Rating (0-5)" 
          value={form.rating||0} 
          onChange={e=>setForm({...form, rating:Number(e.target.value)})}
        />
      </div>
      <div className="mistm-form-btn-group">
        <button 
          className="mistm-form-btn mistm-form-btn-submit"
          onClick={()=>onSubmit(form)}
        >
          {initial?'Update':'Create'}
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