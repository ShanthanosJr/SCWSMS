import React, { useEffect, useState } from "react";
import {
  getWorkers,
  createWorker,
  updateWorker,
  deleteWorker,
  getNextWorkerId,
  getWorker,
} from "../services/workerService";
import "../styles/globals.css";

export default function Workers() {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    workerId: "",
    name: "",
    dob: "",
    contactInfo: "",
    emergencyDetails: "",
    role: "",
    phone: "",
    hireDate: "",
    shiftSchedule: "",
  });
  const [editing, setEditing] = useState(null);
  const [viewingWorker, setViewingWorker] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Load workers when component mounts
  useEffect(() => {
    loadWorkers();
    loadNextWorkerId();
  }, []);

  // Filter workers based on search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredWorkers(workers);
    } else {
      const filtered = workers.filter(
        (worker) =>
          worker.workerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          worker.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (worker.contact?.phone && worker.contact.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (worker.contact?.email && worker.contact.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredWorkers(filtered);
    }
  }, [workers, searchQuery]);

  const loadWorkers = async () => {
    try {
      const data = await getWorkers();
      setWorkers(data);
    } catch (err) {
      console.error("Failed to load workers:", err);
      alert("❌ Failed to load workers");
    }
  };

  const loadNextWorkerId = async () => {
    // Only load next worker ID when NOT editing and workerId is empty
    if (!editing && !form.workerId) {
      try {
        const response = await getNextWorkerId();
        setForm((prev) => ({ ...prev, workerId: response.nextWorkerId }));
      } catch (err) {
        console.error("Failed to get next worker ID:", err);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(form.name.trim())) {
      newErrors.name = "Name should contain only letters and spaces";
    }

    // DOB validation
    if (!form.dob) {
      newErrors.dob = "Date of birth is required";
    } else {
      const dobDate = new Date(form.dob);
      const today = new Date();
      const age = today.getFullYear() - dobDate.getFullYear();
      if (age < 18 || age > 65) {
        newErrors.dob = "Age should be between 18 and 65 years";
      }
    }

    // Phone validation
    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.phone.trim().replace(/\D/g, ""))) {
      newErrors.phone = "Phone number should be 10 digits";
    }

    // Role validation
    if (!form.role.trim()) {
      newErrors.role = "Role is required";
    }

    // Email validation (if provided)
    if (form.contactInfo && form.contactInfo.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.contactInfo.trim())) {
        newErrors.contactInfo = "Please enter a valid email address";
      }
    }

    // Hire date validation
    if (!form.hireDate) {
      newErrors.hireDate = "Hire date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("⚠️ Please fix the validation errors before submitting");
      return;
    }

    setLoading(true);
    try {
      // Prepare the data in the correct format
      const workerData = {
        workerId: form.workerId.trim(),
        name: form.name.trim(),
        dob: form.dob,
        contact: {
          email: form.contactInfo.trim(),
          phone: form.phone.trim(),
          emergencyContact: form.emergencyDetails.trim()
        },
        role: form.role.trim(),
        hireDate: form.hireDate,
        shiftSchedule: form.shiftSchedule.trim(),
      };

      if (editing) {
        await updateWorker(editing._id, workerData);
        alert("✅ Worker updated successfully");
      } else {
        await createWorker(workerData);
        alert("✅ Worker created successfully");
      }

      // Reset form
      resetForm();
      loadWorkers();
    } catch (err) {
      console.error("Worker save failed:", err);
      alert(`❌ Failed to save worker: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      workerId: "",
      name: "",
      dob: "",
      contactInfo: "",
      emergencyDetails: "",
      role: "",
      phone: "",
      hireDate: "",
      shiftSchedule: "",
    });
    setEditing(null);
    setErrors({});
    // Load next worker ID only after form is reset and not editing
    setTimeout(() => {
      loadNextWorkerId();
    }, 100);
  };

  const handleEdit = (w) => {
    setForm({
      workerId: w.workerId || "",
      name: w.name || "",
      dob: w.dob ? new Date(w.dob).toISOString().split("T")[0] : "",
      contactInfo: w.contact?.email || "",
      emergencyDetails: w.contact?.emergencyContact || "",
      role: w.role || "",
      phone: w.contact?.phone || "",
      hireDate: w.hireDate ? new Date(w.hireDate).toISOString().split("T")[0] : "",
      shiftSchedule: w.shiftSchedule || "",
    });
    setEditing(w);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this worker?")) return;

    try {
      await deleteWorker(id);
      alert("✅ Worker deleted successfully");
      loadWorkers();
    } catch (err) {
      console.error("Worker delete failed:", err);
      alert(`❌ Failed to delete worker: ${err.message}`);
    }
  };

  const handleView = async (id) => {
    try {
      const worker = await getWorker(id);
      setViewingWorker(worker);
    } catch (err) {
      console.error("Failed to fetch worker details:", err);
      alert(`❌ Failed to fetch worker details: ${err.message}`);
    }
  };

  return (
    <div className="wspm-container">
      {/* Header */}
      <div className="wspm-header">
        <h1>Workers Management</h1>
        <p>Manage your workforce efficiently</p>
      </div>

      {/* Search and Add Worker Button */}
      <div className="wspm-content-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ flex: 1, marginRight: '20px' }}>
            <input
              type="text"
              placeholder="Search workers by ID, name, role, phone or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="wspm-form-input"
              style={{ width: '100%' }}
            />
          </div>
          <button 
            className="wspm-btn wspm-btn-primary"
            onClick={resetForm}
          >
            ➕ Add New Worker
          </button>
        </div>

        {/* Worker Form */}
        {(editing || !editing) && (
          <div className="wspm-content-card" style={{ marginBottom: '20px' }}>
            <h3>{editing ? "Edit Worker" : "Add New Worker"}</h3>
            <div className="wspm-form-row">
              <input
                type="text"
                name="workerId"
                placeholder="Worker ID"
                value={form.workerId}
                onChange={handleChange}
                className="wspm-form-input"
                readOnly={!!editing}
              />
              {errors.workerId && <div className="wspm-alert wspm-alert-error">{errors.workerId}</div>}
              
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="wspm-form-input"
              />
              {errors.name && <div className="wspm-alert wspm-alert-error">{errors.name}</div>}
              
              <input
                type="date"
                name="dob"
                placeholder="Date of Birth"
                value={form.dob}
                onChange={handleChange}
                className="wspm-form-input"
              />
              {errors.dob && <div className="wspm-alert wspm-alert-error">{errors.dob}</div>}
            </div>
            
            <div className="wspm-form-row">
              <input
                type="text"
                name="contactInfo"
                placeholder="Email Address"
                value={form.contactInfo}
                onChange={handleChange}
                className="wspm-form-input"
              />
              {errors.contactInfo && <div className="wspm-alert wspm-alert-error">{errors.contactInfo}</div>}
              
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="wspm-form-input"
              />
              {errors.phone && <div className="wspm-alert wspm-alert-error">{errors.phone}</div>}
              
              <input
                type="text"
                name="role"
                placeholder="Job Role"
                value={form.role}
                onChange={handleChange}
                className="wspm-form-input"
              />
              {errors.role && <div className="wspm-alert wspm-alert-error">{errors.role}</div>}
            </div>
            
            <div className="wspm-form-row">
              <input
                type="date"
                name="hireDate"
                placeholder="Hire Date"
                value={form.hireDate}
                onChange={handleChange}
                className="wspm-form-input"
              />
              {errors.hireDate && <div className="wspm-alert wspm-alert-error">{errors.hireDate}</div>}
              
              <input
                type="text"
                name="shiftSchedule"
                placeholder="Shift Schedule"
                value={form.shiftSchedule}
                onChange={handleChange}
                className="wspm-form-input"
              />
            </div>
            
            <div className="wspm-form-row">
              <textarea
                name="emergencyDetails"
                placeholder="Emergency Contact Details"
                value={form.emergencyDetails}
                onChange={handleChange}
                className="wspm-form-input"
                style={{ minHeight: '80px' }}
              />
            </div>
            
            <div className="wspm-form-btn-group">
              <button 
                className="wspm-btn wspm-btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "🔄 Saving..." : (editing ? "💾 Update Worker" : "💾 Create Worker")}
              </button>
              <button 
                className="wspm-btn wspm-btn-secondary"
                onClick={resetForm}
              >
                🔄 Cancel
              </button>
            </div>
          </div>
        )}

        {/* Workers Table */}
        <div className="wspm-table-container">
          <table className="wspm-table">
            <thead>
              <tr>
                <th>Worker ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Hire Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.length > 0 ? (
                filteredWorkers.map((worker) => (
                  <tr key={worker._id}>
                    <td>{worker.workerId}</td>
                    <td>{worker.name}</td>
                    <td>{worker.role}</td>
                    <td>{worker.contact?.phone || ''}</td>
                    <td>{worker.hireDate ? new Date(worker.hireDate).toLocaleDateString() : ''}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          className="wspm-btn wspm-btn-primary"
                          onClick={() => handleView(worker._id)}
                          style={{ padding: '5px 10px', fontSize: '12px' }}
                        >
                          👁️ View
                        </button>
                        <button 
                          className="wspm-btn wspm-btn-secondary"
                          onClick={() => handleEdit(worker)}
                          style={{ padding: '5px 10px', fontSize: '12px' }}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="wspm-btn wspm-btn-secondary"
                          onClick={() => handleDelete(worker._id)}
                          style={{ padding: '5px 10px', fontSize: '12px', backgroundColor: '#dc3545' }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="wspm-empty-state">
                    {searchQuery ? "No workers found matching your search" : "No workers found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
