import React, { useState } from "react";

const RentalNotes = ({ rental, onClose, onSave }) => {
  const [notes, setNotes] = useState(rental.notes || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(rental._id, notes);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header bg-info bg-opacity-25">
            <h5 className="modal-title">Rental Notes</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="fw-bold mb-2">Tool:</label>
              <p>
                {rental.toolId
                  ? `${rental.toolId.model} (SN: ${rental.toolId.serial})`
                  : "Tool information unavailable"}
              </p>
            </div>
            <div className="mb-3">
              <label className="fw-bold mb-2">Rental Period:</label>
              <p>
                {new Date(rental.rentalStartDate).toLocaleDateString()} to{" "}
                {new Date(rental.rentalEndDate).toLocaleDateString()}
              </p>
            </div>
            <div className="mb-3">
              <label htmlFor="notes" className="form-label fw-bold">
                Notes:
              </label>
              <textarea
                id="notes"
                className="form-control"
                rows="5"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this rental (condition issues, late returns, etc.)"
              ></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Notes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RentalNotes;