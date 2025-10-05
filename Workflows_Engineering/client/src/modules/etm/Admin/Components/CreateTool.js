import React, { useState } from "react";

const CreateTool = ({ onSave, onClose }) => {
  const [form, setForm] = useState({
    model: "",
    serial: "",
    purchaseDate: "",
    status: "available",
    depreciationRate: 0.1,
    usageHours: 0,
    price: "",
    image: "",
  });

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Serial: only numbers
    if (name === "serial") {
      if (!/^\d*$/.test(value)) return;
    }

    // Depreciation Rate: only positive numbers, no special chars
    if (name === "depreciationRate") {
      if (!/^\d*\.?\d*$/.test(value)) return;
      if (value && parseFloat(value) < 0) return;
    }

    // Usage Hours: only positive integers
    if (name === "usageHours") {
      if (!/^\d*$/.test(value)) return;
      if (value && parseInt(value) < 0) return;
    }

    // Price: only positive numbers, no special chars
    if (name === "price") {
      if (!/^\d*\.?\d*$/.test(value)) return;
      if (value && parseFloat(value) < 0) return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  // Handle image file and convert to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (limit to 2MB for example)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.purchaseDate > today) {
      alert("Purchase date cannot be in the future.");
      return;
    }
    onSave(form);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header bg-warning bg-opacity-25">
            <h5 className="modal-title">Add New Tool</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              {/* Left Side: Image Preview */}
              <div className="col-md-4 text-center">
                <label className="form-label">Image</label>
                <input
                  type="file"
                  className="form-control mb-3"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {form.image ? (
                  <img
                    src={form.image}
                    alt="Preview"
                    className="img-fluid rounded"
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                ) : (
                  <div className="text-muted">No Image Selected</div>
                )}
              </div>

              {/* Right Side: Form Fields */}
              <div className="col-md-8">
                <div className="mb-3">
                  <label className="form-label">Model</label>
                  <input
                    type="text"
                    className="form-control"
                    name="model"
                    value={form.model}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Serial Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="serial"
                    value={form.serial}
                    onChange={handleChange}
                    required
                    inputMode="numeric"
                    pattern="\d*"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Purchase Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="purchaseDate"
                    value={form.purchaseDate}
                    onChange={handleChange}
                    required
                    max={today}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="available">Available</option>
                    <option value="in use">In Use</option>
                    <option value="under maintenance">Under Maintenance</option>
                    <option value="retired">Retired</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="text"
                    className="form-control"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                    inputMode="decimal"
                    pattern="^\d*\.?\d*$"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Depreciation Rate</label>
                  <input
                    type="text"
                    className="form-control"
                    name="depreciationRate"
                    value={form.depreciationRate}
                    onChange={handleChange}
                    step="0.01"
                    inputMode="decimal"
                    pattern="^\d*\.?\d*$"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Usage Hours</label>
                  <input
                    type="text"
                    className="form-control"
                    name="usageHours"
                    value={form.usageHours}
                    onChange={handleChange}
                    inputMode="numeric"
                    pattern="\d*"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-warning">
              Add Tool
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTool;